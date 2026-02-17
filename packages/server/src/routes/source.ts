import type { FastifyInstance } from 'fastify';
import { SourceService } from '../services/source.js';
import { ContentService } from '../services/content.js';
import type { ConnectorConfig } from '@feed-platform/core';

export async function sourceRoutes(fastify: FastifyInstance) {
  const service = new SourceService();
  const contentService = new ContentService();

  // Initialize sources from database
  await service.getAll();

  // Get all sources
  fastify.get('/sources', async (request, reply) => {
    try {
      const sources = await service.getAll();
      return { sources };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get source by ID
  fastify.get('/sources/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const source = await service.getById(id);
      if (!source) {
        return reply.code(404).send({ error: 'Source not found' });
      }
      return source;
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Create source
  fastify.post('/sources', async (request, reply) => {
    const { id, name, type, config } = request.body as {
      id: string;
      name: string;
      type: string;
      config: ConnectorConfig;
    };

    try {
      await service.create(id, name, type, config);
      return { id, name, type, config };
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Update source
  fastify.put('/sources/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, config } = request.body as { name: string; config: ConnectorConfig };

    try {
      await service.update(id, name, config);
      return { id, name, config };
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Delete source
  fastify.delete('/sources/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.delete(id);
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Fetch content from source
  fastify.post('/sources/:id/fetch', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const connector = service.getConnector(id);
      if (!connector) {
        return reply.code(404).send({ error: 'Source not found' });
      }

      const items = await connector.fetch();
      await contentService.store(items);
      await service.updateLastFetch(id);

      return { fetched: items.length, items };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Fetch all sources
  fastify.post('/sources/fetch-all', async (request, reply) => {
    try {
      const connectors = service.getAllConnectors();
      const results = [];

      for (const connector of connectors) {
        if (connector.config.enabled !== false) {
          try {
            const items = await connector.fetch();
            await contentService.store(items);
            await service.updateLastFetch(connector.id);
            results.push({ id: connector.id, fetched: items.length });
          } catch (error: any) {
            results.push({ id: connector.id, error: error.message });
          }
        }
      }

      return { results };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });
}
