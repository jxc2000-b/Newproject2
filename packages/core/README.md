# @feed-platform/core

Core types, algorithm engine, and content envelope specification for the feed aggregation platform.

## Features

- **Universal Content Envelope**: Minimal schema for maximum compatibility
- **Algorithm Engine**: Declarative YAML-based feed algorithms
- **Algorithm Primitives**:
  - Filters (include/exclude by source, keyword, type, age)
  - Boosters (recency, engagement, source affinity)
  - Diversity constraints (max per source, content type mixing)
  - Sorting (chronological, score-based, random)
  - Limits (pagination support)
- **Versioned Schema**: Built-in versioning from day one

## Installation

```bash
npm install @feed-platform/core
```

## Usage

```typescript
import { AlgorithmEngine, parseAlgorithmConfig } from '@feed-platform/core';
import type { ContentItem, AlgorithmConfig } from '@feed-platform/core';

// Load algorithm config from YAML
const yamlConfig = `
version: "0.1.0"
name: "My Feed"
description: "Custom feed algorithm"
filters:
  - type: contentType
    mode: include
    values: [article]
sort:
  type: score
  direction: desc
limit:
  maxItems: 20
`;

const config = parseAlgorithmConfig(yamlConfig);

// Execute algorithm
const engine = new AlgorithmEngine();
const contentItems: ContentItem[] = [...]; // Your content
const result = await engine.execute(contentItems, config);

console.log(result.items); // Filtered, scored, sorted items
console.log(result.meta); // Execution metadata
```

## Content Envelope

All content sources normalize to this format:

```typescript
interface ContentItem {
  id: string;           // Unique identifier
  source: string;       // Connector identifier
  url: string;          // Link to original
  title: string;        // Display title
  timestamp: Date;      // Publication date
  type: 'article' | 'image' | 'video' | 'notification' | 'event';
  meta: Record<string, any>;  // Freeform metadata
}
```

## Algorithm Config Schema

See `examples/` directory for sample configurations.

### Version 0.1.0

Current schema version. All configs must include `version: "0.1.0"`.

### Example Algorithms

- **tech-news.yaml**: Tech news with recency boost
- **chronological.yaml**: Simple chronological feed
- **diverse-mix.yaml**: Balanced feed with content diversity

## License

MIT
