import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProductById, updateProduct } from '../../../lib/products';
import BlockEditor from '../../../components/product/BlockEditor';
import type { ContentBlock } from '../../../types';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('0');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((p) => {
      if (p) {
        setNom(p.nom);
        setPrix(String(p.prix));
        setStock(String(p.stock));
        setDescription(p.description || '');
        setImageUrl(p.images?.[0] || '');
        setBlocks(p.content_blocks || []);
      }
      setFetching(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    if (!nom.trim() || !prix.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez saisir au moins le titre et le prix.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateProduct(id, {
        nom: nom.trim(),
        prix: Number(prix) || 0,
        stock: Number(stock) || 0,
        description: description.trim() || null,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        content_blocks: blocks,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      Alert.alert('Succès 🎉', 'Produit mis à jour !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de mettre à jour le produit.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={{ flex: 1, backgroundColor: '#060501', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#facc15" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le Produit</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Titre du Produit *</Text>
        <TextInput
          value={nom}
          onChangeText={setNom}
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Prix (GNF) *</Text>
          <TextInput
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Stock Disponible</Text>
          <TextInput
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
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />
      </View>

      <BlockEditor blocks={blocks} onChange={setBlocks} />

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={loading}
        style={[styles.saveBtn, loading && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#060501" /> : <Text style={styles.saveBtnText}>Enregistrer les Modifications</Text>}
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
