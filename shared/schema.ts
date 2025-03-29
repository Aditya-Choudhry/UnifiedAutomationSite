import { pgTable, text, serial, integer, boolean, timestamp, jsonb, unique, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin', 'editor']);
export const workflowStatusEnum = pgEnum('workflow_status', ['draft', 'published', 'archived']);
export const integrationTypeEnum = pgEnum('integration_type', ['email', 'crm', 'task', 'notification', 'social', 'custom']);

// Users table with enhanced fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: roleEnum("role").default('user').notNull(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  gamificationScore: integer("gamification_score").default(0),
  onboardingCompleted: boolean("onboarding_completed").default(false),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  workflows: many(workflows),
  integrations: many(integrations),
}));

// Workflows table to store user workflows
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: workflowStatusEnum("status").default('draft').notNull(),
  nodes: jsonb("nodes").notNull(),
  complexityScore: integer("complexity_score").default(0),
  isPublic: boolean("is_public").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastExecutedAt: timestamp("last_executed_at"),
  executionCount: integer("execution_count").default(0),
});

// Workflow relations
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  executions: many(workflowExecutions),
}));

// Workflow Executions table for tracking runs
export const workflowExecutions = pgTable("workflow_executions", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  status: text("status").notNull(), // success, failed, running
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  logs: jsonb("logs"),
  result: jsonb("result"),
});

// Execution relations
export const workflowExecutionsRelations = relations(workflowExecutions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id],
  }),
}));

// Integrations table for third-party connections
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  type: integrationTypeEnum("type").notNull(),
  config: jsonb("config").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

// Integration relations
export const integrationsRelations = relations(integrations, ({ one }) => ({
  user: one(users, {
    fields: [integrations.userId],
    references: [users.id],
  }),
}));

// Workflow comments for community engagement
export const workflowComments = pgTable("workflow_comments", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comment relations
export const workflowCommentsRelations = relations(workflowComments, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowComments.workflowId],
    references: [workflows.id],
  }),
  user: one(users, {
    fields: [workflowComments.userId],
    references: [users.id],
  }),
}));

// Workflow likes/stars for community engagement
export const workflowLikes = pgTable("workflow_likes", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    // Ensure a user can only like a workflow once
    unq: unique().on(table.workflowId, table.userId),
  };
});

// Like relations
export const workflowLikesRelations = relations(workflowLikes, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowLikes.workflowId],
    references: [workflows.id],
  }),
  user: one(users, {
    fields: [workflowLikes.userId],
    references: [users.id],
  }),
}));

// Onboarding progress tracking
export const onboardingProgress = pgTable("onboarding_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  currentStep: integer("current_step").default(1),
  completedSteps: jsonb("completed_steps").default([]),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Onboarding relations
export const onboardingProgressRelations = relations(onboardingProgress, ({ one }) => ({
  user: one(users, {
    fields: [onboardingProgress.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).pick({
  userId: true,
  name: true,
  description: true,
  nodes: true,
  isPublic: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).pick({
  userId: true,
  name: true,
  type: true,
  config: true,
});

export const insertWorkflowCommentSchema = createInsertSchema(workflowComments).pick({
  workflowId: true,
  userId: true,
  content: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;

export type InsertWorkflowComment = z.infer<typeof insertWorkflowCommentSchema>;
export type WorkflowComment = typeof workflowComments.$inferSelect;

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type WorkflowLike = typeof workflowLikes.$inferSelect;
export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
