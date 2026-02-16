import type { ContentItem } from '../types/content.js';
import type { BoosterConfig, ScoredContentItem } from '../types/algorithm.js';

/**
 * Apply boosters to score content items
 */
export function applyBoosters(
  items: ContentItem[],
  boosters?: BoosterConfig[]
): ScoredContentItem[] {
  const scoredItems: ScoredContentItem[] = items.map(content => ({
    content,
    score: 1.0,
    scoreBreakdown: { base: 1.0 }
  }));

  if (!boosters || boosters.length === 0) {
    return scoredItems;
  }

  for (const item of scoredItems) {
    for (const booster of boosters) {
      const boost = calculateBoost(item.content, booster);
      item.score *= boost;
      item.scoreBreakdown![booster.type] = boost;
    }
  }

  return scoredItems;
}

/**
 * Calculate boost value for an item
 */
function calculateBoost(item: ContentItem, booster: BoosterConfig): number {
  switch (booster.type) {
    case 'recency':
      return calculateRecencyBoost(item, booster.weight);

    case 'engagement':
      return calculateEngagementBoost(item, booster.weight);

    case 'sourceAffinity':
      return calculateSourceAffinityBoost(item, booster.weight, booster.params);

    default:
      return 1.0;
  }
}

/**
 * Recency boost - newer items get higher scores
 */
function calculateRecencyBoost(item: ContentItem, weight: number): number {
  const ageHours = (Date.now() - item.timestamp.getTime()) / (1000 * 60 * 60);
  // Exponential decay: score decreases as content ages
  // weight controls how quickly the score decays
  const decayFactor = Math.exp(-ageHours / (24 * weight));
  return 1.0 + decayFactor * weight;
}

/**
 * Engagement boost - items with higher engagement get higher scores
 */
function calculateEngagementBoost(item: ContentItem, weight: number): number {
  // Look for common engagement metrics in meta
  const { meta } = item;
  const engagement = 
    (meta.score || 0) +
    (meta.upvotes || 0) +
    (meta.likes || 0) +
    (meta.comments || 0) * 2 + // Comments weighted more
    (meta.shares || 0) * 3; // Shares weighted most

  if (engagement === 0) return 1.0;

  // Logarithmic scaling to prevent viral content from dominating
  const normalizedEngagement = Math.log10(engagement + 1);
  return 1.0 + normalizedEngagement * weight;
}

/**
 * Source affinity boost - prefer certain sources
 */
function calculateSourceAffinityBoost(
  item: ContentItem,
  weight: number,
  params?: Record<string, any>
): number {
  if (!params || !params.preferredSources) return 1.0;

  const preferredSources = params.preferredSources as string[];
  const isPreferred = preferredSources.includes(item.source);

  return isPreferred ? 1.0 + weight : 1.0;
}
