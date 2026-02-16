import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { feedApi, algorithmApi } from '../services/api';

export default function FeedView() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');

  const { data: algorithms } = useQuery({
    queryKey: ['algorithms'],
    queryFn: algorithmApi.getAll,
  });

  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ['feed', selectedAlgorithm],
    queryFn: () => feedApi.getFeed(selectedAlgorithm),
    enabled: !!selectedAlgorithm,
  });

  return (
    <div>
      <h2>Feed View</h2>
      
      <div className="form-group">
        <label>Select Algorithm:</label>
        <select 
          value={selectedAlgorithm} 
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
        >
          <option value="">Choose an algorithm...</option>
          {algorithms?.map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div className="loading">Loading feed...</div>}
      {error && <div className="error">Failed to load feed</div>}

      {feedData && (
        <>
          <div className="card">
            <h3>Feed Stats</h3>
            <p>Total Processed: {feedData.meta.totalProcessed}</p>
            <p>Filtered: {feedData.meta.totalFiltered}</p>
            <p>Execution Time: {feedData.meta.executionTimeMs}ms</p>
            <p>Results: {feedData.items.length} items</p>
          </div>

          <div>
            {feedData.items.map((item) => (
              <div key={item.content.id} className="feed-item">
                <h3>
                  <a href={item.content.url} target="_blank" rel="noopener noreferrer">
                    {item.content.title}
                  </a>
                </h3>
                <div className="meta">
                  <span className="score">Score: {item.score.toFixed(2)}</span>
                  <span>Source: {item.content.source}</span>
                  <span>Type: {item.content.type}</span>
                  <span>{new Date(item.content.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
