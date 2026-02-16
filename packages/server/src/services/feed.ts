import { AlgorithmEngine } from '@feed-platform/core';
import type { AlgorithmConfig, AlgorithmResult, ContentItem } from '@feed-platform/core';
import { ContentService } from './content.js';
import { AlgorithmService } from './algorithm.js';

/**
 * Feed service - generates feeds using algorithms
 */
export class FeedService {
  private engine: AlgorithmEngine;
  private contentService: ContentService;
  private algorithmService: AlgorithmService;

  constructor(contentService: ContentService, algorithmService: AlgorithmService) {
    this.engine = new AlgorithmEngine();
    this.contentService = contentService;
    this.algorithmService = algorithmService;
  }

  /**
   * Generate feed using algorithm
   */
  async generateFeed(algorithmId: string): Promise<AlgorithmResult> {
    // Get algorithm config
    const config = await this.algorithmService.getById(algorithmId);
    if (!config) {
      throw new Error(`Algorithm ${algorithmId} not found`);
    }

    // Get content items
    const items = await this.contentService.getAll(1000);

    // Execute algorithm
    return await this.engine.execute(items, config);
  }

  /**
   * Generate feed using custom config
   */
  async generateCustomFeed(config: AlgorithmConfig): Promise<AlgorithmResult> {
    // Get content items
    const items = await this.contentService.getAll(1000);

    // Execute algorithm
    return await this.engine.execute(items, config);
  }
}
