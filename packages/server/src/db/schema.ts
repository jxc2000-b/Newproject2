import { pgTable, text, timestamp, boolean, jsonb, integer, uuid } from 'drizzle-orm/pg-core';

/**
 * Content items table
 */
export const contentItems = pgTable('content_items', {
  id: text('id').primaryKey(),
  source: text('source').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  type: text('type').notNull(), // 'article' | 'image' | 'video' | 'notification' | 'event'
  meta: jsonb('meta').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Algorithms table
 */
export const algorithms = pgTable('algorithms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  config: jsonb('config').notNull(), // Full algorithm config
  tags: jsonb('tags').default([]),
  author: text('author'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Sources (connector instances) table
 */
export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'rss' | 'hackernews' | 'reddit' | 'webhook'
  config: jsonb('config').notNull(),
  enabled: boolean('enabled').default(true),
  lastFetchAt: timestamp('last_fetch_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Notifications table
 */
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  read: boolean('read').default(false),
  priority: text('priority').notNull().default('medium'), // 'low' | 'medium' | 'high'
  url: text('url'),
  source: text('source'),
  meta: jsonb('meta').default({}),
});

/**
 * Marketplace algorithms (seed data)
 */
export const marketplaceAlgorithms = pgTable('marketplace_algorithms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  config: jsonb('config').notNull(),
  tags: jsonb('tags').default([]),
  author: text('author'),
  downloads: integer('downloads').default(0),
  rating: integer('rating').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
