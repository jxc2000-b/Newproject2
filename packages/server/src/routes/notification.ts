import type { FastifyInstance } from 'fastify';
import { NotificationService } from '../services/notification.js';
import { SourceService } from '../services/source.js';
import { ContentService } from '../services/content.js';
import { WebhookConnector } from '@feed-platform/connectors';

export async function notificationRoutes(fastify: FastifyInstance) {
  const service = new NotificationService();
  const sourceService = new SourceService();
  const contentService = new ContentService();

  // Get all notifications
  fastify.get('/notifications', async (request, reply) => {
    try {
      const notifications = await service.getAll();
      return { notifications };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get unread notifications
  fastify.get('/notifications/unread', async (request, reply) => {
    try {
      const notifications = await service.getUnread();
      return { notifications };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Mark notification as read
  fastify.post('/notifications/:id/read', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.markAsRead(id);
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Mark all as read
  fastify.post('/notifications/read-all', async (request, reply) => {
    try {
      await service.markAllAsRead();
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Delete notification
  fastify.delete('/notifications/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.delete(id);
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Webhook endpoint
  fastify.post('/webhook/:sourceId', async (request, reply) => {
    const { sourceId } = request.params as { sourceId: string };
    const payload = request.body;

    try {
      const connector = sourceService.getConnector(sourceId);
      
      if (!connector || connector.type !== 'webhook') {
        return reply.code(404).send({ error: 'Webhook source not found' });
      }

      const webhookConnector = connector as WebhookConnector;
      const item = await webhookConnector.processWebhook(payload);

      // Store as content item
      await contentService.store([item]);

      // Create notification if configured
      if (item.meta.triggerNotification) {
        await service.create(
          item.title,
          item.meta.message || 'New webhook notification',
          item.meta.priority || 'medium',
          item.url,
          sourceId,
          item.meta
        );
      }

      return { success: true, item };
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });
}
