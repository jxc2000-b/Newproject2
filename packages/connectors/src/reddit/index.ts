import type { ContentItem, RedditConnectorConfig } from '@feed-platform/core';
import { BaseConnector } from '../base.js';

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    permalink: string;
    created_utc: number;
    score: number;
    num_comments: number;
    author: string;
    selftext?: string;
    thumbnail?: string;
    is_video?: boolean;
    post_hint?: string;
  };
}

/**
 * Reddit API connector
 * Uses public JSON endpoints (no auth required)
 */
export class RedditConnector extends BaseConnector {
  private readonly apiBase = 'https://www.reddit.com';

  constructor(id: string, config: RedditConnectorConfig) {
    super(id, 'Reddit', 'reddit', config);
  }

  async fetch(since?: Date): Promise<ContentItem[]> {
    if (!this.isEnabled()) {
      return [];
    }

    const config = this.config as RedditConnectorConfig;
    const maxItems = config.maxItems || 25;

    try {
      const url = this.buildUrl(config);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FeedAggregator/0.1.0'
        }
      });

      const data = await response.json();
      const posts: RedditPost[] = data.data.children;

      const items: ContentItem[] = posts
        .filter(post => {
          if (!since) return true;
          const postTime = new Date(post.data.created_utc * 1000);
          return postTime >= since;
        })
        .slice(0, maxItems)
        .map(post => this.convertToContentItem(post));

      return items;
    } catch (error) {
      console.error(`Reddit fetch error for r/${config.subreddit}:`, error);
      return [];
    }
  }

  private buildUrl(config: RedditConnectorConfig): string {
    let url = `${this.apiBase}/r/${config.subreddit}/${config.sort}.json`;
    
    const params = new URLSearchParams();
    params.append('limit', String(config.maxItems || 25));
    
    if (config.sort === 'top' && config.timeFilter) {
      params.append('t', config.timeFilter);
    }

    return `${url}?${params.toString()}`;
  }

  private convertToContentItem(post: RedditPost): ContentItem {
    const timestamp = new Date(post.data.created_utc * 1000);
    const url = post.data.url.startsWith('http') 
      ? post.data.url 
      : `${this.apiBase}${post.data.permalink}`;

    return {
      id: `reddit-${post.data.id}`,
      source: this.id,
      url,
      title: post.data.title,
      timestamp,
      type: this.determineContentType(post.data),
      meta: {
        score: post.data.score,
        upvotes: post.data.score,
        comments: post.data.num_comments,
        author: post.data.author,
        selftext: post.data.selftext,
        thumbnail: post.data.thumbnail,
        subreddit: (this.config as RedditConnectorConfig).subreddit,
        permalink: `${this.apiBase}${post.data.permalink}`
      }
    };
  }

  private determineContentType(data: RedditPost['data']): ContentItem['type'] {
    if (data.is_video) {
      return 'video';
    }
    if (data.post_hint === 'image') {
      return 'image';
    }
    return 'article';
  }

  async validate(): Promise<boolean | string> {
    const baseValidation = await super.validate();
    if (baseValidation !== true) {
      return baseValidation;
    }

    const config = this.config as RedditConnectorConfig;
    
    if (!config.subreddit) {
      return 'Subreddit is required';
    }

    const validSorts = ['hot', 'new', 'top', 'rising'];
    if (!validSorts.includes(config.sort)) {
      return `Invalid sort. Must be one of: ${validSorts.join(', ')}`;
    }

    if (config.sort === 'top' && config.timeFilter) {
      const validTimeFilters = ['hour', 'day', 'week', 'month', 'year', 'all'];
      if (!validTimeFilters.includes(config.timeFilter)) {
        return `Invalid time filter. Must be one of: ${validTimeFilters.join(', ')}`;
      }
    }

    return true;
  }
}
