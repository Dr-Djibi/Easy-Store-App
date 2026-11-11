import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  FileText,
  MoveUp,
  MoveDown,
  Layers,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import { pickAndUploadImage } from '@/lib/storage';
import type { ContentBlock } from '@/types';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES = [
  { type: 'titre' as const, label: 'Titre d\'impact', icon: Type },
  { type: 'texte' as const, label: 'Paragraphe', icon: FileText },
  { type: 'image' as const, label: 'Bannière visuelle', icon: ImageIcon },
  { type: 'titre+texte' as const, label: 'Titre et Argumentaire', icon: Layers },
  { type: 'titre+texte+image' as const, label: 'Bloc promotionnel complet', icon: Layers },
];

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const { colors } = useAppTheme();
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      titre: '',
      texte: '',
      imageUrl: '',
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;

    const copy = [...blocks];
    const [moved] = copy.splice(index, 1);
    copy.splice(nextIndex, 0, moved);
    onChange(copy);
  };

  const handlePickBlockImage = async (id: string) => {
    setUploadingBlockId(id);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        updateBlock(id, { imageUrl: res.url });
      } else if (res.error) {
        Alert.alert('Erreur', res.error);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger l\'image.');
    } finally {
      setUploadingBlockId(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
            Blocs de Contenu Enrichis
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
            Structurez votre page produit avec des sections visuelles.
          </Text>
        </View>
      </View>

      {/* LISTE DES BLOCS EXISTANTS */}
      {blocks.map((block, index) => {
        const hasTitre = block.type.includes('titre');
        const hasTexte = block.type.includes('texte');
        const hasImage = block.type.includes('image');

        return (
          <View
            key={block.id}
            style={[styles.blockCard, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
          >
            {/* EN-TÊTE DU BLOC */}
            <View style={[styles.blockHeader, { borderBottomColor: colors.BORDER }]}>
              <View style={styles.blockTitleRow}>
                <Layers size={15} color={colors.ACCENT} />
                <Text style={[styles.blockTypeName, { color: colors.TEXT_PRIMARY }]}>
                  {BLOCK_TYPES.find((b) => b.type === block.type)?.label || block.type}
                </Text>
              </View>

              <View style={styles.blockActions}>
                <TouchableOpacity
                  onPress={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  style={[styles.actionBtn, index === 0 && styles.disabledBtn]}
                >
                  <MoveUp size={14} color={index === 0 ? colors.TEXT_FAINT : colors.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  style={[styles.actionBtn, index === blocks.length - 1 && styles.disabledBtn]}
                >
                  <MoveDown size={14} color={index === blocks.length - 1 ? colors.TEXT_FAINT : colors.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeBlock(block.id)} style={styles.actionBtn}>
                  <Trash2 size={14} color={colors.DANGER} />
                </TouchableOpacity>
              </View>
            </View>

            {/* CONTENU DU BLOC SELON SON TYPE */}
            <View style={styles.blockBody}>
              {hasTitre && (
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.TEXT_MUTED }]}>Titre de la section</Text>
                  <TextInput
                    placeholder="Grand Titre d'accroche et bénéfice client"
                    placeholderTextColor={colors.TEXT_FAINT}
                    value={block.titre || ''}
                    onChangeText={(v) => updateBlock(block.id, { titre: v })}
                    style={[styles.input, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
                  />
                </View>
              )}

              {hasTexte && (
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.TEXT_MUTED }]}>Texte explicatif</Text>
                  <TextInput
                    placeholder="Détaillez les caractéristiques remarquables..."
                    placeholderTextColor={colors.TEXT_FAINT}
                    value={block.texte || ''}
                    onChangeText={(v) => updateBlock(block.id, { texte: v })}
                    multiline
                    style={[styles.textArea, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
                  />
                </View>
              )}

              {hasImage && (
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.TEXT_MUTED }]}>Image illustrative</Text>

                  {block.imageUrl ? (
                    <View style={[styles.imagePreviewWrap, { borderColor: colors.BORDER }]}>
                      <Image source={{ uri: block.imageUrl }} style={styles.imagePreview} resizeMode="cover" />
                      <TouchableOpacity
                        onPress={() => updateBlock(block.id, { imageUrl: '' })}
                        style={styles.deleteImageBtn}
                      >
                        <Trash2 size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handlePickBlockImage(block.id)}
                      disabled={uploadingBlockId === block.id}
                      style={[styles.uploadBox, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
                    >
                      {uploadingBlockId === block.id ? (
                        <ActivityIndicator size="small" color={colors.ACCENT} />
                      ) : (
                        <>
                          <ImageIcon size={20} color={colors.ACCENT} />
                          <Text style={[styles.uploadText, { color: colors.TEXT_PRIMARY }]}>
                            Sélectionner une photo
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}

      {/* BOUTONS D'AJOUT DE BLOC */}
      <View style={styles.addButtonsContainer}>
        <Text style={[styles.addLabel, { color: colors.TEXT_MUTED }]}>Ajouter un bloc :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addButtonsScroll}>
          {BLOCK_TYPES.map((bt) => {
            const Icon = bt.icon;
            return (
              <TouchableOpacity
                key={bt.type}
                onPress={() => addBlock(bt.type)}
                style={[styles.addTypeBtn, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
                activeOpacity={0.7}
              >
                <Plus size={13} color={colors.ACCENT} />
                <Icon size={14} color={colors.TEXT_PRIMARY} />
                <Text style={[styles.addTypeBtnText, { color: colors.TEXT_PRIMARY }]}>{bt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  blockCard: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blockTypeName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  blockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
    borderRadius: RADII.sm,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  blockBody: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: FONT_SIZE.sm,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: FONT_SIZE.sm,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: RADII.md,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  imagePreviewWrap: {
    borderWidth: 1,
    borderRadius: RADII.md,
    overflow: 'hidden',
    position: 'relative',
    height: 140,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  deleteImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    padding: 6,
    borderRadius: RADII.sm,
  },
  addButtonsContainer: {
    marginTop: 4,
    gap: 8,
  },
  addLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  addButtonsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  addTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
  },
  addTypeBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
