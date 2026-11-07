import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { ArrowUp, ArrowDown, Trash2, ImagePlus } from 'lucide-react-native';
import { pickAndUploadImage } from '../../lib/storage';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import type { ContentBlock } from '../../types';

export default function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const { colors, isDark } = useAppTheme();
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'titre+texte+image',
      titre: '',
      texte: '',
      imageUrl: '',
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, patch: Partial<ContentBlock>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const handlePickBlockImage = async (index: number) => {
    setUploadingIdx(index);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        updateBlock(index, { imageUrl: res.url });
      } else if (res.error) {
        Alert.alert('Erreur Upload', res.error);
      }
    } finally {
      setUploadingIdx(null);
    }
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
        Blocs de Persuasion (Rich-Content Maestro)
      </Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_MUTED }]}>
        Structurez une page de vente persuasive avec des titres percutants, des preuves et des visuels.
      </Text>

      {blocks.map((block, idx) => (
        <View
          key={block.id}
          style={[
            styles.blockCard,
            {
              backgroundColor: colors.BG_CARD,
              borderColor: colors.BORDER,
              shadowColor: colors.TEXT_PRIMARY,
              shadowOpacity: isDark ? 0 : 0.04,
              elevation: isDark ? 0 : 1,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.blockNumber, { color: colors.ACCENT }]}>Bloc d'argumentaire #{idx + 1}</Text>
            <View style={styles.actionsRow}>
              {idx > 0 && (
                <TouchableOpacity
                  onPress={() => moveUp(idx)}
                  style={[styles.iconBtn, { backgroundColor: colors.BG_INPUT }]}
                >
                  <ArrowUp size={16} color={colors.ACCENT} />
                </TouchableOpacity>
              )}
              {idx < blocks.length - 1 && (
                <TouchableOpacity
                  onPress={() => moveDown(idx)}
                  style={[styles.iconBtn, { backgroundColor: colors.BG_INPUT }]}
                >
                  <ArrowDown size={16} color={colors.ACCENT} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => removeBlock(idx)}
                style={[styles.iconBtn, { backgroundColor: colors.DANGER_BG_LIGHT }]}
              >
                <Trash2 size={16} color={colors.DANGER} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Grand Titre d'accroche (bénéfice client)"
            placeholderTextColor={colors.TEXT_FAINT}
            value={block.titre || ''}
            onChangeText={(txt) => updateBlock(idx, { titre: txt })}
            style={[
              styles.input,
              {
                backgroundColor: colors.BG_INPUT,
                borderColor: colors.BORDER,
                color: colors.TEXT_PRIMARY,
              },
            ]}
          />

          <TextInput
            placeholder="Texte de vente / Paragraphe explicatif persuasif..."
            placeholderTextColor={colors.TEXT_FAINT}
            value={block.texte || ''}
            onChangeText={(txt) => updateBlock(idx, { texte: txt })}
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.BG_INPUT,
                borderColor: colors.BORDER,
                color: colors.TEXT_PRIMARY,
              },
            ]}
            multiline
            numberOfLines={4}
          />

          <View style={styles.imagePickerRow}>
            <TouchableOpacity
              onPress={() => handlePickBlockImage(idx)}
              disabled={uploadingIdx === idx}
              style={[
                styles.pickBtn,
                {
                  backgroundColor: colors.BG_INPUT,
                  borderColor: colors.ACCENT,
                },
              ]}
            >
              {uploadingIdx === idx ? (
                <ActivityIndicator size="small" color={colors.ACCENT} />
              ) : (
                <>
                  <ImagePlus size={15} color={colors.ACCENT} />
                  <Text style={[styles.pickBtnText, { color: colors.ACCENT }]}>Photo</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Ou URL de l'image d'illustration"
              placeholderTextColor={colors.TEXT_FAINT}
              value={block.imageUrl || ''}
              onChangeText={(txt) => updateBlock(idx, { imageUrl: txt })}
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
          </View>

          {/* Aperçu image isolé sans débordement */}
          {block.imageUrl ? (
            <View style={[styles.previewWrapper, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              <View style={styles.previewImageContainer}>
                <Image source={{ uri: block.imageUrl }} style={styles.imagePreview} resizeMode="cover" />
              </View>
              <TouchableOpacity
                onPress={() => updateBlock(idx, { imageUrl: '' })}
                style={styles.removeBlockImageBtn}
              >
                <Trash2 size={13} color={colors.DANGER} />
                <Text style={[styles.removeBlockImageText, { color: colors.DANGER }]}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ))}

      <TouchableOpacity
        onPress={addBlock}
        style={[
          styles.addBtn,
          {
            borderColor: colors.ACCENT,
            backgroundColor: colors.ACCENT_BG,
          },
        ]}
      >
        <Text style={[styles.addBtnText, { color: colors.ACCENT }]}>+ Ajouter un bloc d'argumentaire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  blockCard: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  blockNumber: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
    borderRadius: RADII.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  imagePickerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pickBtnText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },
  previewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 6,
    borderRadius: RADII.lg,
    borderWidth: 1,
  },
  previewImageContainer: {
    width: 48,
    height: 48,
    borderRadius: RADII.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeBlockImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeBlockImageText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  addBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: RADII.xl,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },
});
