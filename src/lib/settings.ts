import { useSupabaseStore } from '../store/supabaseStore';
import type { StoreSettings } from '../types';

export async function getAllSettings(): Promise<Partial<StoreSettings>> {
  const { client } = useSupabaseStore.getState();
  if (!client) return {};

  const { data, error } = await client.from('settings').select('key, value');
  if (error || !data) return {};

  const map: Record<string, any> = {};
  for (const item of data) {
    if (item.key === 'ORDER_FIELDS') {
      try {
        map[item.key] = JSON.parse(item.value);
      } catch {
        map[item.key] = [];
      }
    } else {
      map[item.key] = item.value;
    }
  }
  return map;
}

export async function updateSetting(key: string, value: string): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  const { error } = await client
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
