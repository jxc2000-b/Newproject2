import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { algorithmApi } from '../services/api';
import toast from 'react-hot-toast';

const DEFAULT_YAML = `version: "0.1.0"
name: "My Algorithm"
description: "Custom feed algorithm"

filters:
  - type: contentType
    mode: include
    values:
      - article

sort:
  type: score
  direction: desc

limit:
  maxItems: 20
`;

export default function AlgorithmEditor() {
  const [yaml, setYaml] = useState(DEFAULT_YAML);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: algorithms, isLoading } = useQuery({
    queryKey: ['algorithms'],
    queryFn: algorithmApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: algorithmApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algorithms'] });
      toast.success('Algorithm created!');
      setYaml(DEFAULT_YAML);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create algorithm');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, yaml }: { id: string; yaml: string }) =>
      algorithmApi.update(id, yaml),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algorithms'] });
      toast.success('Algorithm updated!');
      setEditingId(null);
      setYaml(DEFAULT_YAML);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update algorithm');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: algorithmApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algorithms'] });
      toast.success('Algorithm deleted!');
    },
  });

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, yaml });
    } else {
      createMutation.mutate(yaml);
    }
  };

  const handleEdit = async (id: string) => {
    const { yaml: algorithmYaml } = await algorithmApi.getById(id);
    setYaml(algorithmYaml);
    setEditingId(id);
  };

  return (
    <div>
      <h2>Algorithm Editor</h2>

      <div className="card">
        <h3>{editingId ? 'Edit Algorithm' : 'Create New Algorithm'}</h3>
        <div className="form-group">
          <label>YAML Configuration:</label>
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            placeholder="Enter YAML configuration..."
          />
        </div>
        <div className="button-group">
          <button onClick={handleSave}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button onClick={() => {
              setEditingId(null);
              setYaml(DEFAULT_YAML);
            }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <h3>Saved Algorithms</h3>
      {isLoading && <div className="loading">Loading algorithms...</div>}
      
      {algorithms?.map((algo) => (
        <div key={algo.id} className="card">
          <h3>{algo.name}</h3>
          <p>{algo.description}</p>
          <div className="meta">
            <span>Tags: {algo.tags.join(', ')}</span>
          </div>
          <div className="button-group" style={{ marginTop: '1rem' }}>
            <button onClick={() => handleEdit(algo.id)}>Edit</button>
            <button onClick={() => deleteMutation.mutate(algo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
