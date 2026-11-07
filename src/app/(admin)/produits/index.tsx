import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Eye, EyeOff, Trash2, Edit } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useAppTheme } from '@/hooks/useAppTheme';
import { EmptyState } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { Product } from '@/types';

export default function ProductsListScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { products, loading, refresh, toggleActive, remove } = useProducts();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Articles ({products.length})</Text>
        <TouchableOpacity
          onPress={() => router.push('/(admin)/produits/nouveau')}
          style={[styles.addBtn, { backgroundColor: colors.ACCENT }]}
        >
          <Plus size={18} color={isDark ? '#060501' : '#ffffff'} />
          <Text style={[styles.addBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.ACCENT} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <EmptyState message="Aucun produit enregistré pour le moment." icon="📦" /> : null
        }
        renderItem={({ item }: { item: Product }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.BG_CARD,
                borderColor: colors.BORDER,
                shadowColor: colors.TEXT_PRIMARY,
                shadowOpacity: isDark ? 0 : 0.04,
                elevation: isDark ? 0 : 2,
              },
            ]}
          >
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={[styles.productName, { color: colors.TEXT_PRIMARY }]}>{item.nom}</Text>
                <View
                  style={[
                    styles.badge,
                    item.actif
                      ? { backgroundColor: colors.SUCCESS_BG }
                      : { backgroundColor: colors.MUTED_BG },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.actif ? colors.SUCCESS : colors.TEXT_MUTED },
                    ]}
                  >
                    {item.actif ? 'Actif' : 'Inactif'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.productPrice, { color: colors.ACCENT }]}>{formatPrice(item.prix)}</Text>
              <Text style={[styles.blocksCount, { color: colors.TEXT_MUTED }]}>
                {(item.content_blocks || []).length} bloc(s) de vente
              </Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => toggleActive(item.id, item.actif)}
                style={[styles.actionBtn, { backgroundColor: colors.BG_INPUT }]}
              >
                {item.actif ? (
                  <Eye size={18} color={colors.SUCCESS} />
                ) : (
                  <EyeOff size={18} color={colors.TEXT_MUTED} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                style={[styles.actionBtn, { backgroundColor: colors.BG_INPUT }]}
              >
                <Edit size={18} color={colors.INFO} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => remove(item.id, item.nom)}
                style={[styles.actionBtn, { backgroundColor: colors.DANGER_BG_LIGHT }]}
              >
                <Trash2 size={18} color={colors.DANGER} />
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
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADII.xl,
  },
  addBtnText: {
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },
  list: {
    gap: SPACING.md,
    paddingBottom: 110, // Dégagement barre basse flottante
  },
  card: {
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardInfo: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    flex: 1,
    marginRight: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: RADII.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  productPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginBottom: 2,
  },
  blocksCount: {
    fontSize: FONT_SIZE.xs,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  actionBtn: {
    padding: SPACING.sm,
    borderRadius: RADII.md,
  },
});
