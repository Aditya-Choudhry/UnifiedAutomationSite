import { log } from '../vite';
import { RedisService } from './redis';
import { IStorage } from '../storage';
import { AIWorkflowSuggestion } from '../types';

export class AIService {
  private redisService: RedisService;
  private storage: IStorage;
  private suggestionCache: Map<string, { suggestions: AIWorkflowSuggestion[], timestamp: number }> = new Map();
  private readonly CACHE_TTL = 3600000; // 1 hour in milliseconds
  
  constructor(redisService: RedisService, storage: IStorage) {
    this.redisService = redisService;
    this.storage = storage;
    log('AI service initialized', 'ai');
  }
  
  // Generate workflow suggestions based on user prompt
  public async generateWorkflowSuggestions(prompt: string): Promise<AIWorkflowSuggestion[]> {
    // Check cache first
    const cacheKey = `ai_suggestion:${prompt.toLowerCase().trim()}`;
    const cachedResult = this.suggestionCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < this.CACHE_TTL) {
      log(`Returning cached workflow suggestions for "${prompt}"`, 'ai');
      return cachedResult.suggestions;
    }
    
    // For demo purposes, return mock suggestions
    const suggestions: AIWorkflowSuggestion[] = [
      {
        title: "Customer Onboarding",
        description: "Automate customer setup across multiple systems",
        complexity: 3,
        nodes: [],
        tags: ["customer", "onboarding", "automation"]
      },
      {
        title: "Lead Qualification",
        description: "Process and qualify leads from various sources",
        complexity: 2,
        nodes: [],
        tags: ["leads", "marketing", "automation"]
      },
      {
        title: "Invoice Processing",
        description: "Extract data from invoices and sync with accounting",
        complexity: 4,
        nodes: [],
        tags: ["finance", "accounting", "document processing"]
      }
    ];
    
    // Save to cache
    this.suggestionCache.set(cacheKey, {
      suggestions,
      timestamp: Date.now()
    });
    
    // In a real implementation, we would also save to Redis for persistence
    try {
      await this.redisService.setObject(`cache:${cacheKey}`, {
        suggestions,
        timestamp: Date.now()
      }, 3600); // 1 hour TTL
    } catch (err) {
      // If Redis fails, just log and continue - we still have the in-memory cache
      log(`Failed to save AI suggestions to Redis: ${err}`, 'ai');
    }
    
    return suggestions;
  }
  
  // Calculate complexity score for a workflow
  public calculateComplexityScore(nodes: any[]): number {
    // Simple algorithm:
    // - Base score is number of nodes
    // - Add points for complex node types
    // - Add points for connections between nodes
    
    if (!nodes || nodes.length === 0) {
      return 0;
    }
    
    let score = nodes.length;
    
    // Add complexity for specific node types
    const complexNodeTypes = ['condition', 'transform', 'filter', 'aggregate'];
    nodes.forEach(node => {
      if (node.type && complexNodeTypes.includes(node.type.toLowerCase())) {
        score += 1;
      }
      
      // Add for configured properties
      if (node.data && node.data.config) {
        score += Object.keys(node.data.config).length * 0.2;
      }
    });
    
    // Normalized score - cap at 10
    return Math.min(Math.round(score), 10);
  }
  
  // Clean up resources
  public async close() {
    this.suggestionCache.clear();
    log('AI service closed', 'ai');
  }
}