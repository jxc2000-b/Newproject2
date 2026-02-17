import type { ContentItem } from '../types/content.js';
import type { FilterConfig } from '../types/algorithm.js';

/**
 * Apply filters to content items
 */
export function applyFilters(
  items: ContentItem[],
  filters?: FilterConfig[]
): ContentItem[] {
  if (!filters || filters.length === 0) {
    return items;
  }

  return items.filter(item => {
    // All filters must pass (AND logic)
    return filters.every(filter => {
      const matches = checkFilter(item, filter);
      // If mode is 'exclude', invert the result
      return filter.mode === 'exclude' ? !matches : matches;
    });
  });
}

/**
 * Check if an item matches a filter
 */
function checkFilter(item: ContentItem, filter: FilterConfig): boolean {
  switch (filter.type) {
    case 'source':
      return filter.values.includes(item.source);

    case 'keyword':
      const searchText = `${item.title} ${JSON.stringify(item.meta)}`.toLowerCase();
      return filter.values.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );

    case 'contentType':
      return filter.values.includes(item.type);

    case 'age':
      if (!filter.maxAge) return true;
      const ageSeconds = (Date.now() - item.timestamp.getTime()) / 1000;
      return ageSeconds <= filter.maxAge;

    default:
      return true;
  }
}
