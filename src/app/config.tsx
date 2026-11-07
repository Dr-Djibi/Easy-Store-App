import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSupabaseStore } from '../store/supabaseStore';
import { createClient } from '@supabase/supabase-js';

export default function ConfigScreen() {
  const router = useRouter();
  const { setConfig } = useSupabaseStore();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  const [loading, setLoading] = useState(false);

  const testAndSave = async () => {
    if (!url.trim() || !anonKey.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir au moins l\'URL Supabase et l\'Anon Key.');
      return;
    }

    setLoading(true);
    try {
      const testClient = createClient(url.trim(), anonKey.trim());
      const { error } = await testClient.from('settings').select('key').limit(1);

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      await setConfig(url.trim(), anonKey.trim(), serviceKey.trim());
      Alert.alert('Succès 🎉', 'Votre boutique est maintenant connectée à Supabase !', [
        { text: 'Continuer', onPress: () => router.replace('/login') },
      ]);
    } catch (err: unknown) {
      Alert.alert('Échec de la connexion', err instanceof Error ? err.message : 'Impossible de contacter la base de données.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lier votre Boutique</Text>
        <Text style={styles.subtitle}>
          Renseignez vos clés de projet Supabase pour piloter votre boutique à distance en toute indépendance.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>URL du Projet Supabase *</Text>
          <TextInput
            placeholder="https://xyzproject.supabase.co"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Clé Publique (Anon Key) *</Text>
          <TextInput
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={anonKey}
            onChangeText={setAnonKey}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Clé Secrète (Service Role Key - optionnel)</Text>
          <TextInput
            placeholder="Clé admin pour contourner les restrictions d'upload"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={serviceKey}
            onChangeText={setServiceKey}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={testAndSave}
          disabled={loading}
          style={[styles.btn, loading && styles.btnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#060501" />
          ) : (
            <Text style={styles.btnText}>Tester & Sauvegarder</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#060501',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fef9e7',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(254, 249, 231, 0.65)',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fef9e7',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#18160a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    color: '#fef9e7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#facc15',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#060501',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
