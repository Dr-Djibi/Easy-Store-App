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
  Link as LinkIcon,
  RefreshCw,
  Globe,
  MessageCircle,
  Share2,
  Star,
  Plus,
  Video,
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
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [showAddUrlInput, setShowAddUrlInput] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  // Canaux de publication (visuels informatifs & sélection)
  const [channels, setChannels] = useState({
    web: true,
    whatsapp: true,
    social: false,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Synchronisation automatique du slug à la frappe si non personnalisé manuellement
  const handleNomChange = (text: string) => {
    setNom(text);
    if (!isCustomSlug) {
      setSlug(generateSlug(text));
    }
  };

  const handleSlugReset = () => {
    setIsCustomSlug(false);
    setSlug(generateSlug(nom));
  };

  // Ajout d'image depuis la galerie
  const handlePickImage = async () => {
    setUploadingImage(true);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        setImages((prev) => [...prev, res.url!]);
      } else if (res.error) {
        Alert.alert('Erreur Upload', res.error);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Ajout de média par URL
  const handleAddMediaUrl = () => {
    if (!newMediaUrl.trim()) return;
    setImages((prev) => [...prev, newMediaUrl.trim()]);
    setNewMediaUrl('');
    setShowAddUrlInput(false);
  };

  // Retirer un média du carrousel
  const handleRemoveMedia = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Définir comme média principal (déplacement en première position)
  const handleSetPrimaryMedia = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  // Validation & Enregistrement
  const handleSave = async () => {
    if (!nom.trim() || !prix.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez saisir au moins le titre et le prix.');
      return;
    }

    setLoading(true);
    try {
      const finalSlug = slug.trim() || generateSlug(nom.trim());
      const res = await createProduct({
        nom: nom.trim(),
        slug: finalSlug,
        prix: Number(prix) || 0,
        stock: Number(stock) || 0,
        description: description.trim() || null,
        images: images,
        content_blocks: blocks,
        actif: actif,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      Alert.alert('Succès 🎉', 'Produit ajouté à votre boutique !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
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
      {/* BARRE SUPÉRIEURE AVEC RETOUR */}
      <View style={[styles.topBar, { backgroundColor: colors.BG_PRIMARY, borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
        >
          <ArrowLeft size={18} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.TEXT_PRIMARY }]}>Nouveau Produit</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.BG_PRIMARY }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {/* STATUT DU PRODUIT (ACTIF / BROUILLON) */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Visibilité & Statut</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
            Choisissez si le produit est immédiatement mis en vente ou conservé en brouillon.
          </Text>

          <View style={[styles.statusToggleRow, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
            <TouchableOpacity
              onPress={() => setActif(true)}
              style={[
                styles.statusBtn,
                actif && [styles.statusBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.SUCCESS }],
              ]}
            >
              <View style={[styles.statusIndicator, { backgroundColor: colors.SUCCESS }]} />
              <Text
                style={[
                  styles.statusBtnText,
                  { color: actif ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  actif && styles.statusBtnTextBold,
                ]}
              >
                Actif (En Vente)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActif(false)}
              style={[
                styles.statusBtn,
                !actif && [styles.statusBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.ACCENT }],
              ]}
            >
              <View style={[styles.statusIndicator, { backgroundColor: colors.TEXT_MUTED }]} />
              <Text
                style={[
                  styles.statusBtnText,
                  { color: !actif ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  !actif && styles.statusBtnTextBold,
                ]}
              >
                Brouillon
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CANAUX DE PUBLICATION */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Canaux de Publication</Text>
          <View style={styles.channelsRow}>
            <TouchableOpacity
              onPress={() => setChannels((c) => ({ ...c, web: !c.web }))}
              style={[
                styles.channelChip,
                { borderColor: channels.web ? colors.ACCENT : colors.BORDER, backgroundColor: channels.web ? colors.ACCENT_BG : colors.BG_INPUT },
              ]}
            >
              <Globe size={15} color={channels.web ? colors.ACCENT : colors.TEXT_MUTED} />
              <Text style={[styles.channelChipText, { color: channels.web ? colors.ACCENT : colors.TEXT_MUTED }]}>
                Boutique Web
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setChannels((c) => ({ ...c, whatsapp: !c.whatsapp }))}
              style={[
                styles.channelChip,
                { borderColor: channels.whatsapp ? colors.SUCCESS : colors.BORDER, backgroundColor: channels.whatsapp ? colors.SUCCESS_BG : colors.BG_INPUT },
              ]}
            >
              <MessageCircle size={15} color={channels.whatsapp ? colors.SUCCESS : colors.TEXT_MUTED} />
              <Text style={[styles.channelChipText, { color: channels.whatsapp ? colors.SUCCESS : colors.TEXT_MUTED }]}>
                WhatsApp Direct
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setChannels((c) => ({ ...c, social: !c.social }))}
              style={[
                styles.channelChip,
                { borderColor: channels.social ? colors.INFO : colors.BORDER, backgroundColor: channels.social ? colors.INFO_BG : colors.BG_INPUT },
              ]}
            >
              <Share2 size={15} color={channels.social ? colors.INFO : colors.TEXT_MUTED} />
              <Text style={[styles.channelChipText, { color: channels.social ? colors.INFO : colors.TEXT_MUTED }]}>
                Réseaux Sociaux
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TITRE DE L'ARTICLE */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Titre de l'article *</Text>
          <TextInput
            placeholder="Ex: Sac à Dos Cuir Véritable Marron"
            placeholderTextColor={colors.TEXT_FAINT}
            value={nom}
            onChangeText={handleNomChange}
            style={[
              styles.input,
              {
                backgroundColor: colors.BG_CARD,
                borderColor: colors.BORDER,
                color: colors.TEXT_PRIMARY,
              },
            ]}
          />
        </View>

        {/* GESTION DU SLUG PRODUIT DIRECT */}
        <View style={styles.field}>
          <View style={styles.slugHeader}>
            <View style={styles.slugLabelRow}>
              <LinkIcon size={14} color={colors.ACCENT} />
              <Text style={[styles.label, { color: colors.TEXT_PRIMARY, marginBottom: 0 }]}>
                Identifiant URL (Slug)
              </Text>
            </View>
            {isCustomSlug && (
              <TouchableOpacity onPress={handleSlugReset} style={styles.resetSlugBtn}>
                <RefreshCw size={12} color={colors.ACCENT} />
                <Text style={[styles.resetSlugText, { color: colors.ACCENT }]}>Rétablir Auto</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            placeholder="sac-a-dos-cuir-veritable-marron"
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
                backgroundColor: colors.BG_CARD,
                borderColor: colors.BORDER,
                color: colors.TEXT_PRIMARY,
              },
            ]}
          />
          <Text style={[styles.helperText, { color: colors.TEXT_MUTED }]}>
            Lien direct : /produit/{slug || '...'}
          </Text>
        </View>

        {/* PRIX ET STOCK */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Prix (GNF) *</Text>
            <TextInput
              placeholder="150000"
              placeholderTextColor={colors.TEXT_FAINT}
              value={prix}
              onChangeText={setPrix}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: colors.BG_CARD,
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
            />
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>Stock en rayon</Text>
            <TextInput
              placeholder="10"
              placeholderTextColor={colors.TEXT_FAINT}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: colors.BG_CARD,
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
            />
          </View>
        </View>

        {/* CARROUSEL DE SUPPORTS MULTIMÉDIAS (IMAGES & VIDÉOS) */}
        <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          <View style={styles.mediaCardHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
                Supports Multimédias ({images.length})
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
                La 1ère image est l'image principale de présentation en vitrine.
              </Text>
            </View>
          </View>

          {/* LISTE HORIZONTALE DES SUPPORTS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaCarouselScroll}
          >
            {/* Bouton d'ajout via Galerie */}
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={uploadingImage}
              style={[styles.addMediaThumb, { backgroundColor: colors.BG_INPUT, borderColor: colors.ACCENT }]}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color={colors.ACCENT} />
              ) : (
                <>
                  <ImagePlus size={20} color={colors.ACCENT} />
                  <Text style={[styles.addMediaThumbText, { color: colors.ACCENT }]}>+ Photo</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Bouton d'ajout via URL */}
            <TouchableOpacity
              onPress={() => setShowAddUrlInput(!showAddUrlInput)}
              style={[styles.addMediaThumb, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
            >
              <LinkIcon size={18} color={colors.TEXT_MUTED} />
              <Text style={[styles.addMediaThumbText, { color: colors.TEXT_MUTED }]}>+ URL</Text>
            </TouchableOpacity>

            {/* Miniatures des médias existants */}
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

                  {/* Badge image principale */}
                  {isPrimary && (
                    <View style={[styles.primaryBadge, { backgroundColor: colors.ACCENT }]}>
                      <Star size={10} color="#ffffff" fill="#ffffff" />
                      <Text style={styles.primaryBadgeText}>Principale</Text>
                    </View>
                  )}

                  {/* Actions sur miniature */}
                  <View style={styles.thumbActionsOverlay}>
                    {!isPrimary && (
                      <TouchableOpacity
                        onPress={() => handleSetPrimaryMedia(idx)}
                        style={[styles.thumbActionBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
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

          {/* Saisie d'URL média additionnelle */}
          {showAddUrlInput && (
            <View style={[styles.addUrlBox, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              <TextInput
                placeholder="Coller l'URL de l'image ou vidéo https://..."
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
                <Plus size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ÉDITEUR DE DESCRIPTION WYSIWYG COMPLET */}
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Rédigez la fiche descriptive complète du produit (caractéristiques, matière, avantages, guide des tailles...)"
        />

        {/* MODULE DE BLOCS DE PERSUASION (MAESTRO) */}
        <BlockEditor blocks={blocks} onChange={setBlocks} />

        {/* BOUTON D'ENREGISTREMENT */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={[
            styles.saveBtn,
            { backgroundColor: colors.ACCENT },
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={isDark ? '#060501' : '#ffffff'} />
          ) : (
            <Text style={[styles.saveBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
              {actif ? "Publier l'Article" : 'Enregistrer en Brouillon'}
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
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 160, // Dégagement généreux pour ne jamais masquer les boutons
  },
  card: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
    lineHeight: 16,
  },
  statusToggleRow: {
    flexDirection: 'row',
    borderRadius: RADII.lg,
    padding: 3,
    borderWidth: 1,
    gap: 4,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADII.md,
  },
  statusBtnActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  statusBtnTextBold: {
    fontWeight: '800',
  },
  channelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: RADII.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  channelChipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs + 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    paddingHorizontal: 14,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.base,
  },
  slugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  slugLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resetSlugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  resetSlugText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontStyle: 'italic',
  },
  mediaCardHeader: {
    marginBottom: 4,
  },
  mediaCarouselScroll: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  addMediaThumb: {
    width: 84,
    height: 84,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addMediaThumbText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mediaThumbCard: {
    width: 84,
    height: 84,
    borderRadius: RADII.lg,
    borderWidth: 2,
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
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  primaryBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  thumbActionsOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    gap: 4,
  },
  thumbActionBtn: {
    padding: 5,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addUrlBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: RADII.lg,
    borderWidth: 1,
  },
  addUrlConfirmBtn: {
    padding: 12,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: RADII.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontWeight: '900',
    fontSize: FONT_SIZE.base,
    letterSpacing: -0.2,
  },
});
