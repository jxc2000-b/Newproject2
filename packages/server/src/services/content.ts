import { db } from '../db/index.js';
import { contentItems } from '../db/schema.js';
import type { ContentItem } from '@feed-platform/core';
import { eq, desc, and, gte, lt } from 'drizzle-orm';

/**
 * Content service - manages content items
 */
export class ContentService {
  /**
   * Store content items
   */
  async store(items: ContentItem[]): Promise<void> {
    if (items.length === 0) return;

    const records = items.map(item => ({
      id: item.id,
      source: item.source,
      url: item.url,
      title: item.title,
      timestamp: item.timestamp,
      type: item.type,
      meta: item.meta,
    }));

    // Upsert content items (insert or update on conflict)
    for (const record of records) {
      await db.insert(contentItems)
        .values(record)
        .onConflictDoUpdate({
          target: contentItems.id,
          set: record,
        });
    }
  }

  /**
   * Get all content items
   */
  async getAll(limit = 100, offset = 0): Promise<ContentItem[]> {
    const items = await db
      .select()
      .from(contentItems)
      .orderBy(desc(contentItems.timestamp))
      .limit(limit)
      .offset(offset);

    return items.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      type: item.type as ContentItem['type'],
      meta: item.meta as Record<string, any>,
    }));
  }

  /**
   * Get content items by source
   */
  async getBySource(source: string, since?: Date): Promise<ContentItem[]> {
    const conditions = since
      ? and(eq(contentItems.source, source), gte(contentItems.timestamp, since))
      : eq(contentItems.source, source);

    const items = await db
      .select()
      .from(contentItems)
      .where(conditions)
      .orderBy(desc(contentItems.timestamp));

    return items.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      type: item.type as ContentItem['type'],
      meta: item.meta as Record<string, any>,
    }));
  }

  /**
   * Get content items since timestamp
   */
  async getSince(since: Date): Promise<ContentItem[]> {
    const items = await db
      .select()
      .from(contentItems)
      .where(gte(contentItems.timestamp, since))
      .orderBy(desc(contentItems.timestamp));

    return items.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      type: item.type as ContentItem['type'],
      meta: item.meta as Record<string, any>,
    }));
  }

  /**
   * Delete old content items
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const result = await db
      .delete(contentItems)
      .where(lt(contentItems.timestamp, date));

    return 0; // PostgreSQL doesn't return affected rows easily
  }
}
