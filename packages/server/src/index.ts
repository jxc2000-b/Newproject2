import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';
import { feedRoutes } from './routes/feed.js';
import { algorithmRoutes } from './routes/algorithm.js';
import { sourceRoutes } from './routes/source.js';
import { notificationRoutes } from './routes/notification.js';
import { marketplaceRoutes } from './routes/marketplace.js';

// Load environment variables
config();

const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Main server application
 */
async function main() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await fastify.register(feedRoutes, { prefix: '/api' });
  await fastify.register(algorithmRoutes, { prefix: '/api' });
  await fastify.register(sourceRoutes, { prefix: '/api' });
  await fastify.register(notificationRoutes, { prefix: '/api' });
  await fastify.register(marketplaceRoutes, { prefix: '/api' });

  // Start server
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(`Health check: http://${HOST}:${PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
