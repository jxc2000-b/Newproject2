# @feed-platform/connectors

Connector adapters for pulling content from external sources.

## Available Connectors

### RSS/Atom Connector
Pulls content from RSS/Atom feeds (Substack, blogs, news sites).

```typescript
import { RSSConnector } from '@feed-platform/connectors';

const connector = new RSSConnector('my-blog', {
  enabled: true,
  feedUrl: 'https://example.com/feed.xml'
});

const items = await connector.fetch();
```

### Hacker News Connector
Pulls stories from Hacker News API.

```typescript
import { HackerNewsConnector } from '@feed-platform/connectors';

const connector = new HackerNewsConnector('hn', {
  enabled: true,
  feed: 'top',  // 'top' | 'new' | 'best' | 'ask' | 'show' | 'job'
  maxItems: 30
});

const items = await connector.fetch();
```

### Reddit Connector
Pulls posts from Reddit (no auth required, uses public JSON endpoints).

```typescript
import { RedditConnector } from '@feed-platform/connectors';

const connector = new RedditConnector('programming', {
  enabled: true,
  subreddit: 'programming',
  sort: 'hot',  // 'hot' | 'new' | 'top' | 'rising'
  timeFilter: 'day',  // for 'top' sort
  maxItems: 25
});

const items = await connector.fetch();
```

### Webhook Connector
Receives webhooks and converts them to content items.

```typescript
import { WebhookConnector } from '@feed-platform/connectors';

const connector = new WebhookConnector('my-webhook', {
  enabled: true,
  secret: 'my-secret-key',
  triggerNotification: true
});

// Process incoming webhook
const item = await connector.processWebhook({
  title: 'New Event',
  url: 'https://example.com',
  type: 'notification',
  secret: 'my-secret-key'
});

// Fetch processed webhooks
const items = await connector.fetch();
```

## Creating Custom Connectors

Extend `BaseConnector` to create your own:

```typescript
import { BaseConnector } from '@feed-platform/connectors';
import type { ContentItem, ConnectorConfig } from '@feed-platform/core';

class MyConnector extends BaseConnector {
  constructor(id: string, config: ConnectorConfig) {
    super(id, 'My Connector', 'mytype', config);
  }

  async fetch(since?: Date): Promise<ContentItem[]> {
    // Implement fetch logic
    return [];
  }

  async validate(): Promise<boolean | string> {
    // Implement validation
    return true;
  }
}
```

## Connector Interface

All connectors implement:

- `fetch(since?: Date)`: Fetch content items
- `validate()`: Validate connector configuration
- `isEnabled()`: Check if connector is enabled

## License

MIT
