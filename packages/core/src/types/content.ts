/**
 * Universal Content Envelope - the core content format
 * Intentionally loose/vague for maximum compatibility
 */
export interface ContentItem {
  /** Unique identifier */
  id: string;

  /** Where it came from (connector identifier) */
  source: string;

  /** Link to original content */
  url: string;

  /** Display title */
  title: string;

  /** When it was created/published */
  timestamp: Date;

  /** Content type */
  type: 'article' | 'image' | 'video' | 'notification' | 'event';

  /** Freeform metadata - sources can add whatever they want */
  meta: Record<string, any>;
}

/**
 * Content type for type checking
 */
export type ContentType = ContentItem['type'];

/**
 * Normalized content item for storage/transport (dates as ISO strings)
 */
export interface SerializedContentItem extends Omit<ContentItem, 'timestamp'> {
  timestamp: string;
}
