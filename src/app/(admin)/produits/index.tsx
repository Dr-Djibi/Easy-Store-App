import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Eye, EyeOff, Trash2, Edit } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { EmptyState } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { COLORS, SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { Product } from '@/types';

export default function ProductsListScreen() {
  const router = useRouter();
  const { products, loading, refresh, toggleActive, remove } = useProducts();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Articles ({products.length})</Text>
        <TouchableOpacity
          onPress={() => router.push('/(admin)/produits/nouveau')}
          style={styles.addBtn}
        >
          <Plus size={18} color={COLORS.BG_PRIMARY} />
          <Text style={styles.addBtnText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.ACCENT} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <EmptyState message="Aucun produit enregistré." icon="📦" /> : null
        }
        renderItem={({ item }: { item: Product }) => (
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
              <TouchableOpacity onPress={() => toggleActive(item.id, item.actif)} style={styles.actionBtn}>
                {item.actif
                  ? <Eye size={18} color={COLORS.SUCCESS} />
                  : <EyeOff size={18} color="#94a3b8" />
                }
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                style={styles.actionBtn}
              >
                <Edit size={18} color={COLORS.INFO} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => remove(item.id, item.nom)}
                style={[styles.actionBtn, styles.deleteBtn]}
              >
                <Trash2 size={18} color={COLORS.DANGER} />
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
    backgroundColor: COLORS.BG_PRIMARY,
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 14,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADII.xl,
  },
  addBtnText: {
    color: COLORS.BG_PRIMARY,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.sm,
  },
  list: {
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
  },
  cardInfo: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.sm,
  },
  badgeActive: {
    backgroundColor: COLORS.SUCCESS_BG,
  },
  badgeInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  productPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    marginBottom: SPACING.xs,
  },
  blocksCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.TEXT_MUTED,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  actionBtn: {
    padding: SPACING.sm,
    borderRadius: RADII.md,
    backgroundColor: COLORS.BG_INPUT,
  },
  deleteBtn: {
    backgroundColor: COLORS.DANGER_BG_LIGHT,
  },
});
