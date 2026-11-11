import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Trash2,
  Plus,
  Star,
  Link as LinkIcon,
  Tag,
} from 'lucide-react-native';
import { getProductById, updateProduct, deleteProduct } from '../../../lib/products';
import { generateSlug, formatPrice } from '../../../lib/utils';
import { pickAndUploadImage } from '../../../lib/storage';
import RichTextEditor from '../../../components/product/RichTextEditor';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { ProductStatus, ProductVariant } from '../../../types';

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { colors, isDark } = useAppTheme();

  // 1. Général & Contenu
  const [nom, setNom] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // 2. Médias
  const [images, setImages] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [showAddUrlInput, setShowAddUrlInput] = useState(false);

  // 3. Tarification
  const [prix, setPrix] = useState('');
  const [prixComparaison, setPrixComparaison] = useState('');
  const [coutAchat, setCoutAchat] = useState('');
  const [facturerTaxe, setFacturerTaxe] = useState(false);

  // 4. Stocks / Inventaire
  const [sku, setSku] = useState('');
  const [codeBarre, setCodeBarre] = useState('');
  const [suivreStock, setSuivreStock] = useState(true);
  const [vendreEnRupture, setVendreEnRupture] = useState(false);
  const [stock, setStock] = useState('0');

  // 5. Expédition
  const [produitPhysique, setProduitPhysique] = useState(true);
  const [poids, setPoids] = useState('0.0');
  const [unitePoids, setUnitePoids] = useState<'kg' | 'g' | 'lb' | 'oz'>('kg');

  // 6. Variantes
  const [variantes, setVariantes] = useState<ProductVariant[]>([]);
  const [variantOptionName, setVariantOptionName] = useState('');
  const [variantOptionValues, setVariantOptionValues] = useState('');
  const [showAddVariant, setShowAddVariant] = useState(false);

  // 7. Organisation
  const [statut, setStatut] = useState<ProductStatus>('actif');
  const [categorie, setCategorie] = useState('');
  const [typeProduit, setTypeProduit] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [balises, setBalises] = useState<string[]>([]);

  // États de chargement
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Calculs dynamiques de marge Shopify
  const marginMetrics = useMemo(() => {
    const salePrice = parseFloat(prix.replace(/[^0-9.]/g, '')) || 0;
    const cost = parseFloat(coutAchat.replace(/[^0-9.]/g, '')) || 0;

    if (salePrice <= 0 || cost <= 0) {
      return { profit: '--', marginPct: '--' };
    }

    const profitVal = salePrice - cost;
    const marginPctVal = Math.round((profitVal / salePrice) * 100);

    return {
      profit: formatPrice(profitVal),
      marginPct: `${marginPctVal}%`,
    };
  }, [prix, coutAchat]);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((p) => {
      if (p) {
        setNom(p.nom);
        setSlug(p.slug || generateSlug(p.nom));
        setPrix(String(p.prix));
        setPrixComparaison(p.prix_comparaison ? String(p.prix_comparaison) : '');
        setCoutAchat(p.cout_achat ? String(p.cout_achat) : '');
        setFacturerTaxe(p.facturer_taxe ?? false);
        setStock(String(p.stock));
        setSku(p.sku || '');
        setCodeBarre(p.code_barre || '');
        setSuivreStock(p.suivre_stock ?? true);
        setVendreEnRupture(p.vendre_en_rupture ?? false);
        setProduitPhysique(p.produit_physique ?? true);
        setPoids(p.poids ? String(p.poids) : '0.0');
        setUnitePoids(p.unite_poids || 'kg');
        setDescription(p.description || '');
        setImages(p.images && p.images.length > 0 ? p.images : []);
        setStatut(p.statut || (p.actif ? 'actif' : 'brouillon'));
        setCategorie(p.categorie || '');
        setTypeProduit(p.type_produit || '');
        setFournisseur(p.fournisseur || '');
        setBalises(p.balises || []);
        setVariantes(p.variantes || []);
      }
      setFetching(false);
    });
  }, [id]);

  const handlePickImage = async () => {
    setUploadingImage(true);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        setImages((prev) => [...prev, res.url!]);
      } else if (res.error) {
        Alert.alert('Erreur', res.error);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le média.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddMediaUrl = () => {
    const trimmed = newMediaUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      Alert.alert('Format invalide', 'Veuillez saisir une URL valide débutant par http:// ou https://');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setNewMediaUrl('');
    setShowAddUrlInput(false);
  };

  const handleRemoveMedia = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryMedia = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !balises.includes(trimmed)) {
      setBalises((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setBalises((prev) => prev.filter((t) => t !== tag));
  };

  const handleAddVariant = () => {
    if (!variantOptionName.trim()) {
      Alert.alert('Nom requis', 'Indiquez un nom d\'option comme Taille ou Couleur.');
      return;
    }
    const values = variantOptionValues
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (values.length === 0) {
      Alert.alert('Valeurs requises', 'Indiquez au moins une valeur séparée par des virgules.');
      return;
    }

    setVariantes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        option_name: variantOptionName.trim(),
        option_values: values,
      },
    ]);
    setVariantOptionName('');
    setVariantOptionValues('');
    setShowAddVariant(false);
  };

  const handleRemoveVariant = (varId: string) => {
    setVariantes((prev) => prev.filter((v) => v.id !== varId));
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le produit',
      `Confirmez-vous la suppression définitive de "${nom}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            const res = await deleteProduct(id);
            if (res.success) {
              router.back();
            } else {
              Alert.alert('Erreur', res.error || 'Impossible de supprimer l\'article.');
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    if (!id) return;
    if (!nom.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir le titre du produit.');
      return;
    }

    const numericPrice = parseFloat(prix.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Prix invalide', 'Veuillez saisir un montant de vente valide.');
      return;
    }

    const numericCompare = prixComparaison.trim()
      ? parseFloat(prixComparaison.replace(/[^0-9.]/g, ''))
      : undefined;

    const numericCoutAchat = coutAchat.trim()
      ? parseFloat(coutAchat.replace(/[^0-9.]/g, ''))
      : undefined;

    const numericStock = parseInt(stock.replace(/[^0-9]/g, ''), 10);
    const finalStock = isNaN(numericStock) ? 0 : numericStock;

    const numericPoids = poids.trim() ? parseFloat(poids.replace(/[^0-9.]/g, '')) : undefined;

    setLoading(true);
    try {
      const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(nom);
      const res = await updateProduct(id, {
        nom: nom.trim(),
        slug: finalSlug,
        prix: numericPrice,
        prix_comparaison: numericCompare,
        cout_achat: numericCoutAchat,
        facturer_taxe: facturerTaxe,
        stock: finalStock,
        sku: sku.trim() || null,
        code_barre: codeBarre.trim() || null,
        suivre_stock: suivreStock,
        vendre_en_rupture: vendreEnRupture,
        produit_physique: produitPhysique,
        poids: numericPoids,
        unite_poids: unitePoids,
        description: description.trim() || null,
        images: images,
        content_blocks: [],
        actif: statut === 'actif',
        statut,
        categorie: categorie.trim() || null,
        type_produit: typeProduit.trim() || null,
        fournisseur: fournisseur.trim() || null,
        balises,
        variantes,
      });

      if (!res.success) {
        throw new Error(res.error || 'Erreur lors de la mise à jour.');
      }

      router.back();
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de mettre à jour le produit.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.BG_PRIMARY }]}>
        <ActivityIndicator size="large" color={colors.ACCENT} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screenWrapper, { backgroundColor: colors.BG_PRIMARY }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* HEADER SHOPIFY FIDÈLE : RETOUR / TITRE / CHECKMARK */}
      <View style={[styles.topBar, { backgroundColor: colors.BG_PRIMARY, borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={22} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
          Modifier le produit
        </Text>

        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          style={[styles.headerIconBtn, loading && styles.disabled]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Enregistrer le produit"
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.ACCENT} />
          ) : (
            <Check size={22} color={colors.TEXT_PRIMARY} strokeWidth={2.4} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.BG_PRIMARY }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1 : TITRE & DESCRIPTION */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Titre</Text>
            <TextInput
              placeholder="Titre de l'article"
              placeholderTextColor={colors.TEXT_FAINT}
              value={nom}
              onChangeText={setNom}
              style={[
                styles.input,
                {
                  backgroundColor: colors.BG_INPUT,
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Description</Text>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Rédigez la description détaillée..."
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabelSubtle, { color: colors.TEXT_MUTED }]}>Identifiant URL personnalisé</Text>
            <TextInput
              placeholder="identifiant-url"
              placeholderTextColor={colors.TEXT_FAINT}
              value={slug}
              onChangeText={(txt) => setSlug(generateSlug(txt))}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: colors.BG_INPUT,
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
            />
          </View>
        </View>

        {/* SECTION 2 : MÉDIAS */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Médias</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
            Ajoutez des fichiers vidéo, image ou visuels de démonstration.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaCarouselScroll}
          >
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={uploadingImage}
              style={[styles.addMediaThumb, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color={colors.ACCENT} />
              ) : (
                <>
                  <ImagePlus size={20} color={colors.TEXT_PRIMARY} />
                  <Text style={[styles.addMediaThumbText, { color: colors.TEXT_PRIMARY }]}>Ajouter</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowAddUrlInput(!showAddUrlInput)}
              style={[styles.addMediaThumb, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
            >
              <LinkIcon size={18} color={colors.TEXT_MUTED} />
              <Text style={[styles.addMediaThumbText, { color: colors.TEXT_MUTED }]}>Lien URL</Text>
            </TouchableOpacity>

            {images.map((imgUri, idx) => {
              const isPrimary = idx === 0;
              return (
                <View
                  key={idx}
                  style={[
                    styles.mediaThumbCard,
                    {
                      borderColor: isPrimary ? colors.ACCENT : colors.BORDER,
                      backgroundColor: colors.BG_INPUT,
                    },
                  ]}
                >
                  <Image source={{ uri: imgUri }} style={styles.mediaThumbImg} resizeMode="cover" />

                  {isPrimary && (
                    <View style={[styles.primaryBadge, { backgroundColor: colors.ACCENT }]}>
                      <Star size={9} color={isDark ? '#060501' : '#ffffff'} fill={isDark ? '#060501' : '#ffffff'} />
                      <Text style={[styles.primaryBadgeText, { color: isDark ? '#060501' : '#ffffff' }]}>
                        Principale
                      </Text>
                    </View>
                  )}

                  <View style={styles.thumbActionsOverlay}>
                    {!isPrimary && (
                      <TouchableOpacity
                        onPress={() => handleSetPrimaryMedia(idx)}
                        style={[styles.thumbActionBtn, { backgroundColor: 'rgba(0,0,0,0.65)' }]}
                      >
                        <Star size={12} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleRemoveMedia(idx)}
                      style={[styles.thumbActionBtn, { backgroundColor: 'rgba(220,38,38,0.85)' }]}
                    >
                      <Trash2 size={12} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {showAddUrlInput && (
            <View style={[styles.addUrlBox, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              <TextInput
                placeholder="https://..."
                placeholderTextColor={colors.TEXT_FAINT}
                value={newMediaUrl}
                onChangeText={setNewMediaUrl}
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    flex: 1,
                    marginBottom: 0,
                    backgroundColor: colors.BG_CARD,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={handleAddMediaUrl}
                style={[styles.addUrlConfirmBtn, { backgroundColor: colors.ACCENT }]}
              >
                <Plus size={16} color={isDark ? '#060501' : '#ffffff'} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION 3 : TARIFICATION */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Tarification</Text>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Prix</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.TEXT_FAINT}
                value={prix}
                onChangeText={setPrix}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Prix d'origine</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.TEXT_FAINT}
                value={prixComparaison}
                onChangeText={setPrixComparaison}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Coût par article</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.TEXT_FAINT}
                value={coutAchat}
                onChangeText={setCoutAchat}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabelSubtle, { color: colors.TEXT_MUTED }]}>Marge bénéficiaire</Text>
              <View
                style={[
                  styles.readonlyMetricBox,
                  { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER },
                ]}
              >
                <Text style={[styles.metricValue, { color: colors.TEXT_PRIMARY }]}>
                  {marginMetrics.profit}
                </Text>
                <Text style={[styles.metricSub, { color: colors.TEXT_MUTED }]}>
                  Marge brute : {marginMetrics.marginPct}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.switchRow, { borderTopColor: colors.BORDER_FAINT }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.TEXT_PRIMARY }]}>
                Facturer la taxe sur ce produit
              </Text>
            </View>
            <Switch
              value={facturerTaxe}
              onValueChange={setFacturerTaxe}
              trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
              thumbColor={facturerTaxe ? (isDark ? '#060501' : '#ffffff') : '#f4f3f4'}
            />
          </View>
        </View>

        {/* SECTION 4 : STOCKS */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Stocks</Text>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Code SKU</Text>
              <TextInput
                placeholder="Ex: CHEMISE-NOIR-L"
                placeholderTextColor={colors.TEXT_FAINT}
                value={sku}
                onChangeText={setSku}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Code-barres</Text>
              <TextInput
                placeholder="ISBN, UPC, GTIN"
                placeholderTextColor={colors.TEXT_FAINT}
                value={codeBarre}
                onChangeText={setCodeBarre}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
            </View>
          </View>

          <View style={[styles.switchRow, { borderTopColor: colors.BORDER_FAINT }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.TEXT_PRIMARY }]}>
                Suivre la quantité
              </Text>
            </View>
            <Switch
              value={suivreStock}
              onValueChange={setSuivreStock}
              trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
              thumbColor={suivreStock ? (isDark ? '#060501' : '#ffffff') : '#f4f3f4'}
            />
          </View>

          <View style={[styles.switchRow, { borderTopColor: colors.BORDER_FAINT }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.TEXT_PRIMARY }]}>
                Poursuivre la vente en cas de rupture de stock
              </Text>
            </View>
            <Switch
              value={vendreEnRupture}
              onValueChange={setVendreEnRupture}
              trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
              thumbColor={vendreEnRupture ? (isDark ? '#060501' : '#ffffff') : '#f4f3f4'}
            />
          </View>

          <View style={[styles.field, { marginTop: SPACING.md }]}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Quantité disponible</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.TEXT_FAINT}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: colors.BG_INPUT,
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
            />
          </View>
        </View>

        {/* SECTION 5 : EXPÉDITION */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Expédition</Text>

          <View style={[styles.switchRow, { borderTopWidth: 0, paddingBottom: SPACING.md }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.TEXT_PRIMARY }]}>
                Produit physique
              </Text>
            </View>
            <Switch
              value={produitPhysique}
              onValueChange={setProduitPhysique}
              trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
              thumbColor={produitPhysique ? (isDark ? '#060501' : '#ffffff') : '#f4f3f4'}
            />
          </View>

          {produitPhysique && (
            <View style={styles.row}>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Poids du colis</Text>
                <TextInput
                  placeholder="0.0"
                  placeholderTextColor={colors.TEXT_FAINT}
                  value={poids}
                  onChangeText={setPoids}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.BG_INPUT,
                      borderColor: colors.BORDER,
                      color: colors.TEXT_PRIMARY,
                    },
                  ]}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Unité</Text>
                <View style={[styles.segmentedUnit, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
                  {(['kg', 'g'] as const).map((u) => (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setUnitePoids(u)}
                      style={[
                        styles.unitBtn,
                        unitePoids === u && [styles.unitBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
                      ]}
                    >
                      <Text
                        style={[
                          styles.unitBtnText,
                          { color: unitePoids === u ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                          unitePoids === u && styles.unitBtnTextBold,
                        ]}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* SECTION 6 : VARIANTES */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Variantes</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
            Ajoutez des options de personnalisation telles que la taille, la couleur ou le matériau.
          </Text>

          {variantes.map((v) => (
            <View
              key={v.id}
              style={[styles.variantItemBox, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
            >
              <View style={styles.variantItemHeader}>
                <Text style={[styles.variantItemName, { color: colors.TEXT_PRIMARY }]}>
                  {v.option_name}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveVariant(v.id)}>
                  <Trash2 size={16} color={colors.DANGER} />
                </TouchableOpacity>
              </View>
              <View style={styles.variantTagWrap}>
                {v.option_values.map((val, idx) => (
                  <View key={idx} style={[styles.variantPill, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
                    <Text style={[styles.variantPillText, { color: colors.TEXT_PRIMARY }]}>{val}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {showAddVariant ? (
            <View style={[styles.addVariantForm, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Nom de l'option</Text>
                <TextInput
                  placeholder="Ex: Taille ou Couleur"
                  placeholderTextColor={colors.TEXT_FAINT}
                  value={variantOptionName}
                  onChangeText={setVariantOptionName}
                  style={[styles.input, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Valeurs séparées par une virgule</Text>
                <TextInput
                  placeholder="Ex: S, M, L, XL"
                  placeholderTextColor={colors.TEXT_FAINT}
                  value={variantOptionValues}
                  onChangeText={setVariantOptionValues}
                  style={[styles.input, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
                />
              </View>

              <View style={styles.variantFormActions}>
                <TouchableOpacity
                  onPress={() => setShowAddVariant(false)}
                  style={[styles.variantCancelBtn, { borderColor: colors.BORDER }]}
                >
                  <Text style={[styles.variantCancelText, { color: colors.TEXT_MUTED }]}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddVariant}
                  style={[styles.variantAddConfirmBtn, { backgroundColor: colors.ACCENT }]}
                >
                  <Text style={[styles.variantAddConfirmText, { color: isDark ? '#060501' : '#ffffff' }]}>
                    Ajouter l'option
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowAddVariant(true)}
              style={[styles.addOptionBtn, { borderColor: colors.BORDER }]}
              activeOpacity={0.7}
            >
              <Plus size={16} color={colors.TEXT_PRIMARY} />
              <Text style={[styles.addOptionBtnText, { color: colors.TEXT_PRIMARY }]}>
                Ajouter une option comme la taille ou la couleur
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION 7 : ORGANISATION DU PRODUIT */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Organisation du produit</Text>

          {/* SÉLECTEUR DE STATUT */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Statut</Text>
            <View style={[styles.segmentedStatut, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              {(['actif', 'brouillon', 'archivé'] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatut(st)}
                  style={[
                    styles.statutBtn,
                    statut === st && [styles.statutBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
                  ]}
                >
                  <Text
                    style={[
                      styles.statutBtnText,
                      { color: statut === st ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                      statut === st && styles.statutBtnTextBold,
                    ]}
                  >
                    {st === 'actif' ? 'Actif' : st === 'brouillon' ? 'Ébauche' : 'Archivé'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Catégorie</Text>
            <TextInput
              placeholder="Vêtements, Accessoires, High-Tech..."
              placeholderTextColor={colors.TEXT_FAINT}
              value={categorie}
              onChangeText={setCategorie}
              style={[styles.input, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Type de produit</Text>
            <TextInput
              placeholder="T-Shirt, Montre, Luminaire..."
              placeholderTextColor={colors.TEXT_FAINT}
              value={typeProduit}
              onChangeText={setTypeProduit}
              style={[styles.input, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Fournisseur ou fabricant</Text>
            <TextInput
              placeholder="Nom du fournisseur"
              placeholderTextColor={colors.TEXT_FAINT}
              value={fournisseur}
              onChangeText={setFournisseur}
              style={[styles.input, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />
          </View>

          {/* BALISES / TAGS */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Balises</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                placeholder="Nouvelle balise..."
                placeholderTextColor={colors.TEXT_FAINT}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                style={[
                  styles.input,
                  {
                    flex: 1,
                    marginBottom: 0,
                    backgroundColor: colors.BG_INPUT,
                    borderColor: colors.BORDER,
                    color: colors.TEXT_PRIMARY,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={handleAddTag}
                style={[styles.addTagBtn, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
              >
                <Plus size={16} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {balises.length > 0 && (
              <View style={styles.tagWrap}>
                {balises.map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tagPill, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
                  >
                    <Tag size={12} color={colors.TEXT_MUTED} />
                    <Text style={[styles.tagText, { color: colors.TEXT_PRIMARY }]}>{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveTag(tag)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <Trash2 size={12} color={colors.DANGER} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ACTIONS INFÉRIEURES */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={loading}
            style={[styles.saveBtn, { backgroundColor: colors.ACCENT }, loading && styles.disabled]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? '#060501' : '#ffffff'} />
            ) : (
              <Text style={[styles.saveBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
                Enregistrer les modifications
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.deleteBtn, { backgroundColor: colors.DANGER_BG_LIGHT, borderColor: colors.DANGER_BORDER }]}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color={colors.DANGER} />
            <Text style={[styles.deleteBtnText, { color: colors.DANGER }]}>Supprimer le produit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 140,
    gap: SPACING.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
    lineHeight: 16,
  },
  field: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  fieldLabelSubtle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  readonlyMetricBox: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    borderTopWidth: 1,
  },
  switchInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  switchLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  mediaCarouselScroll: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  addMediaThumb: {
    width: 78,
    height: 78,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addMediaThumbText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mediaThumbCard: {
    width: 78,
    height: 78,
    borderRadius: RADII.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaThumbImg: {
    width: '100%',
    height: '100%',
  },
  primaryBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  primaryBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  thumbActionsOverlay: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    flexDirection: 'row',
    gap: 3,
  },
  thumbActionBtn: {
    padding: 4,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addUrlBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
    padding: 6,
    borderRadius: RADII.lg,
    borderWidth: 1,
  },
  addUrlConfirmBtn: {
    padding: 10,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedUnit: {
    flexDirection: 'row',
    borderRadius: RADII.lg,
    padding: 3,
    borderWidth: 1,
    gap: 4,
    height: 44,
  },
  unitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.md,
  },
  unitBtnActive: {
    borderWidth: 1,
  },
  unitBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  unitBtnTextBold: {
    fontWeight: '800',
  },
  variantItemBox: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  variantItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  variantItemName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  variantTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  variantPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.md,
    borderWidth: 1,
  },
  variantPillText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addOptionBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  addVariantForm: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginTop: 4,
  },
  variantFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  variantCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
  },
  variantCancelText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  variantAddConfirmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADII.md,
  },
  variantAddConfirmText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  segmentedStatut: {
    flexDirection: 'row',
    borderRadius: RADII.lg,
    padding: 3,
    borderWidth: 1,
    gap: 4,
  },
  statutBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADII.md,
  },
  statutBtnActive: {
    borderWidth: 1,
  },
  statutBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  statutBtnTextBold: {
    fontWeight: '800',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addTagBtn: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADII.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  bottomActions: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADII.xl,
    borderWidth: 1,
    minHeight: 48,
  },
  deleteBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
