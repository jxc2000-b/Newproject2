import type { ContentItem, HackerNewsConnectorConfig } from '@feed-platform/core';
import { BaseConnector } from '../base.js';

interface HNItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  by?: string;
  time?: number;
  descendants?: number;
  text?: string;
  type?: string;
}

/**
 * Hacker News API connector
 */
export class HackerNewsConnector extends BaseConnector {
  private readonly apiBase = 'https://hacker-news.firebaseio.com/v0';

  constructor(id: string, config: HackerNewsConnectorConfig) {
    super(id, 'Hacker News', 'hackernews', config);
  }

  async fetch(since?: Date): Promise<ContentItem[]> {
    if (!this.isEnabled()) {
      return [];
    }

    const config = this.config as HackerNewsConnectorConfig;
    const feed = config.feed || 'top';
    const maxItems = config.maxItems || 30;

    try {
      // Get story IDs
      const idsResponse = await fetch(`${this.apiBase}/${feed}stories.json`);
      const ids: number[] = await idsResponse.json();

      // Fetch items in parallel (limited batch)
      const itemPromises = ids.slice(0, maxItems).map(id => this.fetchItem(id));
      const items = await Promise.all(itemPromises);

      // Filter out nulls and convert to ContentItem
      const contentItems: ContentItem[] = items
        .filter((item): item is HNItem => item !== null)
        .filter(item => {
          if (!since) return true;
          const itemTime = new Date((item.time || 0) * 1000);
          return itemTime >= since;
        })
        .map(item => this.convertToContentItem(item));

      return contentItems;
    } catch (error) {
      console.error('Hacker News fetch error:', error);
      return [];
    }
  }

  private async fetchItem(id: number): Promise<HNItem | null> {
    try {
      const response = await fetch(`${this.apiBase}/item/${id}.json`);
      return await response.json();
    } catch {
      return null;
    }
  }

  private convertToContentItem(item: HNItem): ContentItem {
    const timestamp = new Date((item.time || 0) * 1000);
    const url = item.url || `https://news.ycombinator.com/item?id=${item.id}`;

    return {
      id: `hn-${item.id}`,
      source: this.id,
      url,
      title: item.title || 'Untitled',
      timestamp,
      type: item.type === 'job' ? 'event' : 'article',
      meta: {
        score: item.score,
        author: item.by,
        comments: item.descendants,
        text: item.text,
        hnId: item.id,
        hnType: item.type
      }
    };
  }

  async validate(): Promise<boolean | string> {
    const baseValidation = await super.validate();
    if (baseValidation !== true) {
      return baseValidation;
    }

    const config = this.config as HackerNewsConnectorConfig;
    const validFeeds = ['top', 'new', 'best', 'ask', 'show', 'job'];
    
    if (config.feed && !validFeeds.includes(config.feed)) {
      return `Invalid feed type. Must be one of: ${validFeeds.join(', ')}`;
    }

    return true;
  }
}
