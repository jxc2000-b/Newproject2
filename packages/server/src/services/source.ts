import { db } from '../db/index.js';
import { sources } from '../db/schema.js';
import type { Connector, ConnectorConfig } from '@feed-platform/core';
import { 
  RSSConnector, 
  HackerNewsConnector, 
  RedditConnector, 
  WebhookConnector 
} from '@feed-platform/connectors';
import { eq } from 'drizzle-orm';

/**
 * Source service - manages connector instances
 */
export class SourceService {
  private connectors: Map<string, Connector> = new Map();

  /**
   * Create a new source
   */
  async create(id: string, name: string, type: string, config: ConnectorConfig): Promise<void> {
    await db.insert(sources).values({
      id,
      name,
      type,
      config: config as any,
      enabled: config.enabled !== false,
    });

    // Initialize connector
    this.initializeConnector(id, name, type, config);
  }

  /**
   * Get all sources
   */
  async getAll(): Promise<Array<{ id: string; name: string; type: string; config: ConnectorConfig; enabled: boolean }>> {
    const items = await db.select().from(sources);

    // Initialize connectors
    for (const item of items) {
      if (!this.connectors.has(item.id)) {
        this.initializeConnector(item.id, item.name, item.type, item.config as ConnectorConfig);
      }
    }

    return items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      config: item.config as ConnectorConfig,
      enabled: item.enabled || false,
    }));
  }

  /**
   * Get source by ID
   */
  async getById(id: string): Promise<{ id: string; name: string; type: string; config: ConnectorConfig } | null> {
    const items = await db
      .select()
      .from(sources)
      .where(eq(sources.id, id))
      .limit(1);

    return items.length > 0
      ? {
          id: items[0].id,
          name: items[0].name,
          type: items[0].type,
          config: items[0].config as ConnectorConfig,
        }
      : null;
  }

  /**
   * Update source
   */
  async update(id: string, name: string, config: ConnectorConfig): Promise<void> {
    const source = await this.getById(id);
    if (!source) return;

    await db
      .update(sources)
      .set({
        name,
        config: config as any,
        enabled: config.enabled !== false,
        updatedAt: new Date(),
      })
      .where(eq(sources.id, id));

    // Re-initialize connector
    this.initializeConnector(id, name, source.type, config);
  }

  /**
   * Delete source
   */
  async delete(id: string): Promise<void> {
    await db.delete(sources).where(eq(sources.id, id));
    this.connectors.delete(id);
  }

  /**
   * Get connector instance
   */
  getConnector(id: string): Connector | null {
    return this.connectors.get(id) || null;
  }

  /**
   * Get all connector instances
   */
  getAllConnectors(): Connector[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Update last fetch timestamp
   */
  async updateLastFetch(id: string): Promise<void> {
    await db
      .update(sources)
      .set({ lastFetchAt: new Date() })
      .where(eq(sources.id, id));
  }

  /**
   * Initialize connector instance
   */
  private initializeConnector(id: string, name: string, type: string, config: ConnectorConfig): void {
    let connector: Connector;

    switch (type) {
      case 'rss':
        connector = new RSSConnector(id, config as any);
        break;
      case 'hackernews':
        connector = new HackerNewsConnector(id, config as any);
        break;
      case 'reddit':
        connector = new RedditConnector(id, config as any);
        break;
      case 'webhook':
        connector = new WebhookConnector(id, config as any);
        break;
      default:
        console.warn(`Unknown connector type: ${type}`);
        return;
    }

    this.connectors.set(id, connector);
  }
}
