import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Package, ShoppingBag, DollarSign, TrendingUp, RotateCcw } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StatCard } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { SPACING, FONT_SIZE } from '@/constants/theme';

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const { products, loading: loadingP, refresh: refreshP } = useProducts();
  const { orders, loading: loadingO, refresh: refreshO } = useOrders();

  const loading = loadingP || loadingO;
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.montant) || 0), 0);

  // Map des coûts d'achat par id produit
  const productCostMap = new Map<string, number>();
  products.forEach((p) => {
    if (p.cout_achat) productCostMap.set(p.id, Number(p.cout_achat));
  });

  // Marge brute estimée
  const totalMargin = orders.reduce((acc, o) => {
    const cost = o.product_id ? productCostMap.get(o.product_id) : 0;
    const totalCost = (cost || 0) * (o.quantite || 1);
    return acc + (Number(o.montant) || 0) - totalCost;
  }, 0);

  // Calcul du taux de retour
  const returnedCount = orders.filter((o) => o.statut === 'retourné').length;
  const deliveredOrReturnedCount = orders.filter(
    (o) => o.statut === 'livré' || o.statut === 'retourné'
  ).length;
  const returnRate =
    deliveredOrReturnedCount > 0
      ? Math.round((returnedCount / deliveredOrReturnedCount) * 100)
      : 0;

  useEffect(() => {
    refreshP();
    refreshO();
  }, []);

  const handleRefresh = () => {
    refreshP();
    refreshO();
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.BG_PRIMARY }]}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={colors.ACCENT} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.welcome, { color: colors.TEXT_PRIMARY }]}>Tableau de bord</Text>
        <Text style={[styles.subtitle, { color: colors.TEXT_MUTED }]}>
          Aperçu instantané des performances de votre boutique.
        </Text>
      </View>

      <View style={styles.grid}>
        <StatCard
          icon={<Package color={colors.ACCENT} size={22} />}
          value={products.length}
          label="Articles au catalogue"
        />
        <StatCard
          icon={<ShoppingBag color={colors.INFO} size={22} />}
          value={orders.length}
          label="Commandes reçues"
        />
        <StatCard
          icon={<DollarSign color={colors.SUCCESS} size={22} />}
          value={formatPrice(totalRevenue)}
          label="Chiffre d'affaires brut"
          style={styles.fullWidth}
        />
        <StatCard
          icon={<TrendingUp color={colors.SUCCESS} size={22} />}
          value={formatPrice(totalMargin)}
          label="Marge brute estimée"
        />
        <StatCard
          icon={
            <RotateCcw
              color={returnRate > 30 ? colors.DANGER : returnRate > 15 ? '#f97316' : colors.SUCCESS}
              size={22}
            />
          }
          value={`${returnRate}% - ${returnedCount} retour`}
          label="Taux de retour colis"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  welcome: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  fullWidth: {
    minWidth: '100%',
  },
});
