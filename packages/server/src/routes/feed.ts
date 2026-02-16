import type { FastifyInstance } from 'fastify';
import { FeedService } from '../services/feed.js';
import { ContentService } from '../services/content.js';
import { AlgorithmService } from '../services/algorithm.js';
import { parseAlgorithmConfig } from '@feed-platform/core';

export async function feedRoutes(fastify: FastifyInstance) {
  const contentService = new ContentService();
  const algorithmService = new AlgorithmService();
  const feedService = new FeedService(contentService, algorithmService);

  // Get feed by algorithm ID
  fastify.get('/feed/:algorithmId', async (request, reply) => {
    const { algorithmId } = request.params as { algorithmId: string };

    try {
      const result = await feedService.generateFeed(algorithmId);
      return result;
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });

  // Generate feed with custom algorithm (YAML in body)
  fastify.post('/feed/custom', async (request, reply) => {
    const { yaml } = request.body as { yaml: string };

    try {
      const config = parseAlgorithmConfig(yaml);
      const result = await feedService.generateCustomFeed(config);
      return result;
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Get raw content items
  fastify.get('/content', async (request, reply) => {
    const { limit = 100, offset = 0 } = request.query as { limit?: number; offset?: number };

    try {
      const items = await contentService.getAll(Number(limit), Number(offset));
      return { items };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });
}
