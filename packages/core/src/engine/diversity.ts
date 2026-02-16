import type { ScoredContentItem } from '../types/algorithm.js';
import type { DiversityConfig } from '../types/algorithm.js';

/**
 * Apply diversity constraints to scored items
 */
export function applyDiversity(
  items: ScoredContentItem[],
  diversity?: DiversityConfig
): ScoredContentItem[] {
  if (!diversity) {
    return items;
  }

  let result = [...items];

  // Apply max per source constraint
  if (diversity.maxPerSource) {
    result = limitPerSource(result, diversity.maxPerSource);
  }

  // Apply content type mixing
  if (diversity.mixContentTypes) {
    result = mixContentTypes(result);
  }

  // Apply min different sources constraint
  if (diversity.minDifferentSources) {
    result = ensureMinSources(result, diversity.minDifferentSources);
  }

  return result;
}

/**
 * Limit items per source
 */
function limitPerSource(
  items: ScoredContentItem[],
  maxPerSource: number
): ScoredContentItem[] {
  const sourceCount: Record<string, number> = {};
  const result: ScoredContentItem[] = [];

  for (const item of items) {
    const source = item.content.source;
    const count = sourceCount[source] || 0;

    if (count < maxPerSource) {
      result.push(item);
      sourceCount[source] = count + 1;
    }
  }

  return result;
}

/**
 * Mix content types for diversity
 * Implements a round-robin approach across content types
 */
function mixContentTypes(items: ScoredContentItem[]): ScoredContentItem[] {
  const byType: Record<string, ScoredContentItem[]> = {};

  // Group by type
  for (const item of items) {
    const type = item.content.type;
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(item);
  }

  // Round-robin across types
  const result: ScoredContentItem[] = [];
  const types = Object.keys(byType);
  let maxLength = Math.max(...Object.values(byType).map(arr => arr.length));

  for (let i = 0; i < maxLength; i++) {
    for (const type of types) {
      if (byType[type][i]) {
        result.push(byType[type][i]);
      }
    }
  }

  return result;
}

/**
 * Ensure minimum number of different sources
 */
function ensureMinSources(
  items: ScoredContentItem[],
  minSources: number
): ScoredContentItem[] {
  const uniqueSources = new Set(items.map(item => item.content.source));
  
  if (uniqueSources.size >= minSources) {
    return items;
  }

  // Not enough sources - return what we have
  return items;
}
