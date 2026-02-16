import Parser from 'rss-parser';
import type { ContentItem, RSSConnectorConfig } from '@feed-platform/core';
import { BaseConnector } from '../base.js';

/**
 * RSS/Atom feed connector
 * Covers Substack, blogs, news sites, etc.
 */
export class RSSConnector extends BaseConnector {
  private parser: Parser;

  constructor(id: string, config: RSSConnectorConfig) {
    super(id, 'RSS Feed', 'rss', config);
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:thumbnail', 'mediaThumbnail'],
          ['media:content', 'mediaContent']
        ]
      }
    });
  }

  async fetch(since?: Date): Promise<ContentItem[]> {
    if (!this.isEnabled()) {
      return [];
    }

    const config = this.config as RSSConnectorConfig;
    
    try {
      const feed = await this.parser.parseURL(config.feedUrl);
      const items: ContentItem[] = [];

      for (const item of feed.items) {
        const timestamp = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Filter by date if specified
        if (since && timestamp < since) {
          continue;
        }

        items.push({
          id: item.guid || item.link || `${this.id}-${timestamp.getTime()}`,
          source: this.id,
          url: item.link || '',
          title: item.title || 'Untitled',
          timestamp,
          type: this.determineContentType(item),
          meta: {
            description: item.contentSnippet || item.content,
            author: item.creator || item.author,
            categories: item.categories,
            thumbnail: (item as any).mediaThumbnail?.['$']?.url || (item as any).mediaContent?.['$']?.url,
            feedTitle: feed.title
          }
        });
      }

      return items;
    } catch (error) {
      console.error(`RSS fetch error for ${config.feedUrl}:`, error);
      return [];
    }
  }

  async validate(): Promise<boolean | string> {
    const baseValidation = await super.validate();
    if (baseValidation !== true) {
      return baseValidation;
    }

    const config = this.config as RSSConnectorConfig;
    if (!config.feedUrl) {
      return 'Feed URL is required';
    }

    try {
      new URL(config.feedUrl);
      return true;
    } catch {
      return 'Invalid feed URL';
    }
  }

  private determineContentType(item: any): ContentItem['type'] {
    // Try to determine type from enclosures or media
    if (item.enclosure?.type?.startsWith('image/') || (item as any).mediaThumbnail) {
      return 'image';
    }
    if (item.enclosure?.type?.startsWith('video/')) {
      return 'video';
    }
    return 'article';
  }
}
