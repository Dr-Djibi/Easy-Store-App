import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Package, ShoppingBag, DollarSign } from 'lucide-react-native';
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
        <Text style={[styles.welcome, { color: colors.TEXT_PRIMARY }]}>Tableau de bord 📊</Text>
        <Text style={[styles.subtitle, { color: colors.TEXT_MUTED }]}>
          Aperçu instantané des performances de votre boutique.
        </Text>
      </View>

      <View style={styles.grid}>
        <StatCard
          icon={<Package color={colors.ACCENT} size={24} />}
          value={products.length}
          label="Articles au catalogue"
        />
        <StatCard
          icon={<ShoppingBag color={colors.INFO} size={24} />}
          value={orders.length}
          label="Commandes enregistrées"
        />
        <StatCard
          icon={<DollarSign color={colors.SUCCESS} size={24} />}
          value={formatPrice(totalRevenue)}
          label="Chiffre d'affaires estimé"
          style={styles.fullWidth}
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
    paddingBottom: 110, // Dégagement barre basse flottante
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
