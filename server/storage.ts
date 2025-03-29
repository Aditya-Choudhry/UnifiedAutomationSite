import { 
  users, type User, type InsertUser,
  workflows, type Workflow, type InsertWorkflow,
  integrations, type Integration, type InsertIntegration,
  workflowComments, type WorkflowComment, type InsertWorkflowComment,
  workflowExecutions, type WorkflowExecution,
  workflowLikes, type WorkflowLike,
  onboardingProgress, type OnboardingProgress
} from "@shared/schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { NodeData } from "../client/src/components/demo/WorkflowNode";

// Create database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Advanced storage interface with comprehensive CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserScore(id: number, points: number): Promise<User | undefined>;
  
  // Workflow operations
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByUser(userId: number): Promise<Workflow[]>;
  getPublicWorkflows(limit?: number): Promise<Workflow[]>;
  getFeaturedWorkflows(limit?: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflowData: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  calculateComplexityScore(nodes: NodeData[]): number;
  
  // Integration operations
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrationsByUser(userId: number): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, integrationData: Partial<Integration>): Promise<Integration | undefined>;
  deleteIntegration(id: number): Promise<boolean>;
  
  // Workflow execution operations
  createWorkflowExecution(workflowId: number, status: string): Promise<WorkflowExecution>;
  updateWorkflowExecution(id: number, data: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined>;
  getWorkflowExecutions(workflowId: number, limit?: number): Promise<WorkflowExecution[]>;
  
  // Social and community operations
  createWorkflowComment(comment: InsertWorkflowComment): Promise<WorkflowComment>;
  getWorkflowComments(workflowId: number): Promise<WorkflowComment[]>;
  toggleWorkflowLike(workflowId: number, userId: number): Promise<boolean>;
  getWorkflowLikes(workflowId: number): Promise<number>;
  hasUserLikedWorkflow(workflowId: number, userId: number): Promise<boolean>;
  
  // Onboarding operations
  getOnboardingProgress(userId: number): Promise<OnboardingProgress | undefined>;
  createOnboardingProgress(userId: number): Promise<OnboardingProgress>;
  updateOnboardingProgress(userId: number, step: number, completed: boolean): Promise<OnboardingProgress | undefined>;
  completeOnboarding(userId: number): Promise<boolean>;
}

// PostgreSQL implementation of the storage interface
export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async updateUserScore(id: number, points: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ 
        gamificationScore: sql`${users.gamificationScore} + ${points}`, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Workflow operations
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const result = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getWorkflowsByUser(userId: number): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.updatedAt));
  }

  async getPublicWorkflows(limit = 10): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.isPublic, true))
      .orderBy(desc(workflows.updatedAt))
      .limit(limit);
  }

  async getFeaturedWorkflows(limit = 6): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(and(eq(workflows.isPublic, true), eq(workflows.isFeatured, true)))
      .orderBy(desc(workflows.updatedAt))
      .limit(limit);
  }

  async createWorkflow(workflowData: InsertWorkflow): Promise<Workflow> {
    // Calculate complexity score for the workflow
    const complexityScore = this.calculateComplexityScore(workflowData.nodes as unknown as NodeData[]);
    
    const result = await db
      .insert(workflows)
      .values({ ...workflowData, complexityScore })
      .returning();
    
    return result[0];
  }

  async updateWorkflow(id: number, workflowData: Partial<Workflow>): Promise<Workflow | undefined> {
    // If nodes are updated, recalculate complexity score
    let updatedData = { ...workflowData, updatedAt: new Date() };
    
    if (workflowData.nodes) {
      const complexityScore = this.calculateComplexityScore(workflowData.nodes as unknown as NodeData[]);
      updatedData = { ...updatedData, complexityScore };
    }
    
    const result = await db
      .update(workflows)
      .set(updatedData)
      .where(eq(workflows.id, id))
      .returning();
      
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const result = await db
      .delete(workflows)
      .where(eq(workflows.id, id))
      .returning({ id: workflows.id });
      
    return result.length > 0;
  }

  calculateComplexityScore(nodes: NodeData[]): number {
    if (!nodes || !Array.isArray(nodes)) return 0;
    
    // Base score is the number of nodes
    let score = nodes.length * 10;
    
    // Add points for connections between nodes
    const connections = nodes.reduce((count, node) => {
      return count + (node.connectedTo?.length || 0);
    }, 0);
    score += connections * 5;
    
    // Add points for different node types
    const uniqueTypes = new Set(nodes.map(node => node.type)).size;
    score += uniqueTypes * 15;
    
    // Add points for configuration complexity
    const configComplexity = nodes.reduce((count, node) => {
      return count + (node.configData ? Object.keys(node.configData).length * 3 : 0);
    }, 0);
    score += configComplexity;
    
    return score;
  }

  // Integration operations
  async getIntegration(id: number): Promise<Integration | undefined> {
    const result = await db.select().from(integrations).where(eq(integrations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getIntegrationsByUser(userId: number): Promise<Integration[]> {
    return await db
      .select()
      .from(integrations)
      .where(eq(integrations.userId, userId))
      .orderBy(desc(integrations.updatedAt));
  }

  async createIntegration(integrationData: InsertIntegration): Promise<Integration> {
    const result = await db
      .insert(integrations)
      .values(integrationData)
      .returning();
      
    return result[0];
  }

  async updateIntegration(id: number, integrationData: Partial<Integration>): Promise<Integration | undefined> {
    const result = await db
      .update(integrations)
      .set({ ...integrationData, updatedAt: new Date() })
      .where(eq(integrations.id, id))
      .returning();
      
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteIntegration(id: number): Promise<boolean> {
    const result = await db
      .delete(integrations)
      .where(eq(integrations.id, id))
      .returning({ id: integrations.id });
      
    return result.length > 0;
  }

  // Workflow execution operations
  async createWorkflowExecution(workflowId: number, status: string): Promise<WorkflowExecution> {
    // Increment the execution count for the workflow
    await db
      .update(workflows)
      .set({ 
        executionCount: sql`${workflows.executionCount} + 1`,
        lastExecutedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(workflows.id, workflowId));
    
    const result = await db
      .insert(workflowExecutions)
      .values({
        workflowId,
        status,
        logs: [],
        result: {}
      })
      .returning();
      
    return result[0];
  }

  async updateWorkflowExecution(id: number, data: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined> {
    const updateData = { ...data };
    
    // If status is changed to a completion state, add completion timestamp
    if (data.status === 'success' || data.status === 'failed') {
      updateData.completedAt = new Date();
    }
    
    const result = await db
      .update(workflowExecutions)
      .set(updateData)
      .where(eq(workflowExecutions.id, id))
      .returning();
      
    return result.length > 0 ? result[0] : undefined;
  }

  async getWorkflowExecutions(workflowId: number, limit = 10): Promise<WorkflowExecution[]> {
    return await db
      .select()
      .from(workflowExecutions)
      .where(eq(workflowExecutions.workflowId, workflowId))
      .orderBy(desc(workflowExecutions.startedAt))
      .limit(limit);
  }

  // Social and community operations
  async createWorkflowComment(commentData: InsertWorkflowComment): Promise<WorkflowComment> {
    const result = await db
      .insert(workflowComments)
      .values(commentData)
      .returning();
      
    return result[0];
  }

  async getWorkflowComments(workflowId: number): Promise<WorkflowComment[]> {
    return await db
      .select()
      .from(workflowComments)
      .where(eq(workflowComments.workflowId, workflowId))
      .orderBy(desc(workflowComments.createdAt));
  }

  async toggleWorkflowLike(workflowId: number, userId: number): Promise<boolean> {
    // Check if the user already liked this workflow
    const existingLike = await db
      .select()
      .from(workflowLikes)
      .where(
        and(
          eq(workflowLikes.workflowId, workflowId),
          eq(workflowLikes.userId, userId)
        )
      );
    
    // If like exists, remove it
    if (existingLike.length > 0) {
      await db
        .delete(workflowLikes)
        .where(
          and(
            eq(workflowLikes.workflowId, workflowId),
            eq(workflowLikes.userId, userId)
          )
        );
      return false; // Indicates like was removed
    } 
    // Otherwise add a new like
    else {
      await db
        .insert(workflowLikes)
        .values({
          workflowId,
          userId
        });
      return true; // Indicates like was added
    }
  }

  async getWorkflowLikes(workflowId: number): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(workflowLikes)
      .where(eq(workflowLikes.workflowId, workflowId));
      
    return Number(result[0].count) || 0;
  }

  async hasUserLikedWorkflow(workflowId: number, userId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(workflowLikes)
      .where(
        and(
          eq(workflowLikes.workflowId, workflowId),
          eq(workflowLikes.userId, userId)
        )
      );
      
    return result.length > 0;
  }

  // Onboarding operations
  async getOnboardingProgress(userId: number): Promise<OnboardingProgress | undefined> {
    const result = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId))
      .limit(1);
      
    return result.length > 0 ? result[0] : undefined;
  }

  async createOnboardingProgress(userId: number): Promise<OnboardingProgress> {
    const result = await db
      .insert(onboardingProgress)
      .values({
        userId,
        currentStep: 1,
        completedSteps: []
      })
      .returning();
      
    return result[0];
  }

  async updateOnboardingProgress(userId: number, step: number, completed: boolean): Promise<OnboardingProgress | undefined> {
    // Get current progress
    const currentProgress = await this.getOnboardingProgress(userId);
    
    if (!currentProgress) return undefined;
    
    let completedSteps = currentProgress.completedSteps as number[] || [];
    if (completed && !completedSteps.includes(step)) {
      completedSteps.push(step);
    }
    
    const result = await db
      .update(onboardingProgress)
      .set({ 
        currentStep: step + 1, // Move to next step
        completedSteps
      })
      .where(eq(onboardingProgress.userId, userId))
      .returning();
      
    return result.length > 0 ? result[0] : undefined;
  }

  async completeOnboarding(userId: number): Promise<boolean> {
    // Update user record to mark onboarding as completed
    const userResult = await db
      .update(users)
      .set({ 
        onboardingCompleted: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Update onboarding progress with completed timestamp
    const progressResult = await db
      .update(onboardingProgress)
      .set({ completedAt: new Date() })
      .where(eq(onboardingProgress.userId, userId))
      .returning();
      
    return userResult.length > 0 && progressResult.length > 0;
  }
}

// Create and export the storage instance
export const storage = new PostgresStorage();
