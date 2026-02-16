import type { Connector, ConnectorConfig } from '@feed-platform/core';
import type { ContentItem } from '@feed-platform/core';

/**
 * Abstract base class for all connectors
 */
export abstract class BaseConnector implements Connector {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public config: ConnectorConfig;

  constructor(
    id: string,
    name: string,
    type: string,
    config: ConnectorConfig
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.config = config;
  }

  /**
   * Fetch content from this connector
   * Must be implemented by subclasses
   */
  abstract fetch(since?: Date): Promise<ContentItem[]>;

  /**
   * Validate connector configuration
   * Can be overridden by subclasses
   */
  async validate(): Promise<boolean | string> {
    if (!this.config) {
      return 'Configuration is required';
    }
    return true;
  }

  /**
   * Check if connector is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled !== false;
  }
}
