import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ImagePlus,
  Trash2,
  Plus,
  Star,
  Link as LinkIcon,
} from 'lucide-react-native';
import { createProduct } from '../../../lib/products';
import { generateSlug } from '../../../lib/utils';
import { pickAndUploadImage } from '../../../lib/storage';
import RichTextEditor from '../../../components/product/RichTextEditor';
import BlockEditor from '../../../components/product/BlockEditor';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { ContentBlock } from '../../../types';

export default function NewProductScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();

  // État du produit
  const [actif, setActif] = useState(true);
  const [nom, setNom] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [prix, setPrix] = useState('');
  const [coutAchat, setCoutAchat] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [showAddUrlInput, setShowAddUrlInput] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleNomChange = (text: string) => {
    setNom(text);
    if (!isCustomSlug) {
      setSlug(generateSlug(text));
    }
  };

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
      Alert.alert('Erreur', "Impossible d'importer l'image sélectionnée.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddMediaUrl = () => {
    const trimmed = newMediaUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      Alert.alert('Format Invalide', 'Veuillez saisir une URL valide commençant par http:// ou https://');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setNewMediaUrl('');
    setShowAddUrlInput(false);
  };

  const handleRemoveMedia = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryMedia = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const handleSave = async () => {
    if (!nom.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir le titre du produit.');
      return;
    }

    const numericPrice = parseFloat(prix.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Prix invalide', 'Veuillez saisir un prix de vente valide.');
      return;
    }

    const numericStock = parseInt(stock.replace(/[^0-9]/g, ''), 10);
    const finalStock = isNaN(numericStock) ? 0 : numericStock;

    const numericCoutAchat = coutAchat.trim() ? parseFloat(coutAchat.replace(/[^0-9.]/g, '')) : undefined;

    setLoading(true);

    try {
      const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(nom);

      const res = await createProduct({
        nom: nom.trim(),
        slug: finalSlug,
        prix: numericPrice,
        cout_achat: numericCoutAchat,
        stock: finalStock,
        description: description.trim() || null,
        images,
        content_blocks: blocks,
        actif,
      });

      if (!res.success) {
        throw new Error(res.error || 'Erreur lors de la création.');
      }

      router.back();
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de créer le produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screenWrapper, { backgroundColor: colors.BG_PRIMARY }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* HEADER POLARIS : BOUTON RETOUR & ACTIONS PROPRES */}
      <View style={[styles.topBar, { backgroundColor: colors.BG_PRIMARY, borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={18} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.TEXT_PRIMARY }]}>Ajouter un produit</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={[styles.topBarSaveBtn, { backgroundColor: colors.ACCENT }]}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={isDark ? '#060501' : '#ffffff'} />
          ) : (
            <Text style={[styles.topBarSaveBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
              Enregistrer
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.BG_PRIMARY }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {/* CARTE 1 : INFORMATIONS GÉNÉRALES */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.cardTitle, { color: colors.TEXT_PRIMARY }]}>Informations générales</Text>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Titre du produit *</Text>
            <TextInput
              placeholder="Ex: T-Shirt Coton Bio Noir"
              placeholderTextColor={colors.TEXT_FAINT}
              value={nom}
              onChangeText={handleNomChange}
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
            <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Identifiant URL (Slug)</Text>
            <TextInput
              placeholder="t-shirt-coton-bio-noir"
              placeholderTextColor={colors.TEXT_FAINT}
              value={slug}
              onChangeText={(txt) => {
                setIsCustomSlug(true);
                setSlug(generateSlug(txt));
              }}
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

        {/* CARTE 2 : STATUT DU PRODUIT */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.cardTitle, { color: colors.TEXT_PRIMARY }]}>Statut du produit</Text>
          <Text style={[styles.cardSubtitle, { color: colors.TEXT_MUTED }]}>
            Définissez si ce produit est immédiatement visible et commandable par vos clients.
          </Text>

          <View style={[styles.segmentedControl, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
            <TouchableOpacity
              onPress={() => setActif(true)}
              style={[
                styles.segmentedBtn,
                actif && [styles.segmentedBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: colors.SUCCESS }]} />
              <Text
                style={[
                  styles.segmentedBtnText,
                  { color: actif ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  actif && styles.segmentedBtnTextBold,
                ]}
              >
                Actif
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActif(false)}
              style={[
                styles.segmentedBtn,
                !actif && [styles.segmentedBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: colors.TEXT_MUTED }]} />
              <Text
                style={[
                  styles.segmentedBtnText,
                  { color: !actif ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  !actif && styles.segmentedBtnTextBold,
                ]}
              >
                Brouillon
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARTE 3 : TARIFICATION & INVENTAIRE */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.cardTitle, { color: colors.TEXT_PRIMARY }]}>Tarification et stock</Text>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Prix de vente *</Text>
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
              <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Coût d'achat</Text>
              <TextInput
                placeholder="Optionnel"
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
              <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Stock</Text>
              <TextInput
                placeholder="10"
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
        </View>

        {/* CARTE 4 : MÉDIAS */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.cardTitle, { color: colors.TEXT_PRIMARY }]}>Médias ({images.length})</Text>
          <Text style={[styles.cardSubtitle, { color: colors.TEXT_MUTED }]}>
            La première image est la vignette principale affichée sur la boutique.
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
              <Text style={[styles.addMediaThumbText, { color: colors.TEXT_MUTED }]}>URL</Text>
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

        {/* CARTE 5 : DESCRIPTION */}
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Rédigez la description détaillée du produit..."
        />

        {/* CARTE 6 : BLOCS DE VENTE ENRICHIS */}
        <BlockEditor blocks={blocks} onChange={setBlocks} />

        {/* BOUTON D'ENREGISTREMENT FLOTTANT/BAS */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={[
            styles.saveBtn,
            { backgroundColor: colors.ACCENT },
            loading && styles.disabled,
          ]}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={isDark ? '#060501' : '#ffffff'} />
          ) : (
            <Text style={[styles.saveBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
              {actif ? 'Publier le produit' : 'Enregistrer en brouillon'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADII.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },
  topBarSaveBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarSaveBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
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
  cardTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
    lineHeight: 16,
  },
  field: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: RADII.lg,
    padding: 3,
    borderWidth: 1,
    gap: 4,
  },
  segmentedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: RADII.md,
  },
  segmentedBtnActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  segmentedBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  segmentedBtnTextBold: {
    fontWeight: '700',
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
  saveBtn: {
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
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
});
