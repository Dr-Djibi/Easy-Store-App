import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Share,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  Search,
  Package,
  Eye,
  EyeOff,
  Share2,
  Edit3,
  Trash2,
  X,
} from 'lucide-react-native';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter((p) => p.nom.toLowerCase().includes(query));
  }, [products, searchQuery]);

  const handleShareProduct = async (item: Product) => {
    try {
      await Share.share({
        message: `Découvrez "${item.nom}" au prix de ${formatPrice(item.prix)}.`,
        title: item.nom,
      });
    } catch {
      // Ignorer si annulé
    }
  };

  const handleConfirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Supprimer le produit',
      `Êtes-vous sûr de vouloir supprimer "${name}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => remove(id, name),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      {/* HEADER POLARIS ÉPURÉ */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Produits</Text>
          <Text style={[styles.subtitle, { color: colors.TEXT_MUTED }]}>
            {products.length} {products.length > 1 ? 'articles au catalogue' : 'article au catalogue'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(admin)/produits/nouveau')}
          style={[styles.primaryBtn, { backgroundColor: colors.ACCENT }]}
          activeOpacity={0.8}
        >
          <Plus size={16} color={isDark ? '#060501' : '#ffffff'} strokeWidth={2.5} />
          <Text style={[styles.primaryBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
            Ajouter un produit
          </Text>
        </TouchableOpacity>
      </View>

      {/* BARRE DE RECHERCHE MINIMALISTE */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.BG_CARD,
            borderColor: colors.BORDER,
          },
        ]}
      >
        <Search size={18} color={colors.TEXT_MUTED} />
        <TextInput
          placeholder="Rechercher par nom..."
          placeholderTextColor={colors.TEXT_FAINT}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: colors.TEXT_PRIMARY }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color={colors.TEXT_MUTED} />
          </TouchableOpacity>
        )}
      </View>

      {/* LISTE DES PRODUITS POLARIS */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.ACCENT} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              message={
                searchQuery
                  ? `Aucun produit ne correspond à "${searchQuery}"`
                  : 'Vous n’avez aucun produit en vente pour l’instant.'
              }
              icon="📦"
            />
          ) : null
        }
        renderItem={({ item }: { item: Product }) => {
          const mainImage = item.images && item.images.length > 0 ? item.images[0] : null;

          return (
            <View
              style={[
                styles.productCard,
                {
                  backgroundColor: colors.BG_CARD,
                  borderColor: colors.BORDER,
                  shadowColor: colors.TEXT_PRIMARY,
                  shadowOpacity: isDark ? 0 : 0.03,
                  elevation: isDark ? 0 : 1,
                },
              ]}
            >
              {/* VIGNETTE PRODUIT & INFOS */}
              <TouchableOpacity
                onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                style={styles.cardMainTouchable}
                activeOpacity={0.7}
              >
                <View style={[styles.thumbnailWrap, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
                  {mainImage ? (
                    <Image source={{ uri: mainImage }} style={styles.thumbnail} resizeMode="cover" />
                  ) : (
                    <Package size={22} color={colors.TEXT_MUTED} />
                  )}
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.productName, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
                      {item.nom}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: item.actif ? colors.SUCCESS_BG : colors.MUTED_BG,
                          borderColor: item.actif ? colors.SUCCESS : colors.BORDER,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: item.actif ? colors.SUCCESS : colors.TEXT_MUTED },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: item.actif ? colors.SUCCESS : colors.TEXT_MUTED },
                        ]}
                      >
                        {item.actif ? 'Actif' : 'Brouillon'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={[styles.productPrice, { color: colors.TEXT_PRIMARY }]}>
                      {formatPrice(item.prix)}
                    </Text>
                    <Text style={[styles.metaDot, { color: colors.TEXT_FAINT }]}>•</Text>
                    <Text
                      style={[
                        styles.stockText,
                        {
                          color:
                            item.stock === 0
                              ? colors.DANGER
                              : item.stock <= 3
                              ? colors.INFO
                              : colors.TEXT_MUTED,
                        },
                      ]}
                    >
                      {item.stock > 0 ? `${item.stock} en stock` : 'Rupture'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* BARRE D'ACTIONS SECONDAIRES SOBRES */}
              <View style={[styles.cardFooter, { borderTopColor: colors.BORDER_FAINT }]}>
                <TouchableOpacity
                  onPress={() => handleShareProduct(item)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Share2 size={15} color={colors.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleActive(item.id, item.actif)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  {item.actif ? (
                    <Eye size={15} color={colors.SUCCESS} />
                  ) : (
                    <EyeOff size={15} color={colors.TEXT_MUTED} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Edit3 size={15} color={colors.INFO} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleConfirmDelete(item.id, item.nom)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.DANGER_BG_LIGHT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Trash2 size={15} color={colors.DANGER} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: RADII.xl,
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.md,
    height: 46,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginLeft: SPACING.sm,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: SPACING.xs,
  },
  list: {
    gap: SPACING.md,
    paddingBottom: 110,
  },
  productCard: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    overflow: 'hidden',
  },
  cardMainTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  thumbnailWrap: {
    width: 54,
    height: 54,
    borderRadius: RADII.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.sm,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  metaDot: {
    marginHorizontal: 6,
    fontSize: 10,
  },
  stockText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  footerActionBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
