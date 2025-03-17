import { useState, useEffect } from 'react';
import { apiKeyService } from '@/services/apiKeyService';
import { toast } from 'react-hot-toast';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    const { data, error } = await apiKeyService.fetchApiKeys();
    if (error) {
      setError(error.message);
      toast.error('Failed to load API keys');
    } else {
      setApiKeys(data);
      setError(null);
    }
    setLoading(false);
  };

  const createApiKey = async (keyData) => {
    const { data, error } = await apiKeyService.createApiKey(keyData);
    if (error) {
      setError(error.message);
      toast.error('Failed to create API key');
      return false;
    }
    setApiKeys(prev => [data, ...prev]);
    toast.success('API key created successfully');
    return true;
  };

  const updateApiKey = async (id, updates) => {
    const { data, error } = await apiKeyService.updateApiKey(id, updates);
    if (error) {
      setError(error.message);
      toast.error('Failed to update API key');
      return false;
    }
    setApiKeys(prev => prev.map(key => key.id === id ? data : key));
    toast.success('API key updated successfully');
    return true;
  };

  const deleteApiKey = async (id) => {
    const { error } = await apiKeyService.deleteApiKey(id);
    if (error) {
      setError(error.message);
      toast.error('Failed to delete API key');
      return false;
    }
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success('API key deleted successfully', {
      style: {
        background: '#dc2626',
        color: '#fff',
        fontWeight: 500,
      },
    });
    return true;
  };

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    refreshApiKeys: fetchApiKeys,
  };
} 