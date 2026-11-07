import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react-native';
import type { ContentBlock } from '../../types';

export default function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
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
      <Text style={styles.sectionTitle}>Blocs de Persuasion (Rich-Content)</Text>
      <Text style={styles.subtitle}>
        Ajoutez des blocs pour structurer une page de vente persuasive (type Maestro).
      </Text>

      {blocks.map((block, idx) => (
        <View key={block.id} style={styles.blockCard}>
          <View style={styles.headerRow}>
            <Text style={styles.blockNumber}>Bloc #{idx + 1}</Text>
            <View style={styles.actionsRow}>
              {idx > 0 && (
                <TouchableOpacity onPress={() => moveUp(idx)} style={styles.iconBtn}>
                  <ArrowUp size={16} color="#facc15" />
                </TouchableOpacity>
              )}
              {idx < blocks.length - 1 && (
                <TouchableOpacity onPress={() => moveDown(idx)} style={styles.iconBtn}>
                  <ArrowDown size={16} color="#facc15" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => removeBlock(idx)} style={[styles.iconBtn, styles.deleteBtn]}>
                <Trash2 size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Grand Titre d'accroche (optionnel)"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={block.titre || ''}
            onChangeText={(txt) => updateBlock(idx, { titre: txt })}
            style={styles.input}
          />

          <TextInput
            placeholder="Texte de vente / Paragraphe explicatif"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={block.texte || ''}
            onChangeText={(txt) => updateBlock(idx, { texte: txt })}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />

          <TextInput
            placeholder="URL de l'image d'illustration"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={block.imageUrl || ''}
            onChangeText={(txt) => updateBlock(idx, { imageUrl: txt })}
            style={styles.input}
          />
        </View>
      ))}

      <TouchableOpacity onPress={addBlock} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Ajouter un bloc de contenu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fef9e7',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(254, 249, 231, 0.65)',
    marginBottom: 12,
  },
  blockCard: {
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  blockNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#facc15',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#18160a',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  input: {
    backgroundColor: '#18160a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    color: '#fef9e7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#facc15',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.05)',
  },
  addBtnText: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
