import { useSupabaseStore } from '../store/supabaseStore';
import type { Order } from '../types';

export async function getOrders(): Promise<Order[]> {
  const { client } = useSupabaseStore.getState();
  if (!client) return [];

  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur getOrders:', error);
    return [];
  }
  return data as Order[];
}

export async function updateOrderStatus(id: string, statut: Order['statut']): Promise<boolean> {
  const { client } = useSupabaseStore.getState();
  if (!client) return false;

  const { error } = await client
    .from('orders')
    .update({ statut })
    .eq('id', id);

  return !error;
}
