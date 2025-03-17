import { supabase } from '@/lib/supabase';

export async function validateApiKey(key) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('value', key)
      .eq('active', true)
      .single();

    if (error) throw error;

    // Check if the key exists and is active
    if (!data) {
      return { isValid: false, message: 'Invalid API Key' };
    }

    // Check if the key has reached its usage limit
    if (data.usage_limit !== null && data.usage >= data.usage_limit) {
      return { isValid: false, message: 'API Key has reached its usage limit' };
    }

    // Increment the usage counter
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: data.usage + 1 })
      .eq('id', data.id);

    if (updateError) throw updateError;

    return { isValid: true, message: 'Valid API Key' };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { isValid: false, message: 'Error validating API Key' };
  }
} 