import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getProducts, toggleProductActive, deleteProduct } from '../../../lib/products';
import { formatPrice } from '../../../lib/utils';
import type { Product } from '../../../types';
import { Plus, Eye, EyeOff, Trash2, Edit } from 'lucide-react-native';

export default function ProductsListScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    await toggleProductActive(id, current);
    load();
  };

  const handleDelete = (id: string, nom: string) => {
    Alert.alert('Supprimer', `Voulez-vous vraiment supprimer "${nom}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Articles ({products.length})</Text>
        <TouchableOpacity
          onPress={() => router.push('/(admin)/produits/nouveau')}
          style={styles.addBtn}
        >
          <Plus size={18} color="#060501" />
          <Text style={styles.addBtnText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#facc15" />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.productName}>{item.nom}</Text>
                <View style={[styles.badge, item.actif ? styles.badgeActive : styles.badgeInactive]}>
                  <Text style={styles.badgeText}>{item.actif ? 'Actif' : 'Inactif'}</Text>
                </View>
              </View>

              <Text style={styles.productPrice}>{formatPrice(item.prix)}</Text>
              <Text style={styles.blocksCount}>
                {(item.content_blocks || []).length} bloc(s) de vente personnalisé(s)
              </Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => handleToggle(item.id, item.actif)}
                style={styles.actionBtn}
              >
                {item.actif ? <Eye size={18} color="#4ade80" /> : <EyeOff size={18} color="#94a3b8" />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                style={styles.actionBtn}
              >
                <Edit size={18} color="#38bdf8" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.nom)}
                style={[styles.actionBtn, styles.deleteBtn]}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060501',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fef9e7',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#facc15',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#060501',
    fontWeight: 'bold',
    fontSize: 13,
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
  cardInfo: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fef9e7',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
  },
  badgeInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fef9e7',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#facc15',
    marginBottom: 4,
  },
  blocksCount: {
    fontSize: 12,
    color: 'rgba(254, 249, 231, 0.65)',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: '#18160a',
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
});
