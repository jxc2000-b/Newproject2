import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getAll,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </h2>
        <button onClick={() => markAllAsReadMutation.mutate()}>
          Mark All as Read
        </button>
      </div>

      {isLoading && <div className="loading">Loading notifications...</div>}

      {notifications && notifications.length === 0 && (
        <div className="card">
          <p>No notifications</p>
        </div>
      )}

      {notifications?.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.priority} ${notification.read ? 'read' : ''}`}
          style={{ opacity: notification.read ? 0.6 : 1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{notification.title}</h4>
              <p style={{ margin: '0 0 0.5rem 0' }}>{notification.message}</p>
              <div className="meta">
                <span>Priority: {notification.priority}</span>
                <span>{new Date(notification.timestamp).toLocaleString()}</span>
                {notification.source && <span>Source: {notification.source}</span>}
              </div>
              {notification.url && (
                <a
                  href={notification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '0.5rem', display: 'inline-block' }}
                >
                  View Details →
                </a>
              )}
            </div>
            <div className="button-group" style={{ marginLeft: '1rem' }}>
              {!notification.read && (
                <button onClick={() => markAsReadMutation.mutate(notification.id)}>
                  Mark Read
                </button>
              )}
              <button onClick={() => deleteMutation.mutate(notification.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
