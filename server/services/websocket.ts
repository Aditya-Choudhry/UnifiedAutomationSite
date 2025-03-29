import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from '../vite';
import { WebSocketMessage } from '../types';
import { RedisService } from './redis';
import { IStorage } from '../storage';

// WebSocket client interface
interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  userId?: number;
  subscriptions: Set<string>;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocketClient> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;
  private userConnections: Map<number, Set<WebSocketClient>> = new Map();
  private redisService: RedisService;
  private storage: IStorage;
  
  constructor(server: Server, redisService: RedisService, storage: IStorage) {
    // Create WebSocket server with a distinct path to avoid conflict with Vite's HMR
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.redisService = redisService;
    this.storage = storage;
    
    this.setupConnectionHandler();
    this.startHeartbeat();
    this.setupRedisSubscription();
    
    log('WebSocket server initialized on path /ws', 'websocket');
  }
  
  private setupConnectionHandler() {
    this.wss.on('connection', (ws: WebSocketClient) => {
      // Initialize client
      ws.isAlive = true;
      ws.subscriptions = new Set();
      this.clients.add(ws);
      
      log(`WebSocket client connected (${this.clients.size} total)`, 'websocket');
      
      // Setup ping-pong for connection health
      ws.on('pong', () => {
        ws.isAlive = true;
      });
      
      // Handle messages
      ws.on('message', async (message: string) => {
        try {
          const data: WebSocketMessage = JSON.parse(message);
          await this.handleClientMessage(ws, data);
        } catch (err) {
          log(`Error handling WebSocket message: ${err}`, 'websocket');
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        this.handleClientDisconnect(ws);
      });
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      }));
    });
  }
  
  private async handleClientMessage(client: WebSocketClient, message: WebSocketMessage) {
    log(`Received WebSocket message: ${message.type}`, 'websocket');
    
    switch (message.type) {
      case 'auth':
        // Authenticate client
        if (message.userId) {
          await this.authenticateClient(client, message.userId);
        }
        break;
        
      case 'subscribe':
        // Subscribe to workflow updates
        if (message.workflowId) {
          await this.subscribeToWorkflow(client, message.workflowId);
        }
        break;
        
      case 'workflow_execute':
        // Handle workflow execution request
        if (message.workflowId) {
          await this.handleWorkflowExecution(client, message);
        }
        break;
        
      case 'ping':
        // Respond to client ping
        client.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
        break;
        
      default:
        client.send(JSON.stringify({
          type: 'error',
          message: `Unknown message type: ${message.type}`
        }));
    }
  }
  
  private async authenticateClient(client: WebSocketClient, userId: number) {
    // Verify user exists
    const user = await this.storage.getUser(userId);
    if (!user) {
      client.send(JSON.stringify({
        type: 'auth_error',
        message: 'User not found'
      }));
      return;
    }
    
    // Set client's user ID
    client.userId = userId;
    
    // Add client to user connections map
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)?.add(client);
    
    // Confirm authentication
    client.send(JSON.stringify({
      type: 'auth_success',
      userId,
      username: user.username
    }));
    
    log(`WebSocket client authenticated for user ${userId}`, 'websocket');
  }
  
  private async subscribeToWorkflow(client: WebSocketClient, workflowId: number | string) {
    // Add to client's subscriptions
    client.subscriptions.add(`workflow:${workflowId}`);
    
    // Acknowledge subscription
    client.send(JSON.stringify({
      type: 'subscribe_success',
      channel: `workflow:${workflowId}`
    }));
    
    log(`Client subscribed to workflow ${workflowId}`, 'websocket');
  }
  
  private async handleWorkflowExecution(client: WebSocketClient, message: any) {
    // In a real implementation, this would:
    // 1. Queue the workflow for execution in a task processor 
    // 2. Return execution ID immediately
    // 3. Send updates as the workflow executes via Redis pub/sub
    
    // For demo purposes, we'll simulate a workflow execution
    const { workflowId, nodes, testName } = message;
    
    // Send initial message
    client.send(JSON.stringify({
      type: 'workflow_execution_started',
      workflowId,
      executionId: `exec_${Date.now()}`,
      timestamp: new Date().toISOString()
    }));
    
    // Simulate node executions
    if (nodes && Array.isArray(nodes)) {
      // Run through each node with delays to simulate processing
      this.simulateWorkflowExecution(client, workflowId, nodes);
    }
  }
  
  private async simulateWorkflowExecution(
    client: WebSocketClient, 
    workflowId: number | string, 
    nodes: any[]
  ) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isLastNode = i === nodes.length - 1;
      
      // Send "running" status
      setTimeout(() => {
        client.send(JSON.stringify({
          type: 'workflow_execution_update',
          workflowId,
          nodeId: node.id,
          status: 'running',
          log: `Executing node: ${node.id} (${node.type})`
        }));
      }, i * 1500);
      
      // After a delay, send "success" status with fake results
      setTimeout(() => {
        // 10% chance of error for demo purposes
        const success = Math.random() > 0.1;
        
        client.send(JSON.stringify({
          type: 'workflow_execution_update',
          workflowId,
          nodeId: node.id,
          status: success ? 'success' : 'error',
          isLastNode,
          workflowStatus: isLastNode ? 'completed' : 'running',
          log: success 
            ? `Node ${node.id} execution completed successfully` 
            : `Node ${node.id} execution failed`,
          results: {
            success,
            message: success 
              ? 'Node executed successfully' 
              : 'Node execution failed',
            logs: success 
              ? ['Starting execution', 'Processing data', 'Execution completed'] 
              : ['Starting execution', 'Error encountered', 'Execution failed'],
            data: success ? { 
              timestamp: new Date().toISOString(),
              result: 'Sample output data'
            } : null,
            duration: Math.floor(Math.random() * 1000) + 500
          }
        }));
        
        // If the last node, send workflow completion message
        if (isLastNode) {
          client.send(JSON.stringify({
            type: 'workflow_execution_complete',
            workflowId,
            success: true,
            timestamp: new Date().toISOString()
          }));
        }
      }, (i * 1500) + 1000);
    }
  }
  
  private handleClientDisconnect(client: WebSocketClient) {
    // Remove from clients set
    this.clients.delete(client);
    
    // If authenticated, remove from user connections
    if (client.userId) {
      const userClients = this.userConnections.get(client.userId);
      if (userClients) {
        userClients.delete(client);
        if (userClients.size === 0) {
          this.userConnections.delete(client.userId);
        }
      }
    }
    
    log(`WebSocket client disconnected (${this.clients.size} remaining)`, 'websocket');
  }
  
  private startHeartbeat() {
    // Set up interval to check client connections
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const client = ws as WebSocketClient;
        if (client.isAlive === false) {
          return client.terminate();
        }
        
        client.isAlive = false;
        client.ping();
      });
    }, 30000); // 30 seconds
  }
  
  private setupRedisSubscription() {
    try {
      // Subscribe to Redis channels for pub/sub messaging
      this.redisService.subscribe('workflows', (message) => {
        this.handleRedisMessage(message);
      });
      log('Subscribed to Redis workflows channel', 'websocket');
    } catch (err) {
      log(`Error setting up Redis subscription: ${err}. Using local message handling only.`, 'websocket');
    }
  }
  
  private handleRedisMessage(message: string) {
    try {
      const data = JSON.parse(message);
      
      // Determine which clients should receive this message
      if (data.channel && data.channel.startsWith('workflow:')) {
        const workflowId = data.channel.split(':')[1];
        
        // Send to all clients subscribed to this workflow
        this.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && 
              client.subscriptions.has(`workflow:${workflowId}`)) {
            client.send(JSON.stringify(data.message));
          }
        });
      }
      
      // Handle user-specific messages
      if (data.userId) {
        const userClients = this.userConnections.get(data.userId);
        if (userClients) {
          userClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data.message));
            }
          });
        }
      }
    } catch (err) {
      log(`Error handling Redis message: ${err}`, 'websocket');
    }
  }
  
  // Broadcast message to all connected clients
  public broadcast(message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  // Send message to specific user across all their connections
  public sendToUser(userId: number, message: any) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    const userClients = this.userConnections.get(userId);
    
    if (userClients) {
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
      return true;
    }
    
    return false;
  }
  
  // Close the server
  public close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval as NodeJS.Timeout);
      this.pingInterval = null;
    }
    this.wss.close();
    log('WebSocket server closed', 'websocket');
  }
}