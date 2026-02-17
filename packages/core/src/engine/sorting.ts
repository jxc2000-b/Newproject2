import type { ScoredContentItem, SortConfig } from '../types/algorithm.js';

/**
 * Sort scored items
 */
export function applySorting(
  items: ScoredContentItem[],
  sort?: SortConfig
): ScoredContentItem[] {
  if (!sort) {
    // Default to score-based descending
    return sortByScore(items, 'desc');
  }

  switch (sort.type) {
    case 'chronological':
      return sortByTime(items, sort.direction);

    case 'score':
      return sortByScore(items, sort.direction);

    case 'random':
      return shuffle(items);

    default:
      return items;
  }
}

/**
 * Sort by timestamp
 */
function sortByTime(
  items: ScoredContentItem[],
  direction: 'asc' | 'desc'
): ScoredContentItem[] {
  const sorted = [...items].sort((a, b) => {
    const timeA = a.content.timestamp.getTime();
    const timeB = b.content.timestamp.getTime();
    return timeA - timeB;
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort by score
 */
function sortByScore(
  items: ScoredContentItem[],
  direction: 'asc' | 'desc'
): ScoredContentItem[] {
  const sorted = [...items].sort((a, b) => a.score - b.score);
  return direction === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Random shuffle (Fisher-Yates algorithm)
 */
function shuffle(items: ScoredContentItem[]): ScoredContentItem[] {
  const result = [...items];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}
