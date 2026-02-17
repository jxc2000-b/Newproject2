# Project Structure

Complete overview of the feed aggregation platform repository.

## Repository Stats

- **Total TypeScript Files**: 60+
- **Packages**: 4 (core, connectors, server, web)
- **Lines of Code**: ~8,000+
- **Example Configs**: 3 algorithm YAMLs + 6 marketplace seeds

## Directory Tree

```
Newproject2/
├── README.md                       # Main project documentation
├── ROADMAP.md                      # Future feature roadmap
├── SETUP.md                        # Development setup guide
├── package.json                    # Root workspace config
├── tsconfig.json                   # Root TypeScript config
├── .gitignore                      # Git ignore patterns
│
└── packages/
    │
    ├── core/                       # Core types & algorithm engine
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── src/
    │   │   ├── index.ts           # Package exports
    │   │   ├── types/             # TypeScript interfaces
    │   │   │   ├── content.ts     # Content envelope
    │   │   │   ├── algorithm.ts   # Algorithm config types
    │   │   │   ├── connector.ts   # Connector interfaces
    │   │   │   └── notification.ts
    │   │   ├── engine/            # Algorithm execution
    │   │   │   ├── index.ts       # Main engine
    │   │   │   ├── filters.ts     # Filter primitives
    │   │   │   ├── boosters.ts    # Scoring primitives
    │   │   │   ├── diversity.ts   # Diversity constraints
    │   │   │   └── sorting.ts     # Sort implementations
    │   │   └── utils/
    │   │       └── yaml.ts        # YAML parser
    │   └── examples/              # Example algorithm configs
    │       ├── tech-news.yaml
    │       ├── chronological.yaml
    │       └── diverse-mix.yaml
    │
    ├── connectors/                 # Content source adapters
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts
    │       ├── base.ts            # Base connector class
    │       ├── rss/
    │       │   └── index.ts       # RSS/Atom connector
    │       ├── hackernews/
    │       │   └── index.ts       # Hacker News connector
    │       ├── reddit/
    │       │   └── index.ts       # Reddit connector
    │       └── webhook/
    │           └── index.ts       # Webhook connector
    │
    ├── server/                     # Backend API server
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── drizzle.config.ts      # Drizzle ORM config
    │   ├── .env.example           # Environment template
    │   ├── src/
    │   │   ├── index.ts           # Main server entry
    │   │   ├── db/
    │   │   │   ├── index.ts       # Database connection
    │   │   │   └── schema.ts      # Database schema
    │   │   ├── services/          # Business logic
    │   │   │   ├── content.ts
    │   │   │   ├── algorithm.ts
    │   │   │   ├── source.ts
    │   │   │   ├── notification.ts
    │   │   │   └── feed.ts
    │   │   └── routes/            # API endpoints
    │   │       ├── feed.ts
    │   │       ├── algorithm.ts
    │   │       ├── source.ts
    │   │       ├── notification.ts
    │   │       └── marketplace.ts
    │   └── scripts/
    │       └── seed.ts            # Database seeding
    │
    └── web/                        # React frontend
        ├── README.md
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts         # Vite configuration
        ├── index.html             # HTML template
        ├── .eslintrc.cjs          # ESLint config
        └── src/
            ├── main.tsx           # App entry point
            ├── App.tsx            # Main app component
            ├── index.css          # Global styles
            ├── vite-env.d.ts      # Vite types
            ├── services/
            │   └── api.ts         # API client layer
            └── pages/             # Route components
                ├── FeedView.tsx
                ├── AlgorithmEditor.tsx
                ├── SourceManager.tsx
                ├── Notifications.tsx
                └── Marketplace.tsx
```

## Key Files

### Configuration
- **Root**: Workspace config for monorepo
- **TSConfig**: Shared TypeScript configuration
- **Drizzle**: Database ORM configuration
- **Vite**: Frontend build tool config

### Core Logic
- **Algorithm Engine**: `packages/core/src/engine/`
- **Type Definitions**: `packages/core/src/types/`
- **Connectors**: `packages/connectors/src/`

### Backend
- **Database Schema**: `packages/server/src/db/schema.ts`
- **API Routes**: `packages/server/src/routes/`
- **Services**: `packages/server/src/services/`

### Frontend
- **Pages**: `packages/web/src/pages/`
- **API Client**: `packages/web/src/services/api.ts`

## Package Dependencies

```
web         → server (API calls)
server      → core, connectors
connectors  → core (types)
core        → standalone
```

## Build Order

1. **core** - Base types and engine
2. **connectors** - Depends on core types
3. **server** - Depends on core + connectors
4. **web** - Standalone (connects via HTTP)

## API Surface

### Core Package
- Types: `ContentItem`, `AlgorithmConfig`, `Connector`, `Notification`
- Engine: `AlgorithmEngine.execute()`
- Utils: `parseAlgorithmConfig()`, `serializeAlgorithmConfig()`

### Connectors Package
- Classes: `RSSConnector`, `HackerNewsConnector`, `RedditConnector`, `WebhookConnector`
- Base: `BaseConnector` (extend to create custom)

### Server Package
- Endpoints: Feed, Algorithm, Source, Notification, Marketplace APIs
- Services: Content, Algorithm, Source, Notification, Feed

### Web Package
- Pages: Feed View, Algorithm Editor, Source Manager, Notifications, Marketplace
- API Client: Axios-based HTTP client

## Documentation

- **README.md**: Main project overview
- **ROADMAP.md**: Future features and enhancements
- **SETUP.md**: Step-by-step development setup
- **packages/*/README.md**: Package-specific documentation

## Next Steps for Development

1. Run `npm install` from root
2. Set up PostgreSQL database
3. Configure `packages/server/.env`
4. Run `npm run db:push` in server package
5. Run `npm run db:seed` to add marketplace data
6. Start both server (`npm run dev`) and web (`npm run dev`)
7. Open http://localhost:5173

## License

MIT
