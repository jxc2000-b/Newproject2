/**
 * Base connector interface
 * All connectors must implement this interface
 */
export interface Connector {
  /** Unique identifier for this connector */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Connector type */
  type: string;
  
  /** Configuration for this connector instance */
  config: ConnectorConfig;
  
  /**
   * Fetch content from this connector
   * @param since - Only fetch content after this date
   * @returns Array of content items
   */
  fetch(since?: Date): Promise<any[]>; // ContentItem[] - avoiding circular import
  
  /**
   * Validate connector configuration
   * @returns true if valid, error message if invalid
   */
  validate(): Promise<boolean | string>;
}

/**
 * Base connector configuration
 */
export interface ConnectorConfig {
  /** Enabled state */
  enabled: boolean;
  
  /** Fetch interval in seconds */
  fetchInterval?: number;
  
  /** Additional connector-specific config */
  [key: string]: any;
}

/**
 * RSS/Atom connector config
 */
export interface RSSConnectorConfig extends ConnectorConfig {
  feedUrl: string;
}

/**
 * Hacker News connector config
 */
export interface HackerNewsConnectorConfig extends ConnectorConfig {
  /** Which HN feed to pull from */
  feed: 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';
  
  /** Max items to fetch */
  maxItems?: number;
}

/**
 * Reddit connector config
 */
export interface RedditConnectorConfig extends ConnectorConfig {
  /** Subreddit name (without r/) */
  subreddit: string;
  
  /** Sort method */
  sort: 'hot' | 'new' | 'top' | 'rising';
  
  /** Time filter for 'top' sort */
  timeFilter?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  
  /** Max items to fetch */
  maxItems?: number;
}

/**
 * Webhook connector config
 */
export interface WebhookConnectorConfig extends ConnectorConfig {
  /** Webhook secret for validation */
  secret?: string;
  
  /** Whether to trigger notifications */
  triggerNotification?: boolean;
}
