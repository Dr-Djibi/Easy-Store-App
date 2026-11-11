import { useSupabaseStore } from '../store/supabaseStore';
import type { Product, ProductStatus } from '../types';

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
  return (data as Product[]).map((p) => ({
    ...p,
    statut: p.statut || (p.actif ? 'actif' : 'brouillon'),
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const { client } = useSupabaseStore.getState();
  if (!client) return null;

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  const p = data as Product;
  return {
    ...p,
    statut: p.statut || (p.actif ? 'actif' : 'brouillon'),
  };
}

export async function createProduct(product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  // Synchronisation cohérente statut et actif
  const payload: Partial<Product> = {
    ...product,
    actif: product.statut ? product.statut === 'actif' : (product.actif ?? true),
    statut: product.statut || (product.actif === false ? 'brouillon' : 'actif'),
  };

  const { error } = await client.from('products').insert(payload);
  if (error) {
    // Si des colonnes étendues ne sont pas encore présentes dans Supabase, tenter une insertion minimale sécurisée
    if (error.message && error.message.includes('column')) {
      const basicPayload = {
        nom: payload.nom,
        slug: payload.slug,
        prix: payload.prix,
        cout_achat: payload.cout_achat,
        stock: payload.stock,
        description: payload.description,
        images: payload.images,
        content_blocks: payload.content_blocks,
        actif: payload.actif,
      };
      const { error: fallbackError } = await client.from('products').insert(basicPayload);
      if (fallbackError) return { success: false, error: fallbackError.message };
      return { success: true };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) return { success: false, error: 'Supabase non configuré' };

  const payload: Partial<Product> = {
    ...product,
    ...(product.statut !== undefined ? { actif: product.statut === 'actif' } : {}),
    ...(product.actif !== undefined && !product.statut ? { statut: product.actif ? 'actif' : 'brouillon' } : {}),
  };

  const { error } = await client.from('products').update(payload).eq('id', id);
  if (error) {
    if (error.message && error.message.includes('column')) {
      const basicPayload = {
        nom: payload.nom,
        slug: payload.slug,
        prix: payload.prix,
        cout_achat: payload.cout_achat,
        stock: payload.stock,
        description: payload.description,
        images: payload.images,
        content_blocks: payload.content_blocks,
        actif: payload.actif,
      };
      const { error: fallbackError } = await client.from('products').update(basicPayload).eq('id', id);
      if (fallbackError) return { success: false, error: fallbackError.message };
      return { success: true };
    }
    return { success: false, error: error.message };
  }
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

  const nextActive = !current;
  const nextStatut: ProductStatus = nextActive ? 'actif' : 'brouillon';
  const { error } = await client
    .from('products')
    .update({ actif: nextActive, statut: nextStatut })
    .eq('id', id);

  if (error && error.message && error.message.includes('statut')) {
    const { error: fallbackError } = await client
      .from('products')
      .update({ actif: nextActive })
      .eq('id', id);
    return !fallbackError;
  }
  return !error;
}
