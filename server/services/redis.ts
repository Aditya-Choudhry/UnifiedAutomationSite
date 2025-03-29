import { Redis } from "ioredis";
import { log } from "../vite";
import { EventEmitter } from "events";

// Mock Redis implementation for when Redis is not available
class MockRedis extends EventEmitter {
  private data: Map<string, string> = new Map();
  private subscriptions: Set<string> = new Set();
  
  connect(): Promise<void> {
    return Promise.resolve();
  }
  
  quit(): Promise<string> {
    return Promise.resolve("OK");
  }
  
  publish(channel: string, message: string): Promise<number> {
    this.emit("message", channel, message);
    return Promise.resolve(1);
  }
  
  psubscribe(pattern: string): Promise<void> {
    this.subscriptions.add(pattern);
    return Promise.resolve();
  }
  
  punsubscribe(pattern: string): Promise<void> {
    this.subscriptions.delete(pattern);
    return Promise.resolve();
  }
  
  set(key: string, value: string, ...args: any[]): Promise<string> {
    // Handle expiry if EX is provided
    if (args.length > 0 && args[0] === "EX") {
      this.data.set(key, value);
      // We don't actually expire the key in this mock implementation
    } else {
      this.data.set(key, value);
    }
    return Promise.resolve("OK");
  }
  
  get(key: string): Promise<string | null> {
    return Promise.resolve(this.data.get(key) || null);
  }
  
  del(key: string): Promise<number> {
    const exists = this.data.has(key);
    this.data.delete(key);
    return Promise.resolve(exists ? 1 : 0);
  }
}

export class RedisService {
  private publisher: Redis | MockRedis = new MockRedis(); // Initialize with MockRedis by default
  private subscriber: Redis | MockRedis = new MockRedis(); // Initialize with MockRedis by default
  private channels: Set<string> = new Set();
  private handlers: Map<string, Array<(message: string, channel: string) => void>> = new Map();
  private useMock: boolean = true; // Start with mock by default

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Start with mock implementation for now
    // Skip trying to connect to Redis since we know it's not available in this environment
    this.useMock = true;
    this.createMockRedis();
    log("Using in-memory mock Redis implementation by default", "redis");
    
    // Uncomment this for production when Redis is available
    /*
    try {
      // Try to use real Redis connection
      this.publisher = new Redis({
        lazyConnect: true,
        enableOfflineQueue: true, // Allow commands to be queued while connecting
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        retryStrategy: () => null // Don't retry on failure
      });
      
      this.subscriber = new Redis({
        lazyConnect: true,
        enableOfflineQueue: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        retryStrategy: () => null
      });
      
      // Try to connect
      try {
        await this.publisher.connect();
        await this.subscriber.connect();
        
        // Set up message handler for real Redis
        this.subscriber.on("message", (channel, message) => {
          this.handleMessage(channel, message);
        });
        
        log("Redis service initialized with real Redis connection", "redis");
      } catch (connError) {
        // Connection failed, fall back to mock implementation
        log(`Redis connection error: ${connError}. Using in-memory implementation.`, "redis");
        this.useMock = true;
        this.createMockRedis();
      }
    } catch (error) {
      // Redis instantiation failed, fall back to mock implementation
      log(`Redis initialization error: ${error}. Using in-memory implementation.`, "redis");
      this.useMock = true;
      this.createMockRedis();
    }
    */
  }
  
  private createMockRedis() {
    this.publisher = new MockRedis();
    this.subscriber = new MockRedis();
    
    // Set up message handler for mock Redis
    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    });
    
    log("Using in-memory mock Redis implementation", "redis");
  }

  public subscribe(channelPattern: string, handler: (message: string, channel: string) => void): void {
    try {
      // Add the handler
      if (!this.handlers.has(channelPattern)) {
        this.handlers.set(channelPattern, []);
      }
      this.handlers.get(channelPattern)!.push(handler);
      
      // Subscribe to the channel pattern if not already subscribed
      if (!this.channels.has(channelPattern)) {
        this.subscriber.psubscribe(channelPattern);
        this.channels.add(channelPattern);
        log(`Subscribed to Redis channel pattern: ${channelPattern}`, "redis");
      }
    } catch (error) {
      log(`Redis subscription error: ${error}`, "redis");
    }
  }

  public unsubscribe(channelPattern: string): void {
    try {
      if (this.channels.has(channelPattern)) {
        this.subscriber.punsubscribe(channelPattern);
        this.channels.delete(channelPattern);
        this.handlers.delete(channelPattern);
        log(`Unsubscribed from Redis channel pattern: ${channelPattern}`, "redis");
      }
    } catch (error) {
      log(`Redis unsubscription error: ${error}`, "redis");
    }
  }

  public subscribeToUserChannels(userId: number): void {
    this.subscribe(`user:${userId}`, (message, channel) => {
      log(`Message for user ${userId}: ${message}`, "redis");
    });
  }

  public unsubscribeFromUserChannels(userId: number): void {
    this.unsubscribe(`user:${userId}`);
  }

  public subscribeToWorkflow(workflowId: number): void {
    this.subscribe(`workflow:${workflowId}`, (message, channel) => {
      log(`Message for workflow ${workflowId}: ${message}`, "redis");
    });
  }

  public unsubscribeFromWorkflow(workflowId: number): void {
    this.unsubscribe(`workflow:${workflowId}`);
  }

  public publish(channel: string, message: string): void {
    try {
      this.publisher.publish(channel, message);
      log(`Published message to channel ${channel}`, "redis");
    } catch (error) {
      log(`Redis publish error: ${error}`, "redis");
      
      // Fallback - directly call handlers for testing
      this.handleMessage(channel, message);
    }
  }

  public async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    try {
      if (expirySeconds) {
        await this.publisher.set(key, value, "EX", expirySeconds);
      } else {
        await this.publisher.set(key, value);
      }
    } catch (error) {
      log(`Redis set error: ${error}`, "redis");
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.publisher.get(key);
    } catch (error) {
      log(`Redis get error: ${error}`, "redis");
      return null;
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.publisher.del(key);
    } catch (error) {
      log(`Redis delete error: ${error}`, "redis");
    }
  }

  private handleMessage(channel: string, message: string): void {
    // Find all matching pattern handlers and invoke them
    this.handlers.forEach((handlers, pattern) => {
      if (this.matchPattern(pattern, channel)) {
        handlers.forEach(handler => {
          try {
            handler(message, channel);
          } catch (error) {
            log(`Error in Redis message handler for pattern ${pattern}: ${error}`, "redis");
          }
        });
      }
    });
  }

  private matchPattern(pattern: string, channel: string): boolean {
    // Simple pattern matching to mimic Redis PSUBSCRIBE
    // Supports the * wildcard only
    if (pattern === channel) return true;
    
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(channel);
    }
    
    return false;
  }

  public async close(): Promise<void> {
    try {
      await this.subscriber.quit();
      await this.publisher.quit();
      log("Redis connections closed", "redis");
    } catch (error) {
      log(`Error closing Redis connections: ${error}`, "redis");
    }
  }
}

// Export a factory function for creating the Redis service
export function createRedisService(): RedisService {
  return new RedisService();
}