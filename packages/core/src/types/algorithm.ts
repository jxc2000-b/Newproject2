/**
 * Algorithm Config Schema Types
 * Versioned from day one for forward compatibility
 */

/**
 * Filter configuration - include/exclude content
 */
export interface FilterConfig {
  /** Filter type */
  type: 'source' | 'keyword' | 'contentType' | 'age';
  
  /** Filter mode */
  mode: 'include' | 'exclude';
  
  /** Filter values */
  values: string[];
  
  /** For age filters: max age in seconds */
  maxAge?: number;
}

/**
 * Booster configuration - score multipliers
 */
export interface BoosterConfig {
  /** Booster type */
  type: 'recency' | 'engagement' | 'sourceAffinity';
  
  /** Multiplier value */
  weight: number;
  
  /** Optional parameters */
  params?: Record<string, any>;
}

/**
 * Diversity constraint configuration
 */
export interface DiversityConfig {
  /** Max items from one source */
  maxPerSource?: number;
  
  /** Enforce content type mixing */
  mixContentTypes?: boolean;
  
  /** Min different sources in results */
  minDifferentSources?: number;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  /** Sort type */
  type: 'chronological' | 'score' | 'random';
  
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Limit configuration
 */
export interface LimitConfig {
  /** Max items to return */
  maxItems: number;
  
  /** Pagination offset */
  offset?: number;
}

/**
 * Complete algorithm configuration
 * This is what users create/edit in YAML format
 */
export interface AlgorithmConfig {
  /** Schema version for forward compatibility */
  version: string;
  
  /** Human-readable name */
  name: string;
  
  /** Description of what this algorithm does */
  description: string;
  
  /** Optional author information */
  author?: string;
  
  /** Filters to apply */
  filters?: FilterConfig[];
  
  /** Boosters to apply */
  boosters?: BoosterConfig[];
  
  /** Diversity constraints */
  diversity?: DiversityConfig;
  
  /** Sort configuration */
  sort?: SortConfig;
  
  /** Limit configuration */
  limit?: LimitConfig;
  
  /** Optional custom TypeScript module path (power-user escape hatch) */
  customModule?: string;
  
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Algorithm execution result
 */
export interface AlgorithmResult {
  /** Scored and sorted content items */
  items: ScoredContentItem[];
  
  /** Metadata about execution */
  meta: {
    totalProcessed: number;
    totalFiltered: number;
    executionTimeMs: number;
  };
}

/**
 * Content item with score
 */
export interface ScoredContentItem {
  /** The content item */
  content: any; // ContentItem - avoiding circular import
  
  /** Computed score */
  score: number;
  
  /** Score breakdown for debugging */
  scoreBreakdown?: Record<string, number>;
}
