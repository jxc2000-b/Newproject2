import type { ContentItem, WebhookConnectorConfig } from '@feed-platform/core';
import { BaseConnector } from '../base.js';

/**
 * Generic webhook connector
 * Receives webhooks and converts them to content items
 * Also supports triggering notifications
 */
export class WebhookConnector extends BaseConnector {
  private pendingItems: ContentItem[] = [];

  constructor(id: string, config: WebhookConnectorConfig) {
    super(id, 'Webhook', 'webhook', config);
  }

  /**
   * Process incoming webhook payload
   * This should be called by the server when a webhook is received
   */
  async processWebhook(payload: any): Promise<ContentItem> {
    const config = this.config as WebhookConnectorConfig;

    // Validate secret if configured
    if (config.secret && payload.secret !== config.secret) {
      throw new Error('Invalid webhook secret');
    }

    // Convert webhook payload to content item
    const item: ContentItem = {
      id: payload.id || `webhook-${Date.now()}-${Math.random()}`,
      source: this.id,
      url: payload.url || '',
      title: payload.title || 'Webhook Notification',
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      type: payload.type || 'notification',
      meta: {
        ...payload,
        webhookReceived: new Date().toISOString(),
        triggerNotification: config.triggerNotification
      }
    };

    // Store for next fetch
    this.pendingItems.push(item);

    return item;
  }

  /**
   * Fetch pending webhook items
   */
  async fetch(since?: Date): Promise<ContentItem[]> {
    if (!this.isEnabled()) {
      return [];
    }

    // Return and clear pending items
    const items = since
      ? this.pendingItems.filter(item => item.timestamp >= since)
      : [...this.pendingItems];

    this.pendingItems = [];
    return items;
  }

  /**
   * Get pending items count (for monitoring)
   */
  getPendingCount(): number {
    return this.pendingItems.length;
  }

  /**
   * Clear pending items
   */
  clearPending(): void {
    this.pendingItems = [];
  }

  async validate(): Promise<boolean | string> {
    const baseValidation = await super.validate();
    if (baseValidation !== true) {
      return baseValidation;
    }

    // Webhook connector is always valid if base validation passes
    return true;
  }
}
