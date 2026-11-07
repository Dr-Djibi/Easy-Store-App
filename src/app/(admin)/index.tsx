import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Package, ShoppingBag, DollarSign } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { StatCard } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { COLORS, SPACING, FONT_SIZE } from '@/constants/theme';

export default function DashboardScreen() {
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
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.ACCENT} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Tableau de bord 📊</Text>
        <Text style={styles.subtitle}>Aperçu en temps réel de votre activité.</Text>
      </View>

      <View style={styles.grid}>
        <StatCard
          icon={<Package color={COLORS.ACCENT} size={24} />}
          value={products.length}
          label="Produits enregistrés"
        />
        <StatCard
          icon={<ShoppingBag color={COLORS.INFO} size={24} />}
          value={orders.length}
          label="Commandes reçues"
        />
        <StatCard
          icon={<DollarSign color={COLORS.SUCCESS} size={24} />}
          value={formatPrice(totalRevenue)}
          label="Chiffre d'affaires estimé"
          style={styles.fullWidth}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    backgroundColor: COLORS.BG_PRIMARY,
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  welcome: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_MUTED,
    marginTop: SPACING.xs,
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
