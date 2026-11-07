import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProductById, updateProduct } from '../../../lib/products';
import { pickAndUploadImage } from '../../../lib/storage';
import BlockEditor from '../../../components/product/BlockEditor';
import type { ContentBlock } from '../../../types';
import { ImagePlus } from 'lucide-react-native';

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('0');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handlePickImage = async () => {
    setUploadingImage(true);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        setImageUrl(res.url);
      } else if (res.error) {
        Alert.alert('Erreur Upload', res.error);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
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
        <Text style={styles.label}>Image Principale</Text>
        <View style={styles.imagePickerRow}>
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={uploadingImage}
            style={styles.pickBtn}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color="#facc15" />
            ) : (
              <>
                <ImagePlus size={16} color="#facc15" />
                <Text style={styles.pickBtnText}>Choisir Photo</Text>
              </>
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="Ou coller une URL https://..."
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
        </View>
        {imageUrl.trim() ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          </View>
        ) : null}
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
  imagePickerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18160a',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickBtnText: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 12,
  },
  previewContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 80,
    height: 80,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
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
