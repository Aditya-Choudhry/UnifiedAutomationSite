import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { RedisService } from "./redis";
import { log } from "../vite";

interface Client {
  id: string;
  userId?: number;
  ws: WebSocket;
  isAlive: boolean;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();
  private redisService: RedisService;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(server: HttpServer, redisService: RedisService) {
    // Add a specific path to avoid conflicts with Vite's WebSocket
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });
    this.redisService = redisService;
    
    this.initialize();
    log("WebSocket server initialized on path /ws", "websocket");
  }

  private initialize() {
    this.wss.on("connection", (ws: WebSocket) => {
      const clientId = this.generateId();
      
      // Set up the new client
      const client: Client = {
        id: clientId,
        ws,
        isAlive: true
      };
      
      this.clients.set(clientId, client);
      log(`Client connected: ${clientId}`, "websocket");

      // Send welcome message with client ID
      this.sendToClient(clientId, {
        type: "connection",
        clientId,
        message: "Connected to Unified Automation Hub"
      });

      // Set up message handling
      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(clientId, data);
        } catch (error) {
          log(`Invalid message format: ${error}`, "websocket");
          this.sendToClient(clientId, {
            type: "error",
            message: "Invalid message format"
          });
        }
      });

      // Set up ping/pong for connection health check
      ws.on("pong", () => {
        if (this.clients.has(clientId)) {
          this.clients.get(clientId)!.isAlive = true;
        }
      });

      // Handle disconnect
      ws.on("close", () => {
        log(`Client disconnected: ${clientId}`, "websocket");
        this.clients.delete(clientId);
        
        // Clean up user subscriptions if authenticated
        if (client.userId) {
          this.redisService.unsubscribeFromUserChannels(client.userId);
        }
      });

      // Handle errors
      ws.on("error", (error) => {
        log(`WebSocket error for client ${clientId}: ${error}`, "websocket");
        this.clients.delete(clientId);
      });
    });

    try {
      // Set up Redis subscription for broadcasting messages
      this.redisService.subscribe("broadcast", (message) => {
        this.broadcast(message);
      });
      
      // Set up user-specific channel handling
      this.redisService.subscribe("user:*", (message, channel) => {
        const userId = parseInt(channel.split(":")[1]);
        if (userId) {
          this.broadcastToUser(userId, message);
        }
      });
      
      // Set up workflow channel handling
      this.redisService.subscribe("workflow:*", (message, channel) => {
        const workflowId = parseInt(channel.split(":")[1]);
        if (workflowId) {
          this.broadcastToWorkflowSubscribers(workflowId, message);
        }
      });
    } catch (error) {
      log(`Error setting up Redis subscriptions: ${error}. Some real-time features may be limited.`, "websocket");
    }

    // Start heartbeat to detect stale connections
    this.pingInterval = setInterval(() => {
      this.heartbeat();
    }, 30000); // Check every 30 seconds
  }

  // Handle incoming messages from clients
  private handleMessage(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    log(`Message from ${clientId}: ${JSON.stringify(data)}`, "websocket");

    switch (data.type) {
      case "auth":
        // Authenticate client with user ID
        if (data.userId) {
          client.userId = data.userId;
          log(`Client ${clientId} authenticated as user ${data.userId}`, "websocket");
          
          this.sendToClient(clientId, {
            type: "auth",
            success: true,
            message: "Authentication successful"
          });
        } else {
          this.sendToClient(clientId, {
            type: "auth",
            success: false,
            message: "Invalid authentication"
          });
        }
        break;
        
      case "subscribe":
        // Subscribe to a workflow channel
        if (data.workflowId) {
          this.redisService.subscribeToWorkflow(data.workflowId);
          log(`Client ${clientId} subscribed to workflow ${data.workflowId}`, "websocket");
          
          this.sendToClient(clientId, {
            type: "subscribe",
            success: true,
            entity: "workflow",
            entityId: data.workflowId
          });
        }
        break;
        
      case "unsubscribe":
        // Unsubscribe from a workflow channel
        if (data.workflowId) {
          this.redisService.unsubscribeFromWorkflow(data.workflowId);
          log(`Client ${clientId} unsubscribed from workflow ${data.workflowId}`, "websocket");
          
          this.sendToClient(clientId, {
            type: "unsubscribe",
            success: true,
            entity: "workflow",
            entityId: data.workflowId
          });
        }
        break;
        
      default:
        this.sendToClient(clientId, {
          type: "error",
          message: "Unknown message type"
        });
        break;
    }
  }

  // Send message to a specific client
  public sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Broadcast message to all connected clients
  public broadcast(message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  // Broadcast to specific user across all their connections
  public broadcastToUser(userId: number, message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  // Broadcast to all clients subscribed to a workflow
  public broadcastToWorkflowSubscribers(workflowId: number, message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    // In a more complex implementation, you'd track subscriptions here
    // For now, we delegate to Redis for pub/sub, but this would allow more fine-grained control
    this.redisService.publish(`workflow:${workflowId}`, messageStr);
  }

  // Send workflow execution updates
  public sendWorkflowUpdate(workflowId: number, status: string, data: any = {}) {
    const message = {
      type: "workflow_update",
      workflowId,
      status,
      timestamp: new Date().toISOString(),
      data
    };
    
    this.redisService.publish(`workflow:${workflowId}`, JSON.stringify(message));
  }

  // Connection heartbeat check
  private heartbeat() {
    this.clients.forEach((client, id) => {
      if (!client.isAlive) {
        log(`Terminating stale connection: ${id}`, "websocket");
        client.ws.terminate();
        this.clients.delete(id);
        return;
      }
      
      client.isAlive = false;
      client.ws.ping();
    });
  }

  // Generate a unique client ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  // Clean up on shutdown
  public close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.wss.close();
    log("WebSocket server closed", "websocket");
  }
}

// Export a factory function for creating the WebSocket service
export function createWebSocketService(server: HttpServer, redisService: RedisService): WebSocketService {
  return new WebSocketService(server, redisService);
}