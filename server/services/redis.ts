import Redis from 'ioredis';
import { log } from '../vite';

export class RedisService {
  private client: Redis | null = null;
  private subscriber: Redis | null = null;
  private channels: Map<string, Set<(message: string) => void>> = new Map();
  private mockMode: boolean = false;
  
  constructor() {
    try {
      // Create main Redis client
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        // Reconnection settings
        retryStrategy: (times: number) => {
          if (times > 5) {
            // Switch to mock mode after 5 retries
            this.enableMockMode();
            return null; // Stop trying to reconnect
          }
          // Exponential backoff with a max delay
          return Math.min(100 * Math.pow(2, times), 3000);
        },
        connectTimeout: 5000, // 5 seconds timeout
        maxRetriesPerRequest: 3
      } as any);
      
      // Separate client for pub/sub to avoid blocking operations
      this.subscriber = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times: number) => {
          if (times > 5) {
            return null; // Stop trying to reconnect
          }
          return Math.min(100 * Math.pow(2, times), 3000);
        },
        connectTimeout: 5000, // 5 seconds timeout
        maxRetriesPerRequest: 3
      } as any);
      
      // Set up event handlers
      this.setupEventHandlers();
      
      log('Redis service initialized', 'redis');
    } catch (err) {
      log(`Error initializing Redis: ${err}`, 'redis');
      this.enableMockMode();
    }
  }
  
  private enableMockMode() {
    if (this.mockMode) return;
    
    this.mockMode = true;
    log('Switching to Redis mock mode - all data will be stored in memory', 'redis');
    
    // Close existing connections if any
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
    
    if (this.subscriber) {
      this.subscriber.disconnect();
      this.subscriber = null;
    }
  }
  
  private setupEventHandlers() {
    if (!this.client || !this.subscriber) return;
    
    // Main client events
    this.client.on('connect', () => {
      log('Redis client connected', 'redis');
    });
    
    this.client.on('error', (err) => {
      log(`Redis client error: ${err}`, 'redis');
    });
    
    // Subscriber client events
    this.subscriber.on('connect', () => {
      log('Redis subscriber connected', 'redis');
    });
    
    this.subscriber.on('error', (err) => {
      log(`Redis subscriber error: ${err}`, 'redis');
    });
    
    this.subscriber.on('message', (channel, message) => {
      const callbacks = this.channels.get(channel);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(message);
          } catch (err) {
            log(`Error in Redis message handler: ${err}`, 'redis');
          }
        });
      }
    });
  }
  
  // Subscribe to a Redis channel
  public subscribe(channel: string, callback: (message: string) => void) {
    if (this.mockMode || !this.subscriber) {
      // In mock mode, just store the callback but don't try to subscribe
      if (!this.channels.has(channel)) {
        this.channels.set(channel, new Set());
      }
      this.channels.get(channel)?.add(callback);
      log(`Mock subscription to channel: ${channel}`, 'redis');
      return () => this.unsubscribe(channel, callback);
    }
    
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
      // Subscribe only once per channel
      this.subscriber.subscribe(channel, (err) => {
        if (err) {
          log(`Error subscribing to channel ${channel}: ${err}`, 'redis');
        } else {
          log(`Subscribed to Redis channel: ${channel}`, 'redis');
        }
      });
    }
    
    this.channels.get(channel)?.add(callback);
    
    return () => {
      // Return unsubscribe function
      this.unsubscribe(channel, callback);
    };
  }
  
  // Unsubscribe from a Redis channel
  public unsubscribe(channel: string, callback: (message: string) => void) {
    const callbacks = this.channels.get(channel);
    if (callbacks) {
      callbacks.delete(callback);
      
      // If no more callbacks, unsubscribe from channel
      if (callbacks.size === 0) {
        this.channels.delete(channel);
        if (!this.mockMode && this.subscriber) {
          this.subscriber.unsubscribe(channel);
          log(`Unsubscribed from Redis channel: ${channel}`, 'redis');
        }
      }
    }
  }
  
  // Publish message to a channel
  public publish(channel: string, message: string | object) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    if (this.mockMode || !this.client) {
      // In mock mode, directly trigger callbacks for the channel
      const callbacks = this.channels.get(channel);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(messageStr);
          } catch (err) {
            log(`Error in Redis mock message handler: ${err}`, 'redis');
          }
        });
      }
      return Promise.resolve(callbacks?.size || 0);
    }
    
    return this.client.publish(channel, messageStr);
  }
  
  // Store a value with optional expiration
  public async set(key: string, value: string, ttlSeconds?: number) {
    if (this.mockMode || !this.client) {
      log(`Mock set operation for key: ${key}`, 'redis');
      return 'OK';
    }
    
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      return this.client.set(key, value);
    }
  }
  
  // Get a stored value
  public async get(key: string) {
    if (this.mockMode || !this.client) {
      log(`Mock get operation for key: ${key}`, 'redis');
      return null;
    }
    
    return this.client.get(key);
  }
  
  // Delete a key
  public async del(key: string) {
    if (this.mockMode || !this.client) {
      log(`Mock del operation for key: ${key}`, 'redis');
      return 1;
    }
    
    return this.client.del(key);
  }
  
  // Store object in Redis (automatically JSON stringified)
  public async setObject(key: string, value: object, ttlSeconds?: number) {
    return this.set(key, JSON.stringify(value), ttlSeconds);
  }
  
  // Get object from Redis (automatically JSON parsed)
  public async getObject<T = any>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      log(`Error parsing Redis object at ${key}: ${err}`, 'redis');
      return null;
    }
  }
  
  // Increment a counter
  public async increment(key: string, by = 1) {
    if (this.mockMode || !this.client) {
      log(`Mock increment operation for key: ${key}`, 'redis');
      return by;
    }
    return this.client.incrby(key, by);
  }
  
  // Add to a set
  public async addToSet(key: string, ...members: string[]) {
    if (this.mockMode || !this.client) {
      log(`Mock addToSet operation for key: ${key}`, 'redis');
      return members.length;
    }
    return this.client.sadd(key, ...members);
  }
  
  // Get all members of a set
  public async getSetMembers(key: string) {
    if (this.mockMode || !this.client) {
      log(`Mock getSetMembers operation for key: ${key}`, 'redis');
      return [];
    }
    return this.client.smembers(key);
  }
  
  // Check if an item is in a set
  public async isInSet(key: string, member: string) {
    if (this.mockMode || !this.client) {
      log(`Mock isInSet operation for key: ${key}`, 'redis');
      return false;
    }
    const result = await this.client.sismember(key, member);
    return result === 1;
  }
  
  // Add to a sorted set with score
  public async addToSortedSet(key: string, score: number, member: string) {
    if (this.mockMode || !this.client) {
      log(`Mock addToSortedSet operation for key: ${key}`, 'redis');
      return 1;
    }
    return this.client.zadd(key, score, member);
  }
  
  // Get members from a sorted set with scores
  public async getSortedSetWithScores(key: string, start = 0, end = -1) {
    if (this.mockMode || !this.client) {
      log(`Mock getSortedSetWithScores operation for key: ${key}`, 'redis');
      return [];
    }
    
    const result = await this.client.zrange(key, start, end, 'WITHSCORES');
    
    // Convert flat array to array of [member, score] pairs
    const pairs: [string, number][] = [];
    for (let i = 0; i < result.length; i += 2) {
      pairs.push([result[i], parseFloat(result[i + 1])]);
    }
    
    return pairs;
  }
  
  // Close connections
  public async close() {
    if (this.mockMode) {
      log('Redis mock mode - no connections to close', 'redis');
      return;
    }
    
    if (this.subscriber) {
      await this.subscriber.quit().catch(err => {
        log(`Error closing Redis subscriber: ${err}`, 'redis');
      });
    }
    
    if (this.client) {
      await this.client.quit().catch(err => {
        log(`Error closing Redis client: ${err}`, 'redis');
      });
    }
    
    log('Redis connections closed', 'redis');
  }
}