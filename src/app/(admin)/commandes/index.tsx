import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { StatusBadge, EmptyState } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { COLORS, SPACING, RADII, FONT_SIZE } from '@/constants/theme';
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
  const { orders, loading, refresh, changeStatus } = useOrders();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commandes Reçues ({orders.length})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.ACCENT} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <EmptyState message="Aucune commande reçue pour le moment." icon="🛒" /> : null
        }
        renderItem={({ item }: { item: Order }) => (
          <TouchableOpacity onPress={() => changeStatus(item)} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.productName}>{item.product_nom}</Text>
              <StatusBadge statut={item.statut} />
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
    backgroundColor: COLORS.BG_PRIMARY,
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xl,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  productName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: SPACING.sm,
  },
  amount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    marginBottom: SPACING.sm + 2,
  },
  detailsBox: {
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: RADII.lg,
    padding: SPACING.sm + 2,
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_MUTED,
  },
  detailVal: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.TEXT_FAINT,
    marginTop: SPACING.sm,
    textAlign: 'right',
  },
});
