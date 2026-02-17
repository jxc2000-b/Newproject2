# Development Setup Guide

Complete guide to setting up and running the feed aggregation platform locally.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 14.0 or higher

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd Newproject2
npm install
```

This will install dependencies for all packages in the monorepo.

## Step 2: Set Up PostgreSQL

### Option A: Local PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a database:

```bash
createdb feedplatform
```

### Option B: Docker PostgreSQL

```bash
docker run --name feedplatform-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feedplatform \
  -p 5432:5432 \
  -d postgres:14
```

## Step 3: Configure Environment

```bash
cd packages/server
cp .env.example .env
```

Edit `.env` with your database connection:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feedplatform
CORS_ORIGIN=http://localhost:5173
```

## Step 4: Initialize Database

From the `packages/server` directory:

```bash
# Push schema to database
npm run db:push

# Seed marketplace with example algorithms
npm run db:seed
```

## Step 5: Build Packages

From the root directory:

```bash
npm run build
```

This compiles TypeScript for all packages.

## Step 6: Start Development Servers

You'll need two terminal windows:

### Terminal 1: Backend Server

```bash
cd packages/server
npm run dev
```

Server runs at `http://localhost:3001`

### Terminal 2: Frontend App

```bash
cd packages/web
npm run dev
```

App runs at `http://localhost:5173`

## Step 7: Try It Out!

1. Open `http://localhost:5173` in your browser
2. Navigate to **Sources** tab
3. Add a source:
   - **RSS Example**:
     - ID: `hn-rss`
     - Name: `Hacker News RSS`
     - Type: `RSS/Atom`
     - Config: `{"feedUrl": "https://hnrss.org/frontpage"}`
   - **Hacker News API**:
     - ID: `hn-api`
     - Name: `Hacker News API`
     - Type: `Hacker News`
     - Config: `{"feed": "top", "maxItems": 30}`
4. Click **Fetch Now** to pull content
5. Navigate to **Algorithms** tab and create an algorithm
6. Navigate to **Feed** tab and select your algorithm
7. View your personalized feed!

## Development Workflow

### Making Changes

- **Core/Connectors**: Edit TypeScript, rebuild with `npm run build` in package dir
- **Server**: Changes auto-reload with `tsx watch` (no rebuild needed)
- **Web**: Changes auto-reload with Vite HMR (no rebuild needed)

### Database Changes

After modifying `packages/server/src/db/schema.ts`:

```bash
cd packages/server
npm run db:push  # Push changes to database
```

### View Database

```bash
cd packages/server
npm run db:studio  # Opens Drizzle Studio
```

## Common Issues

### "Cannot find module '@feed-platform/core'"

Build the core package first:

```bash
cd packages/core
npm run build
```

### Database Connection Error

- Check PostgreSQL is running: `pg_isready`
- Verify connection string in `.env`
- Check database exists: `psql -l | grep feedplatform`

### Port Already in Use

Change ports in:

- Server: `packages/server/.env` (PORT)
- Web: `packages/web/vite.config.ts` (server.port)

## Testing Features

### 1. RSS Connector

Add a source with type `rss` and fetch content.

### 2. Hacker News Connector

Add a source with type `hackernews` and fetch top stories.

### 3. Reddit Connector

Add a source:

- Type: `reddit`
- Config: `{"subreddit": "programming", "sort": "hot", "maxItems": 25}`

### 4. Webhook Notifications

1. Add a webhook source:
   - Type: `webhook`
   - Config: `{"secret": "test123", "triggerNotification": true}`
2. Send a POST request:

```bash
curl -X POST http://localhost:3001/api/webhook/YOUR_SOURCE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "Hello from webhook!",
    "type": "notification",
    "secret": "test123",
    "priority": "high"
  }'
```

3. Check **Notifications** tab

### 5. Algorithm Marketplace

1. Go to **Marketplace** tab
2. Browse seeded algorithms
3. Click **Install** to add to your collection

## Production Build

```bash
# Build all packages
npm run build

# Start server in production mode
cd packages/server
npm start

# Serve web app (use a static server or CDN)
cd packages/web
npm run preview  # Or deploy dist/ folder
```

## Next Steps

- Explore algorithm YAML syntax in `packages/core/examples/`
- Read package READMEs for API details
- Create custom connectors
- Experiment with algorithm primitives

## Need Help?

- Check package-specific READMEs
- Review `ROADMAP.md` for future features
- Open an issue on GitHub
