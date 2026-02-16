/**
 * Notification types
 */
export interface Notification {
  /** Unique identifier */
  id: string;
  
  /** Notification title */
  title: string;
  
  /** Notification message */
  message: string;
  
  /** When it was created */
  timestamp: Date;
  
  /** Read status */
  read: boolean;
  
  /** Priority level */
  priority: 'low' | 'medium' | 'high';
  
  /** Optional link */
  url?: string;
  
  /** Source that triggered this notification */
  source?: string;
  
  /** Additional metadata */
  meta?: Record<string, any>;
}

/**
 * Serialized notification (dates as ISO strings)
 */
export interface SerializedNotification extends Omit<Notification, 'timestamp'> {
  timestamp: string;
}
