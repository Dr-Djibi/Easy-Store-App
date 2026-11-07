import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { getOrders, updateOrderStatus } from '../../../lib/orders';
import { formatPrice } from '../../../lib/utils';
import type { Order } from '../../../types';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChangeStatus = (order: Order) => {
    const statuses: Order['statut'][] = ['nouveau', 'confirmé', 'livré', 'annulé'];
    Alert.alert(
      'Mettre à jour le statut',
      `Modifier l'état de la commande pour ${order.product_nom}`,
      statuses.map((st) => ({
        text: st.toUpperCase(),
        onPress: async () => {
          await updateOrderStatus(order.id, st);
          load();
        },
      }))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commandes Reçues ({orders.length})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#facc15" />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChangeStatus(item)} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.productName}>{item.product_nom}</Text>
              <View style={[styles.badge, getBadgeStyle(item.statut)]}>
                <Text style={styles.badgeText}>{item.statut.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.amount}>
              Quantité : {item.quantite} • Total : {formatPrice(item.montant)}
            </Text>

            <View style={styles.detailsBox}>
              {Object.entries(item.fields_data || {}).map(([key, val], i) => (
                <Text key={i} style={styles.detailText}>
                  • {key} : <Text style={styles.detailVal}>{String(val)}</Text>
                </Text>
              ))}
            </View>

            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleString('fr-FR')}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function getBadgeStyle(statut: string) {
  switch (statut) {
    case 'confirmé':
      return { backgroundColor: 'rgba(56, 189, 248, 0.2)' };
    case 'livré':
      return { backgroundColor: 'rgba(74, 222, 128, 0.2)' };
    case 'annulé':
      return { backgroundColor: 'rgba(239, 68, 68, 0.2)' };
    default:
      return { backgroundColor: 'rgba(250, 204, 21, 0.2)' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060501',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fef9e7',
    marginBottom: 20,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fef9e7',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fef9e7',
  },
  amount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: '#18160a',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: 'rgba(254, 249, 231, 0.65)',
  },
  detailVal: {
    color: '#fef9e7',
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    color: 'rgba(254, 249, 231, 0.4)',
    marginTop: 8,
    textAlign: 'right',
  },
});
