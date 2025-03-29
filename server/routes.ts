import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Unified Automation Hub API is running" });
  });

  // Create a basic endpoint to get workflows (simulated for now)
  app.get("/api/workflows", (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
