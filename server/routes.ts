import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { createApiRouter } from "./api";
import { createRedisService } from "./services/redis";
import { createWebSocketService } from "./services/websocket";
import { createAIService } from "./services/ai";
import { log } from "./vite";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize services
  const redisService = createRedisService();
  const wsService = createWebSocketService(httpServer, redisService);
  const aiService = createAIService(redisService, storage);
  
  // Configure session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'unified-automation-hub-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
  
  // Register API routes
  const apiRouter = createApiRouter(storage, redisService, aiService, wsService);
  app.use('/api', apiRouter);

  // Legacy API routes - keeping for backwards compatibility
  app.get("/api/legacy/workflows", (req, res) => {
    res.json({
      workflows: [
        {
          id: 1,
          name: "Customer Onboarding",
          status: "Active",
          description: "Automates new customer setup in CRM, accounting, and email systems",
          executions: 127,
          modified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: "Lead Qualification",
          status: "Active",
          description: "Scores and routes leads based on website activity and form submissions",
          executions: 42,
          modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: "Invoice Processing",
          status: "Error",
          description: "Extracts data from invoices and adds to accounting software",
          executions: 0,
          errors: 6,
          modified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
  });
  
  // Set up cleanup for service shutdown
  const cleanup = () => {
    log("Shutting down server and services...", "server");
    redisService.close()
      .catch(err => log(`Error closing Redis: ${err}`, "server"));
      
    wsService.close();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  return httpServer;
}
