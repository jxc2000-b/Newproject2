import { useQuery } from '@tanstack/react-query';
import { marketplaceApi, algorithmApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Marketplace() {
  const { data: algorithms, isLoading } = useQuery({
    queryKey: ['marketplace'],
    queryFn: marketplaceApi.getAll,
  });

  const handleInstall = async (id: string, name: string) => {
    try {
      const { config } = await marketplaceApi.install(id);
      
      // Convert config to YAML string (simple stringify for POC)
      const yamlString = `version: "${config.version}"
name: "${name} (Installed)"
description: "${config.description}"
${config.filters ? `filters:\n${JSON.stringify(config.filters, null, 2)}` : ''}
${config.boosters ? `boosters:\n${JSON.stringify(config.boosters, null, 2)}` : ''}
${config.sort ? `sort:\n  type: ${config.sort.type}\n  direction: ${config.sort.direction}` : ''}
${config.limit ? `limit:\n  maxItems: ${config.limit.maxItems}` : ''}`;
      
      await algorithmApi.create(yamlString);
      toast.success('Algorithm installed!');
    } catch (error) {
      toast.error('Failed to install algorithm');
    }
  };

  return (
    <div>
      <h2>Algorithm Marketplace</h2>
      <p>Browse and install community algorithms</p>

      {isLoading && <div className="loading">Loading marketplace...</div>}

      {algorithms && algorithms.length === 0 && (
        <div className="card">
          <p>No algorithms in marketplace yet. Add some seed data to get started!</p>
        </div>
      )}

      {algorithms?.map((algo: any) => (
        <div key={algo.id} className="card">
          <h3>{algo.name}</h3>
          <p>{algo.description}</p>
          <div className="meta">
            {algo.author && <span>By: {algo.author}</span>}
            {algo.tags && <span>Tags: {algo.tags.join(', ')}</span>}
            <span>Downloads: {algo.downloads || 0}</span>
            <span>Rating: {algo.rating || 0}/5</span>
          </div>
          <button
            style={{ marginTop: '1rem' }}
            onClick={() => handleInstall(algo.id, algo.name)}
          >
            Install
          </button>
        </div>
      ))}
    </div>
  );
}
