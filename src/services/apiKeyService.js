import { supabase } from '@/lib/supabase';

export const apiKeyService = {
  async fetchApiKeys() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createApiKey({ name, type, value, usage_limit }) {
    try {
      // Validate required fields
      if (!name || !type || !value) {
        throw new Error('Name, type, and value are required fields');
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name,
            type,
            value,
            usage: 0,
            usage_limit: usage_limit ? parseInt(usage_limit) : null,
            active: true,
            created_at: new Date().toISOString() // Explicitly set created_at
          }
        ])
        .select('*') // Make sure to return all fields
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Create API key error:', error);
      return { data: null, error };
    }
  },

  async updateApiKey(id, updates) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteApiKey(id) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}; 