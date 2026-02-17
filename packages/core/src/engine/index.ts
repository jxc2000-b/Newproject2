import type { ContentItem } from '../types/content.js';
import type { AlgorithmConfig, AlgorithmResult, ScoredContentItem } from '../types/algorithm.js';
import { applyFilters } from './filters.js';
import { applyBoosters } from './boosters.js';
import { applyDiversity } from './diversity.js';
import { applySorting } from './sorting.js';

/**
 * Main algorithm engine
 * Executes an algorithm configuration against a set of content items
 */
export class AlgorithmEngine {
  /**
   * Execute an algorithm configuration
   */
  async execute(
    items: ContentItem[],
    config: AlgorithmConfig
  ): Promise<AlgorithmResult> {
    const startTime = Date.now();
    const totalProcessed = items.length;

    // Step 1: Apply filters
    let filtered = applyFilters(items, config.filters);
    const totalFiltered = totalProcessed - filtered.length;

    // Step 2: Apply boosters (scoring)
    let scored: ScoredContentItem[] = applyBoosters(filtered, config.boosters);

    // Step 3: Apply diversity constraints
    scored = applyDiversity(scored, config.diversity);

    // Step 4: Sort results
    scored = applySorting(scored, config.sort);

    // Step 5: Apply limits
    if (config.limit) {
      const offset = config.limit.offset || 0;
      const maxItems = config.limit.maxItems;
      scored = scored.slice(offset, offset + maxItems);
    }

    const executionTimeMs = Date.now() - startTime;

    return {
      items: scored,
      meta: {
        totalProcessed,
        totalFiltered,
        executionTimeMs
      }
    };
  }
}
