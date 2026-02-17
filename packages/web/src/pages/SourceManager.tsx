import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceApi } from '../services/api';
import toast from 'react-hot-toast';

export default function SourceManager() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'rss',
    config: '{}',
  });

  const queryClient = useQueryClient();

  const { data: sources, isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: sourceApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const config = JSON.parse(formData.config);
      return sourceApi.create(formData.id, formData.name, formData.type, {
        enabled: true,
        ...config,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast.success('Source created!');
      setShowForm(false);
      setFormData({ id: '', name: '', type: 'rss', config: '{}' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create source');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sourceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast.success('Source deleted!');
    },
  });

  const fetchMutation = useMutation({
    mutationFn: sourceApi.fetch,
    onSuccess: (data) => {
      toast.success(`Fetched ${data.fetched} items!`);
    },
    onError: () => {
      toast.error('Failed to fetch content');
    },
  });

  const fetchAllMutation = useMutation({
    mutationFn: sourceApi.fetchAll,
    onSuccess: (data) => {
      const total = data.results.reduce((sum: number, r: any) => sum + (r.fetched || 0), 0);
      toast.success(`Fetched ${total} items from all sources!`);
    },
  });

  const getConfigTemplate = (type: string) => {
    switch (type) {
      case 'rss':
        return JSON.stringify({ feedUrl: 'https://example.com/feed.xml' }, null, 2);
      case 'hackernews':
        return JSON.stringify({ feed: 'top', maxItems: 30 }, null, 2);
      case 'reddit':
        return JSON.stringify({ subreddit: 'programming', sort: 'hot', maxItems: 25 }, null, 2);
      case 'webhook':
        return JSON.stringify({ secret: 'your-secret-key', triggerNotification: true }, null, 2);
      default:
        return '{}';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Source Manager</h2>
        <div className="button-group">
          <button onClick={() => fetchAllMutation.mutate()}>Fetch All</button>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Source'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Source</h3>
          <div className="form-group">
            <label>ID:</label>
            <input
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="unique-id"
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Source"
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              value={formData.type}
              onChange={(e) => {
                const type = e.target.value;
                setFormData({ 
                  ...formData, 
                  type,
                  config: getConfigTemplate(type)
                });
              }}
            >
              <option value="rss">RSS/Atom</option>
              <option value="hackernews">Hacker News</option>
              <option value="reddit">Reddit</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>
          <div className="form-group">
            <label>Configuration (JSON):</label>
            <textarea
              value={formData.config}
              onChange={(e) => setFormData({ ...formData, config: e.target.value })}
              style={{ minHeight: '150px' }}
            />
          </div>
          <button onClick={() => createMutation.mutate()}>Create Source</button>
        </div>
      )}

      {isLoading && <div className="loading">Loading sources...</div>}

      {sources?.map((source) => (
        <div key={source.id} className="card">
          <h3>{source.name}</h3>
          <div className="meta">
            <span>ID: {source.id}</span>
            <span>Type: {source.type}</span>
            <span>Status: {source.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <details style={{ marginTop: '1rem' }}>
            <summary>Configuration</summary>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {JSON.stringify(source.config, null, 2)}
            </pre>
          </details>
          <div className="button-group" style={{ marginTop: '1rem' }}>
            <button onClick={() => fetchMutation.mutate(source.id)}>Fetch Now</button>
            <button onClick={() => deleteMutation.mutate(source.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
