import type { FastifyInstance } from 'fastify';
import { AlgorithmService } from '../services/algorithm.js';
import { parseAlgorithmConfig, serializeAlgorithmConfig, validateAlgorithmConfig } from '@feed-platform/core';

export async function algorithmRoutes(fastify: FastifyInstance) {
  const service = new AlgorithmService();

  // Get all algorithms
  fastify.get('/algorithms', async (request, reply) => {
    try {
      const algorithms = await service.getAll();
      return { algorithms };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get algorithm by ID
  fastify.get('/algorithms/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const config = await service.getById(id);
      if (!config) {
        return reply.code(404).send({ error: 'Algorithm not found' });
      }

      // Return both JSON and YAML formats
      return {
        config,
        yaml: serializeAlgorithmConfig(config)
      };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Create algorithm
  fastify.post('/algorithms', async (request, reply) => {
    const { yaml } = request.body as { yaml: string };

    try {
      const config = parseAlgorithmConfig(yaml);
      const validation = validateAlgorithmConfig(config);
      
      if (validation !== true) {
        return reply.code(400).send({ error: validation });
      }

      const id = await service.create(config);
      return { id, config };
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Update algorithm
  fastify.put('/algorithms/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { yaml } = request.body as { yaml: string };

    try {
      const config = parseAlgorithmConfig(yaml);
      const validation = validateAlgorithmConfig(config);
      
      if (validation !== true) {
        return reply.code(400).send({ error: validation });
      }

      await service.update(id, config);
      return { id, config };
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Delete algorithm
  fastify.delete('/algorithms/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.delete(id);
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });
}
