import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getProducts } from '../../lib/products';
import { getOrders } from '../../lib/orders';
import { formatPrice } from '../../lib/utils';
import { Package, ShoppingBag, DollarSign } from 'lucide-react-native';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([getProducts(), getOrders()]);
      setProductCount(prods.length);
      setOrderCount(ords.length);
      const rev = ords.reduce((acc, curr) => acc + (Number(curr.montant) || 0), 0);
      setTotalRevenue(rev);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#facc15" />}
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Tableau de bord 📊</Text>
        <Text style={styles.subtitle}>Aperçu en temps réel de votre activité.</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Package color="#facc15" size={24} />
          <Text style={styles.statNumber}>{productCount}</Text>
          <Text style={styles.statLabel}>Produits enregistrés</Text>
        </View>

        <View style={styles.statCard}>
          <ShoppingBag color="#38bdf8" size={24} />
          <Text style={styles.statNumber}>{orderCount}</Text>
          <Text style={styles.statLabel}>Commandes reçues</Text>
        </View>

        <View style={[styles.statCard, styles.fullWidth]}>
          <DollarSign color="#4ade80" size={24} />
          <Text style={styles.statNumber}>{formatPrice(totalRevenue)}</Text>
          <Text style={styles.statLabel}>Chiffre d'affaires estimé</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#060501',
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fef9e7',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(254, 249, 231, 0.65)',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'center',
  },
  fullWidth: {
    minWidth: '100%',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fef9e7',
    marginTop: 10,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(254, 249, 231, 0.65)',
  },
});
