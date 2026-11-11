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
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useAppTheme } from '@/hooks/useAppTheme';
import { EmptyState } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { Product, ProductStatus } from '@/types';

type TabFilter = 'all' | 'active' | 'draft' | 'archived';

export default function ProductsListScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { products, loading, refresh, toggleActive, remove } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  useEffect(() => {
    refresh();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (activeTab === 'active') {
      list = list.filter((p) => p.actif === true && p.statut !== 'archivé');
    } else if (activeTab === 'draft') {
      list = list.filter((p) => p.actif === false || p.statut === 'brouillon');
    } else if (activeTab === 'archived') {
      list = list.filter((p) => p.statut === 'archivé');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.nom.toLowerCase().includes(q));
    }

    return list;
  }, [products, activeTab, searchQuery]);

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
      `Confirmez-vous la suppression définitive de "${name}" ? Cette action est irréversible.`,
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

  const getStatusDisplay = (product: Product) => {
    const isArchived = product.statut === 'archivé';
    const isActive = product.actif && !isArchived;

    if (isArchived) {
      return {
        label: 'Archivé',
        isDot: false,
        badgeBg: colors.MUTED_BG,
        badgeText: colors.TEXT_MUTED,
        badgeBorder: colors.BORDER,
      };
    }

    if (isActive) {
      return {
        label: 'Actif',
        isDot: true,
        dotColor: '#22c55e', // vert Shopify distinct
        badgeBg: 'transparent',
        badgeText: colors.TEXT_MUTED,
        badgeBorder: 'transparent',
      };
    }

    return {
      label: 'Brouillon',
      isDot: false,
      badgeBg: colors.MUTED_BG,
      badgeText: colors.TEXT_MUTED,
      badgeBorder: colors.BORDER,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      {/* EN-TÊTE SHOPIFY STRICT */}
      <View style={styles.topHeader}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Produits</Text>
        </View>

        <View style={styles.headerActionGroup}>
          <TouchableOpacity
            onPress={() => router.push('/(admin)/produits/nouveau')}
            style={[styles.addCircleBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
            activeOpacity={0.8}
            accessibilityLabel="Ajouter un produit"
          >
            <Plus size={20} color={colors.TEXT_PRIMARY} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRE DE RECHERCHE ET ACTIONS AUXILIAIRES */}
      <View style={styles.searchRow}>
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
            placeholder="Rechercher"
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

        <TouchableOpacity
          style={[styles.iconActionBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
          activeOpacity={0.7}
        >
          <ArrowUpDown size={17} color={colors.TEXT_MUTED} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconActionBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={17} color={colors.TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      {/* ONGLETS DE FILTRAGE SHOPIFY (Tous, Actifs, Brouillons, Archivés) */}
      <View style={styles.filterTabsWrapper}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={[
            styles.tabItem,
            activeTab === 'all'
              ? [styles.tabItemActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]
              : null,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'all' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
              activeTab === 'all' && styles.tabTextActive,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('active')}
          style={[
            styles.tabItem,
            activeTab === 'active'
              ? [styles.tabItemActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]
              : null,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'active' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Actifs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('draft')}
          style={[
            styles.tabItem,
            activeTab === 'draft'
              ? [styles.tabItemActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]
              : null,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'draft' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
              activeTab === 'draft' && styles.tabTextActive,
            ]}
          >
            Brouillons
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('archived')}
          style={[
            styles.tabItem,
            activeTab === 'archived'
              ? [styles.tabItemActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]
              : null,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'archived' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
              activeTab === 'archived' && styles.tabTextActive,
            ]}
          >
            Archivés
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTE SHOPIFY POLARIS */}
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
                  ? `Aucun produit ne correspond à "${searchQuery}".`
                  : 'Aucun article répertorié dans cette vue.'
              }
            />
          ) : null
        }
        renderItem={({ item }: { item: Product }) => {
          const mainImage = item.images && item.images.length > 0 ? item.images[0] : null;
          const statusInfo = getStatusDisplay(item);

          return (
            <View
              style={[
                styles.productRowCard,
                {
                  backgroundColor: colors.BG_CARD,
                  borderColor: colors.BORDER,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                style={styles.cardMainArea}
                activeOpacity={0.7}
              >
                <View style={[styles.thumbnailWrap, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
                  {mainImage ? (
                    <Image source={{ uri: mainImage }} style={styles.thumbnail} resizeMode="cover" />
                  ) : (
                    <Package size={22} color={colors.TEXT_MUTED} />
                  )}
                </View>

                <View style={styles.contentCol}>
                  <Text style={[styles.productName, { color: colors.TEXT_PRIMARY }]} numberOfLines={2}>
                    {item.nom}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.productPrice, { color: colors.TEXT_PRIMARY }]}>
                      {formatPrice(item.prix)}
                    </Text>
                    {item.prix_comparaison && item.prix_comparaison > item.prix ? (
                      <Text style={[styles.comparePrice, { color: colors.TEXT_FAINT }]}>
                        {formatPrice(item.prix_comparaison)}
                      </Text>
                    ) : null}
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
                      {item.stock > 0 ? `${item.stock} disponibles` : 'Rupture'}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusCol}>
                  {statusInfo.isDot ? (
                    <View style={[styles.greenDot, { backgroundColor: statusInfo.dotColor }]} />
                  ) : (
                    <View
                      style={[
                        styles.badgeBox,
                        {
                          backgroundColor: statusInfo.badgeBg,
                          borderColor: statusInfo.badgeBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: statusInfo.badgeText }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* ACTIONS SUBTILES ET ÉPURÉES */}
              <View style={[styles.cardFooter, { borderTopColor: colors.BORDER_FAINT }]}>
                <TouchableOpacity
                  onPress={() => handleShareProduct(item)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityLabel="Partager"
                >
                  <Share2 size={14} color={colors.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleActive(item.id, item.actif)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityLabel="Changer visibilité"
                >
                  {item.actif ? (
                    <Eye size={14} color={colors.SUCCESS} />
                  ) : (
                    <EyeOff size={14} color={colors.TEXT_MUTED} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/(admin)/produits/${item.id}`)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.BG_INPUT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityLabel="Modifier"
                >
                  <Edit3 size={14} color={colors.INFO} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleConfirmDelete(item.id, item.nom)}
                  style={[styles.footerActionBtn, { backgroundColor: colors.DANGER_BG_LIGHT }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityLabel="Supprimer"
                >
                  <Trash2 size={14} color={colors.DANGER} />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: RADII.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    height: 44,
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
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: RADII.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    paddingVertical: 2,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADII.full,
  },
  tabItemActive: {
    borderWidth: 1,
  },
  tabText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '800',
  },
  list: {
    gap: SPACING.md,
    paddingBottom: 110,
  },
  productRowCard: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    overflow: 'hidden',
  },
  cardMainArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  thumbnailWrap: {
    width: 58,
    height: 58,
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
  contentCol: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  comparePrice: {
    fontSize: FONT_SIZE.xs,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  metaDot: {
    marginHorizontal: 6,
    fontSize: 10,
  },
  stockText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  statusCol: {
    paddingLeft: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  badgeBox: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderTopWidth: 1,
  },
  footerActionBtn: {
    minWidth: 32,
    height: 32,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
