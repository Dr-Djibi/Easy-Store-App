import { useSupabaseStore } from '../store/supabaseStore';
import type { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { client } = useSupabaseStore.getState();
  if (!client) return [];

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur getProducts:', error);
    return [];
  }
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { client } = useSupabaseStore.getState();
  if (!client) return null;

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function createProduct(product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  const { error } = await client.from('products').insert(product);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  const { error } = await client.from('products').update(product).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  const { error } = await client.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleProductActive(id: string, current: boolean): Promise<boolean> {
  const { client } = useSupabaseStore.getState();
  if (!client) return false;

  const { error } = await client.from('products').update({ actif: !current }).eq('id', id);
  return !error;
}
