// Re-export types from shared schema
export * from "@shared/schema";

// Import NodeData type from Workflow component
import { NodeData as WorkflowNodeData } from "../client/src/components/demo/WorkflowNode";
export { WorkflowNodeData as NodeData };

// Service specific types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface WebSocketAuthMessage extends WebSocketMessage {
  type: 'auth';
  userId: number;
}

export interface WebSocketSubscribeMessage extends WebSocketMessage {
  type: 'subscribe';
  workflowId: number;
}

export interface ExecutionResult {
  success: boolean;
  logs: string[];
  outputs?: Record<string, any>;
  error?: string;
}

export interface AIWorkflowSuggestion {
  title: string;
  description: string;
  complexity: number;
  nodes: WorkflowNodeData[];
  tags: string[];
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface SessionData {
  userId: number;
  authorized: boolean;
  role: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  userId: number;
  createdAt: string;
  link?: string;
}

export interface UserStatistics {
  workflowCount: number;
  executionCount: number;
  successRate: number;
  integrationsCount: number;
  totalScore: number;
}