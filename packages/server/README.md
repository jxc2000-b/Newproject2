# @feed-platform/server

Backend API server for the feed aggregation platform.

## Features

- **Fastify** web framework
- **PostgreSQL** database with **Drizzle ORM**
- RESTful API for feeds, algorithms, sources, and notifications
- Webhook ingestion endpoint
- Content fetching from connectors
- Algorithm execution engine integration

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:5173)

### Database Setup

1. Create PostgreSQL database:
```bash
createdb feedplatform
```

2. Generate and run migrations:
```bash
npm run db:generate
npm run db:migrate
```

Or push schema directly (development):
```bash
npm run db:push
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Feed

- `GET /api/feed/:algorithmId` - Get feed using algorithm
- `POST /api/feed/custom` - Generate feed with custom YAML config
- `GET /api/content` - Get raw content items

### Algorithms

- `GET /api/algorithms` - List all algorithms
- `GET /api/algorithms/:id` - Get algorithm by ID
- `POST /api/algorithms` - Create algorithm
- `PUT /api/algorithms/:id` - Update algorithm
- `DELETE /api/algorithms/:id` - Delete algorithm

### Sources

- `GET /api/sources` - List all sources
- `GET /api/sources/:id` - Get source by ID
- `POST /api/sources` - Create source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source
- `POST /api/sources/:id/fetch` - Fetch content from source
- `POST /api/sources/fetch-all` - Fetch all sources

### Notifications

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Webhooks

- `POST /api/webhook/:sourceId` - Receive webhook

### Marketplace

- `GET /api/marketplace` - Browse marketplace algorithms
- `GET /api/marketplace/:id` - Get marketplace algorithm
- `POST /api/marketplace/:id/install` - Install algorithm

## Database Schema

### Tables

- **content_items**: Stored content from connectors
- **algorithms**: User-created algorithm configs
- **sources**: Connector instances
- **notifications**: System notifications
- **marketplace_algorithms**: Public algorithm marketplace

## Architecture

```
src/
├── db/           # Database connection and schema
├── services/     # Business logic layer
├── routes/       # API route handlers
└── index.ts      # Main server entry point
```

## Development Tools

- **Drizzle Studio**: Visual database browser
```bash
npm run db:studio
```

## License

MIT
