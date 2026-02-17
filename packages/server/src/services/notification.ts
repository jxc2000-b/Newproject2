import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';
import type { Notification } from '@feed-platform/core';
import { eq, desc } from 'drizzle-orm';

/**
 * Notification service - manages notifications
 */
export class NotificationService {
  /**
   * Create a notification
   */
  async create(
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    url?: string,
    source?: string,
    meta?: Record<string, any>
  ): Promise<string> {
    const result = await db
      .insert(notifications)
      .values({
        title,
        message,
        priority,
        url,
        source,
        meta: meta || {},
      })
      .returning({ id: notifications.id });

    return result[0].id;
  }

  /**
   * Get all notifications
   */
  async getAll(limit = 50): Promise<Notification[]> {
    const items = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.timestamp))
      .limit(limit);

    return items.map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      timestamp: new Date(item.timestamp),
      read: item.read || false,
      priority: item.priority as 'low' | 'medium' | 'high',
      url: item.url || undefined,
      source: item.source || undefined,
      meta: (item.meta as Record<string, any>) || {},
    }));
  }

  /**
   * Get unread notifications
   */
  async getUnread(): Promise<Notification[]> {
    const items = await db
      .select()
      .from(notifications)
      .where(eq(notifications.read, false))
      .orderBy(desc(notifications.timestamp));

    return items.map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      timestamp: new Date(item.timestamp),
      read: false,
      priority: item.priority as 'low' | 'medium' | 'high',
      url: item.url || undefined,
      source: item.source || undefined,
      meta: (item.meta as Record<string, any>) || {},
    }));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<void> {
    await db.update(notifications).set({ read: true });
  }

  /**
   * Delete notification
   */
  async delete(id: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }
}
