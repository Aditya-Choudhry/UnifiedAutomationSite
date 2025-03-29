import { Router, Request, Response, NextFunction } from "express";
import { IStorage } from "../storage";
import { AIService } from "../services/ai";
import { WebSocketService } from "../services/websocket";
import { RedisService } from "../services/redis";
import { APIResponse, AuthUser } from "../types";
import { z } from "zod";
import { log } from "../vite";
import session from 'express-session';

// Add session data to Express.Session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
    email?: string;
    role?: string;
    authorized?: boolean;
  }
}

// Extended request with auth user
interface AuthRequest extends Request {
  user?: AuthUser;
  session: session.Session & Partial<session.SessionData>;
}

// Create API router
export function createApiRouter(
  storage: IStorage,
  redisService: RedisService,
  aiService: AIService,
  wsService: WebSocketService
) {
  const router = Router();
  
  // Middleware to check authentication
  const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "You must be logged in to access this resource"
      });
    }
    
    req.user = {
      id: userId,
      username: req.session?.username || "",
      email: req.session?.email || "",
      role: req.session?.role || "user"
    };
    
    next();
  };
  
  // Middleware to check admin role
  const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to access this resource"
      });
    }
    next();
  };
  
  // Response wrapper
  const apiResponse = <T>(res: Response, data: APIResponse<T>) => {
    return res.json(data);
  };

  // Health check endpoint
  router.get("/health", (req: Request, res: Response) => {
    apiResponse(res, {
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString()
      }
    });
  });
  
  // ====== User Routes ======
  
  // Get current user
  router.get("/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "User not found"
        });
      }
      
      // Don't return sensitive data like password
      const { password, ...userData } = user;
      
      apiResponse(res, {
        success: true,
        data: userData
      });
    } catch (error) {
      log(`Error getting user: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve user data"
      });
    }
  });

  // Update user profile
  router.patch("/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const updateSchema = z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        profileImage: z.string().optional()
      });
      
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Invalid profile data"
        });
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, result.data);
      if (!updatedUser) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "User not found"
        });
      }
      
      // Don't return sensitive data
      const { password, ...userData } = updatedUser;
      
      apiResponse(res, {
        success: true,
        data: userData,
        message: "Profile updated successfully"
      });
    } catch (error) {
      log(`Error updating user: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to update profile"
      });
    }
  });
  
  // ====== Workflow Routes ======
  
  // Get user's workflows
  router.get("/workflows", requireAuth, async (req: AuthRequest, res) => {
    try {
      const workflows = await storage.getWorkflowsByUser(req.user!.id);
      
      apiResponse(res, {
        success: true,
        data: workflows
      });
    } catch (error) {
      log(`Error getting workflows: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve workflows"
      });
    }
  });
  
  // Get public workflows
  router.get("/workflows/public", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const workflows = await storage.getPublicWorkflows(limit);
      
      apiResponse(res, {
        success: true,
        data: workflows
      });
    } catch (error) {
      log(`Error getting public workflows: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve public workflows"
      });
    }
  });
  
  // Get featured workflows
  router.get("/workflows/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const workflows = await storage.getFeaturedWorkflows(limit);
      
      apiResponse(res, {
        success: true,
        data: workflows
      });
    } catch (error) {
      log(`Error getting featured workflows: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve featured workflows"
      });
    }
  });
  
  // Get a single workflow
  router.get("/workflows/:id", async (req: Request & { session?: any }, res: Response) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      const workflow = await storage.getWorkflow(workflowId);
      if (!workflow) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      // Check access permissions
      if (!workflow.isPublic && req.session?.userId !== workflow.userId) {
        return apiResponse(res, {
          success: false,
          error: "Forbidden",
          message: "You do not have permission to access this workflow"
        });
      }
      
      apiResponse(res, {
        success: true,
        data: workflow
      });
    } catch (error) {
      log(`Error getting workflow: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve workflow"
      });
    }
  });
  
  // Create a new workflow
  router.post("/workflows", requireAuth, async (req: AuthRequest, res) => {
    try {
      const createSchema = z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        nodes: z.array(z.any()).min(1),
        isPublic: z.boolean().optional()
      });
      
      const result = createSchema.safeParse(req.body);
      if (!result.success) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Invalid workflow data"
        });
      }
      
      const workflowData = {
        ...result.data,
        userId: req.user!.id
      };
      
      const workflow = await storage.createWorkflow(workflowData);
      
      // Reward user with points for creating a workflow
      await storage.updateUserScore(req.user!.id, 10);
      
      // Send real-time notification to user
      const message = {
        type: "notification",
        title: "Workflow Created",
        message: `Your workflow "${workflow.name}" has been created successfully`,
        data: { workflowId: workflow.id }
      };
      redisService.publish(`user:${req.user!.id}`, JSON.stringify(message));
      
      apiResponse(res, {
        success: true,
        data: workflow,
        message: "Workflow created successfully"
      });
    } catch (error) {
      log(`Error creating workflow: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to create workflow"
      });
    }
  });
  
  // Update a workflow
  router.patch("/workflows/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      // Check if workflow exists and user has permission
      const existing = await storage.getWorkflow(workflowId);
      if (!existing) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      if (existing.userId !== req.user!.id && req.user!.role !== "admin") {
        return apiResponse(res, {
          success: false,
          error: "Forbidden",
          message: "You do not have permission to update this workflow"
        });
      }
      
      const updateSchema = z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        nodes: z.array(z.any()).optional(),
        isPublic: z.boolean().optional(),
        status: z.enum(["draft", "published", "archived"]).optional()
      });
      
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Invalid workflow data"
        });
      }
      
      const updatedWorkflow = await storage.updateWorkflow(workflowId, result.data);
      
      // Send real-time update
      const message = {
        type: "workflow_updated",
        workflowId,
        data: updatedWorkflow
      };
      redisService.publish(`workflow:${workflowId}`, JSON.stringify(message));
      
      apiResponse(res, {
        success: true,
        data: updatedWorkflow,
        message: "Workflow updated successfully"
      });
    } catch (error) {
      log(`Error updating workflow: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to update workflow"
      });
    }
  });
  
  // Delete a workflow
  router.delete("/workflows/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      // Check if workflow exists and user has permission
      const existing = await storage.getWorkflow(workflowId);
      if (!existing) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      if (existing.userId !== req.user!.id && req.user!.role !== "admin") {
        return apiResponse(res, {
          success: false,
          error: "Forbidden",
          message: "You do not have permission to delete this workflow"
        });
      }
      
      const success = await storage.deleteWorkflow(workflowId);
      
      if (success) {
        // Send real-time notification
        const message = {
          type: "workflow_deleted",
          workflowId
        };
        redisService.publish(`user:${req.user!.id}`, JSON.stringify(message));
      }
      
      apiResponse(res, {
        success,
        message: success 
          ? "Workflow deleted successfully" 
          : "Failed to delete workflow"
      });
    } catch (error) {
      log(`Error deleting workflow: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to delete workflow"
      });
    }
  });
  
  // ====== Workflow Social Features ======
  
  // Like/unlike a workflow
  router.post("/workflows/:id/like", requireAuth, async (req: AuthRequest, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      // Check if workflow exists
      const workflow = await storage.getWorkflow(workflowId);
      if (!workflow) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      // Toggle like status
      const isLiked = await storage.toggleWorkflowLike(workflowId, req.user!.id);
      
      // Get updated like count
      const likeCount = await storage.getWorkflowLikes(workflowId);
      
      // If workflow is liked, reward the creator with points (except for self-likes)
      if (isLiked && workflow.userId !== req.user!.id) {
        await storage.updateUserScore(workflow.userId, 2);
      }
      
      // Send real-time notification to workflow owner
      if (isLiked && workflow.userId !== req.user!.id) {
        const message = {
          type: "notification",
          title: "New Like!",
          message: `Your workflow "${workflow.name}" was liked by a user`,
          data: { workflowId }
        };
        redisService.publish(`user:${workflow.userId}`, JSON.stringify(message));
      }
      
      apiResponse(res, {
        success: true,
        data: {
          liked: isLiked,
          likeCount
        },
        message: isLiked 
          ? "Workflow liked successfully" 
          : "Workflow unliked successfully"
      });
    } catch (error) {
      log(`Error toggling workflow like: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to update like status"
      });
    }
  });
  
  // Add a comment to a workflow
  router.post("/workflows/:id/comments", requireAuth, async (req: AuthRequest, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      // Check if workflow exists
      const workflow = await storage.getWorkflow(workflowId);
      if (!workflow) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      const commentSchema = z.object({
        content: z.string().min(1).max(1000)
      });
      
      const result = commentSchema.safeParse(req.body);
      if (!result.success) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Invalid comment data"
        });
      }
      
      const commentData = {
        workflowId,
        userId: req.user!.id,
        content: result.data.content
      };
      
      const comment = await storage.createWorkflowComment(commentData);
      
      // Reward the user with points for engaging (except for own workflows)
      if (workflow.userId !== req.user!.id) {
        await storage.updateUserScore(req.user!.id, 1);
        await storage.updateUserScore(workflow.userId, 3); // Reward workflow owner
      }
      
      // Send real-time notification to workflow owner
      if (workflow.userId !== req.user!.id) {
        const message = {
          type: "notification",
          title: "New Comment!",
          message: `Someone commented on your workflow "${workflow.name}"`,
          data: { workflowId }
        };
        redisService.publish(`user:${workflow.userId}`, JSON.stringify(message));
      }
      
      // Send real-time update to workflow subscribers
      const updateMessage = {
        type: "new_comment",
        workflowId,
        comment
      };
      redisService.publish(`workflow:${workflowId}`, JSON.stringify(updateMessage));
      
      apiResponse(res, {
        success: true,
        data: comment,
        message: "Comment added successfully"
      });
    } catch (error) {
      log(`Error adding comment: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to add comment"
      });
    }
  });
  
  // Get comments for a workflow
  router.get("/workflows/:id/comments", async (req: Request, res: Response) => {
    try {
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return apiResponse(res, {
          success: false,
          error: "Invalid ID",
          message: "Workflow ID must be a number"
        });
      }
      
      // Check if workflow exists
      const workflow = await storage.getWorkflow(workflowId);
      if (!workflow) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Workflow not found"
        });
      }
      
      const comments = await storage.getWorkflowComments(workflowId);
      
      apiResponse(res, {
        success: true,
        data: comments
      });
    } catch (error) {
      log(`Error getting comments: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve comments"
      });
    }
  });
  
  // ====== Integration Routes ======
  
  // Get user's integrations
  router.get("/integrations", requireAuth, async (req: AuthRequest, res) => {
    try {
      const integrations = await storage.getIntegrationsByUser(req.user!.id);
      
      apiResponse(res, {
        success: true,
        data: integrations
      });
    } catch (error) {
      log(`Error getting integrations: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve integrations"
      });
    }
  });
  
  // Create a new integration
  router.post("/integrations", requireAuth, async (req: AuthRequest, res) => {
    try {
      const createSchema = z.object({
        name: z.string().min(1).max(100),
        type: z.enum(["email", "crm", "task", "notification", "social", "custom"]),
        config: z.record(z.any())
      });
      
      const result = createSchema.safeParse(req.body);
      if (!result.success) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Invalid integration data"
        });
      }
      
      const integrationData = {
        ...result.data,
        userId: req.user!.id
      };
      
      const integration = await storage.createIntegration(integrationData);
      
      // Reward user with points for adding an integration
      await storage.updateUserScore(req.user!.id, 5);
      
      apiResponse(res, {
        success: true,
        data: integration,
        message: "Integration created successfully"
      });
    } catch (error) {
      log(`Error creating integration: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to create integration"
      });
    }
  });
  
  // ====== AI Workflow Suggestion Routes ======
  
  // Get workflow suggestions based on query
  router.get("/suggestions", async (req: Request & { session?: any }, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 3) {
        return apiResponse(res, {
          success: false,
          error: "Validation Error",
          message: "Query must be at least 3 characters long"
        });
      }
      
      const userId = req.session?.userId;
      const context = {
        userSkill: (req.query.skill as any) || "beginner"
      };
      
      const suggestions = await aiService.generateWorkflowSuggestions({
        query,
        userId,
        context
      });
      
      apiResponse(res, {
        success: true,
        data: suggestions
      });
    } catch (error) {
      log(`Error generating suggestions: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to generate workflow suggestions"
      });
    }
  });
  
  // ====== Onboarding Routes ======
  
  // Get onboarding progress
  router.get("/onboarding", requireAuth, async (req: AuthRequest, res) => {
    try {
      const progress = await storage.getOnboardingProgress(req.user!.id);
      
      if (!progress) {
        // Create onboarding progress if it doesn't exist
        const newProgress = await storage.createOnboardingProgress(req.user!.id);
        
        return apiResponse(res, {
          success: true,
          data: newProgress
        });
      }
      
      apiResponse(res, {
        success: true,
        data: progress
      });
    } catch (error) {
      log(`Error getting onboarding progress: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to retrieve onboarding progress"
      });
    }
  });
  
  // Update onboarding progress
  router.post("/onboarding/step/:step", requireAuth, async (req: AuthRequest, res) => {
    try {
      const step = parseInt(req.params.step);
      if (isNaN(step) || step < 1) {
        return apiResponse(res, {
          success: false,
          error: "Invalid Step",
          message: "Step must be a positive number"
        });
      }
      
      const completed = req.body.completed === true;
      
      const progress = await storage.updateOnboardingProgress(req.user!.id, step, completed);
      
      if (!progress) {
        return apiResponse(res, {
          success: false,
          error: "Not Found",
          message: "Onboarding progress not found"
        });
      }
      
      // Reward user with points for completing onboarding steps
      if (completed) {
        await storage.updateUserScore(req.user!.id, 2);
      }
      
      apiResponse(res, {
        success: true,
        data: progress,
        message: `Onboarding step ${step} ${completed ? 'completed' : 'updated'}`
      });
    } catch (error) {
      log(`Error updating onboarding progress: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to update onboarding progress"
      });
    }
  });
  
  // Complete onboarding
  router.post("/onboarding/complete", requireAuth, async (req: AuthRequest, res) => {
    try {
      const success = await storage.completeOnboarding(req.user!.id);
      
      if (success) {
        // Reward user with points for completing onboarding
        await storage.updateUserScore(req.user!.id, 20);
        
        // Send real-time notification
        const message = {
          type: "notification",
          title: "Onboarding Complete!",
          message: "Congratulations on completing the onboarding process! Explore the full platform now.",
          data: { achievement: "onboarding_complete" }
        };
        redisService.publish(`user:${req.user!.id}`, JSON.stringify(message));
      }
      
      apiResponse(res, {
        success,
        message: success 
          ? "Onboarding completed successfully" 
          : "Failed to complete onboarding"
      });
    } catch (error) {
      log(`Error completing onboarding: ${error}`, "api");
      apiResponse(res, {
        success: false,
        error: "Server Error",
        message: "Failed to complete onboarding"
      });
    }
  });
  
  return router;
}