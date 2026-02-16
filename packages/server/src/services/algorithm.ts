import { db } from '../db/index.js';
import { algorithms } from '../db/schema.js';
import type { AlgorithmConfig } from '@feed-platform/core';
import { eq } from 'drizzle-orm';

/**
 * Algorithm service - manages algorithm configurations
 */
export class AlgorithmService {
  /**
   * Create a new algorithm
   */
  async create(config: AlgorithmConfig, author?: string): Promise<string> {
    const result = await db
      .insert(algorithms)
      .values({
        name: config.name,
        description: config.description,
        config: config as any,
        tags: config.tags || [],
        author: author || config.author,
        isPublic: false,
      })
      .returning({ id: algorithms.id });

    return result[0].id;
  }

  /**
   * Get all algorithms
   */
  async getAll(): Promise<Array<{ id: string; name: string; description: string; tags: string[]; config: AlgorithmConfig }>> {
    const items = await db.select().from(algorithms);

    return items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      tags: (item.tags as string[]) || [],
      config: item.config as AlgorithmConfig,
    }));
  }

  /**
   * Get algorithm by ID
   */
  async getById(id: string): Promise<AlgorithmConfig | null> {
    const items = await db
      .select()
      .from(algorithms)
      .where(eq(algorithms.id, id))
      .limit(1);

    return items.length > 0 ? (items[0].config as AlgorithmConfig) : null;
  }

  /**
   * Update algorithm
   */
  async update(id: string, config: AlgorithmConfig): Promise<void> {
    await db
      .update(algorithms)
      .set({
        name: config.name,
        description: config.description,
        config: config as any,
        tags: config.tags || [],
        author: config.author,
        updatedAt: new Date(),
      })
      .where(eq(algorithms.id, id));
  }

  /**
   * Delete algorithm
   */
  async delete(id: string): Promise<void> {
    await db.delete(algorithms).where(eq(algorithms.id, id));
  }
}
