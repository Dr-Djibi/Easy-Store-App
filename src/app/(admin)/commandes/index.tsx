import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StatusBadge, EmptyState } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { Order } from '@/types';

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} à ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return dateStr;
  }
}

export default function OrdersScreen() {
  const { colors, isDark } = useAppTheme();
  const { orders, loading, refresh, changeStatus } = useOrders();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <View style={styles.headerRowTop}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Commandes Reçues</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.countBadgeText, { color: colors.TEXT_MUTED }]}>{orders.length}</Text>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.ACCENT} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <EmptyState message="Aucune commande enregistrée pour le moment." /> : null
        }
        renderItem={({ item }: { item: Order }) => (
          <TouchableOpacity
            onPress={() => changeStatus(item)}
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
            <View style={styles.headerRow}>
              <Text style={[styles.productName, { color: colors.TEXT_PRIMARY }]}>{item.product_nom}</Text>
              <StatusBadge statut={item.statut} />
            </View>

            <Text style={[styles.amount, { color: colors.ACCENT }]}>
              Quantité : {item.quantite} • Total : {formatPrice(item.montant)}
            </Text>

            <View style={[styles.detailsBox, { backgroundColor: colors.BG_INPUT }]}>
              {Object.entries(item.fields_data || {}).map(([key, val], i) => (
                <Text key={i} style={[styles.detailText, { color: colors.TEXT_MUTED }]}>
                  • {key} : <Text style={[styles.detailVal, { color: colors.TEXT_PRIMARY }]}>{String(val)}</Text>
                </Text>
              ))}
            </View>

            <Text style={[styles.date, { color: colors.TEXT_FAINT }]}>
              {formatDate(item.created_at)}
            </Text>
          </TouchableOpacity>
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
  headerRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.full,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  list: {
    gap: SPACING.md,
    paddingBottom: 110,
  },
  card: {
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  productName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    flex: 1,
    marginRight: SPACING.sm,
  },
  amount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  detailsBox: {
    borderRadius: RADII.lg,
    padding: SPACING.sm + 2,
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
  },
  detailVal: {
    fontWeight: '700',
  },
  date: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
    textAlign: 'right',
  },
});
