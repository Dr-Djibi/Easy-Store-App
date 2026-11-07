import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  getProducts,
  deleteProduct,
  toggleProductActive,
} from '@/lib/products';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await toggleProductActive(id, current);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string, nom: string) => {
    Alert.alert('Supprimer', `Voulez-vous vraiment supprimer "${nom}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          refresh();
        },
      },
    ]);
  }, [refresh]);

  return { products, loading, refresh, toggleActive, remove };
}
