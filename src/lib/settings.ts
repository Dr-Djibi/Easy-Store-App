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

export async function updateSetting(key: string, value: string): Promise<boolean> {
  const { client } = useSupabaseStore.getState();
  if (!client) return false;

  const { error } = await client
    .from('settings')
    .upsert({ key, value });

  return !error;
}
