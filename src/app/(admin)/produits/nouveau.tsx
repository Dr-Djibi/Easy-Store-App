import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createProduct } from '../../../lib/products';
import { generateSlug } from '../../../lib/utils';
import BlockEditor from '../../../components/product/BlockEditor';
import type { ContentBlock } from '../../../types';

export default function NewProductScreen() {
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nom.trim() || !prix.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez saisir au moins le titre et le prix.');
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(nom.trim());
      const res = await createProduct({
        nom: nom.trim(),
        slug,
        prix: Number(prix) || 0,
        stock: Number(stock) || 0,
        description: description.trim() || null,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        content_blocks: blocks,
        actif: true,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un Produit</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Titre du Produit *</Text>
        <TextInput
          placeholder="Ex: Montre Luxe Quartz Or"
          placeholderTextColor="rgba(254, 249, 231, 0.4)"
          value={nom}
          onChangeText={setNom}
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Prix (GNF) *</Text>
          <TextInput
            placeholder="150000"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Stock Disponible</Text>
          <TextInput
            placeholder="10"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description Courte</Text>
        <TextInput
          placeholder="Accroche synthétique pour les fiches produits"
          placeholderTextColor="rgba(254, 249, 231, 0.4)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Image Principale (URL)</Text>
        <TextInput
          placeholder="https://..."
          placeholderTextColor="rgba(254, 249, 231, 0.4)"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />
      </View>

      {/* Module Blocs Persuasion */}
      <BlockEditor blocks={blocks} onChange={setBlocks} />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={[styles.saveBtn, loading && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#060501" /> : <Text style={styles.saveBtnText}>Publier sur le site Web</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#060501',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fef9e7',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fef9e7',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    color: '#fef9e7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#060501',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
