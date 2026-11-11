import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getOrders, updateOrderStatus } from '@/lib/orders';
import type { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = useCallback((order: Order) => {
    const statuses: Order['statut'][] = ['nouveau', 'confirmé', 'en_livraison', 'livré', 'retourné', 'annulé'];
    Alert.alert(
      'Mettre à jour le statut',
      `Modifier l'état de la commande pour ${order.product_nom}`,
      statuses.map((st) => ({
        text: st.toUpperCase().replace('_', ' '),
        onPress: async () => {
          await updateOrderStatus(order.id, st);
          refresh();
        },
      }))
    );
  }, [refresh]);

  return { orders, loading, refresh, changeStatus };
}
