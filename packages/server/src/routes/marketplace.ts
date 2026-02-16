import type { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { marketplaceAlgorithms } from '../db/schema.js';
import type { AlgorithmConfig } from '@feed-platform/core';

export async function marketplaceRoutes(fastify: FastifyInstance) {
  // Get all marketplace algorithms
  fastify.get('/marketplace', async (request, reply) => {
    try {
      const algorithms = await db.select().from(marketplaceAlgorithms);
      return {
        algorithms: algorithms.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          author: a.author,
          tags: a.tags as string[],
          downloads: a.downloads,
          rating: a.rating,
          createdAt: a.createdAt,
        }))
      };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get marketplace algorithm by ID
  fastify.get('/marketplace/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const items = await db
        .select()
        .from(marketplaceAlgorithms)
        .where((marketplaceAlgorithms as any).id.eq(id))
        .limit(1);

      if (items.length === 0) {
        return reply.code(404).send({ error: 'Algorithm not found' });
      }

      return {
        id: items[0].id,
        name: items[0].name,
        description: items[0].description,
        author: items[0].author,
        tags: items[0].tags as string[],
        config: items[0].config as AlgorithmConfig,
        downloads: items[0].downloads,
        rating: items[0].rating,
        createdAt: items[0].createdAt,
      };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Install algorithm from marketplace (copy to user algorithms)
  fastify.post('/marketplace/:id/install', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      // For POC, this just returns the config
      // In full version, would copy to user's algorithms
      const items = await db
        .select()
        .from(marketplaceAlgorithms)
        .where((marketplaceAlgorithms as any).id.eq(id))
        .limit(1);

      if (items.length === 0) {
        return reply.code(404).send({ error: 'Algorithm not found' });
      }

      return {
        success: true,
        config: items[0].config as AlgorithmConfig
      };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });
}
