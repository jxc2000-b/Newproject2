# Feed Aggregation Platform

A modular feed aggregation platform with open standards for building algorithmic feeds via a plugin SDK designed to eventually become a protocol.

## Overview

This platform pioneers **open standards for building algorithmic feeds** through:
- **Universal Content Envelope**: Minimal schema for maximum connector compatibility
- **Declarative YAML Algorithms**: Portable, composable feed ranking configs
- **Pluggable Connectors**: Adapters for any content source (RSS, APIs, webhooks)
- **Algorithm Marketplace**: Share and discover community algorithms

Think Google Chrome's Discover feature, but with a broader set of integrations and community-driven algorithms.

## Architecture: Three-Layer Model

### 1. Connector Layer
Adapters that pull content from external sources and normalize into the Content Layer format.

**POC Connectors:**
- RSS/Atom (Substack, blogs, news)
- Hacker News API
- Reddit API
- Generic Webhook (IoT, custom pushes)

### 2. Content Layer (Universal Content Envelope)
Minimal required schema for maximum compatibility:
- `id`, `source`, `url`, `title`, `timestamp`, `type`, `meta`

### 3. Algorithm Layer (Plugin SDK)
Feed algorithms are **portable, declarative YAML configs** with optional TypeScript modules as power-user escape hatch.

**Algorithm Primitives:**
- Filters (include/exclude by source, keyword, type, age)
- Boosters (recency, engagement, source affinity)
- Diversity constraints (max per source, content type mixing)
- Sorts (chronological, score-based, random)
- Limits (pagination)

## Monorepo Structure

```
packages/
  core/          # Shared types, algorithm engine, content envelope spec
  server/        # Fastify API + PostgreSQL + Drizzle ORM
  web/           # React frontend (Vite)
  connectors/    # RSS, HN, Reddit, Webhook adapters
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install all dependencies
npm install

# Set up environment variables
cp packages/server/.env.example packages/server/.env
# Edit packages/server/.env with your PostgreSQL connection string

# Generate database schema
cd packages/server
npm run db:push
cd ../..
```

### Development

```bash
# Terminal 1: Start server
cd packages/server
npm run dev

# Terminal 2: Start web app
cd packages/web
npm run dev
```

- **Server**: http://localhost:3001
- **Web App**: http://localhost:5173

### First Steps

1. **Add a Source**: Go to Sources tab, add an RSS feed or HN connector
2. **Fetch Content**: Click "Fetch Now" to pull content
3. **Create Algorithm**: Go to Algorithms tab, create a YAML config
4. **View Feed**: Go to Feed tab, select your algorithm

## Features (POC)

✅ **No auth / single user** (no login system)  
✅ **Feed view** with algorithm selection  
✅ **Algorithm editor** with YAML editor  
✅ **Source management** for connectors  
✅ **Notification system** for webhooks (in-feed + toast)  
✅ **Algorithm marketplace** (mock/seed data ready)

## Example Algorithm

```yaml
version: "0.1.0"
name: "Tech News Feed"
description: "Curated tech news with recency boost"

filters:
  - type: keyword
    mode: include
    values: [tech, programming, AI]
  
  - type: age
    mode: include
    maxAge: 86400  # 24 hours

boosters:
  - type: recency
    weight: 2.0
  
  - type: engagement
    weight: 1.5

diversity:
  maxPerSource: 3

sort:
  type: score
  direction: desc

limit:
  maxItems: 50
```

## Key Design Principles

- **Modularity is the maxim** — everything is pluggable and swappable
- **Plugin SDK designed to become a protocol** — YAML configs are already "protocol-shaped"
- **Intentionally loose content format** — maximum compatibility, minimum friction

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for future iterations including:
- Algorithm versioning & fingerprinting
- Algorithm stack composition (pipeline layers)
- Dry-run / preview mode
- Feed diff notifications
- Content regulation layer
- Authentication & multi-user
- Mobile app
- Twitter/X integration

## Documentation

- **Core Package**: [packages/core/README.md](./packages/core/README.md)
- **Server Package**: [packages/server/README.md](./packages/server/README.md)
- **Web Package**: [packages/web/README.md](./packages/web/README.md)
- **Connectors Package**: [packages/connectors/README.md](./packages/connectors/README.md)

## API Endpoints

### Feed
- `GET /api/feed/:algorithmId` - Get feed
- `POST /api/feed/custom` - Custom YAML feed
- `GET /api/content` - Raw content

### Algorithms
- `GET /api/algorithms` - List
- `POST /api/algorithms` - Create
- `PUT /api/algorithms/:id` - Update
- `DELETE /api/algorithms/:id` - Delete

### Sources
- `GET /api/sources` - List
- `POST /api/sources` - Create
- `POST /api/sources/:id/fetch` - Fetch content
- `POST /api/sources/fetch-all` - Fetch all

### Notifications
- `GET /api/notifications` - List
- `POST /api/notifications/:id/read` - Mark read
- `POST /api/webhook/:sourceId` - Webhook endpoint

### Marketplace
- `GET /api/marketplace` - Browse algorithms

## Creating Custom Connectors

```typescript
import { BaseConnector } from '@feed-platform/connectors';
import type { ContentItem } from '@feed-platform/core';

class MyConnector extends BaseConnector {
  async fetch(since?: Date): Promise<ContentItem[]> {
    // Fetch from your source
    // Normalize to ContentItem format
    return items;
  }
}
```

## License

MIT
