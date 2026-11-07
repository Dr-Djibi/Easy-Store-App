import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllSettings, updateSetting } from '../../../lib/settings';
import { useAuthStore } from '../../../store/authStore';
import { useSupabaseStore } from '../../../store/supabaseStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { client } = useSupabaseStore();

  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllSettings().then((s) => {
      setStoreName(s.STORE_NAME || '');
      setWhatsapp(s.WHATSAPP_NUMBER || '');
      setPhone(s.STORE_PHONE || '');
      setBannerTitle(s.STORE_BANNER_TITLE || '');
      setBannerSubtitle(s.STORE_BANNER_SUBTITLE || '');
      setFetching(false);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        updateSetting('STORE_NAME', storeName),
        updateSetting('WHATSAPP_NUMBER', whatsapp),
        updateSetting('STORE_PHONE', phone),
        updateSetting('STORE_BANNER_TITLE', bannerTitle),
        updateSetting('STORE_BANNER_SUBTITLE', bannerSubtitle),
      ]);

      const failed = results.find((r) => !r.success);
      if (failed) {
        throw new Error(failed.error || 'Erreur lors de la sauvegarde.');
      }

      Alert.alert('Succès 🎉', 'Paramètres de la boutique mis à jour !');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder les paramètres.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          try {
            if (client) {
              await client.auth.signOut();
            }
          } catch (e) {
            console.error('Erreur signOut:', e);
          } finally {
            signOut();
            router.replace('/login');
          }
        },
      },
    ]);
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
      <Text style={styles.title}>Paramètres Boutique</Text>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Nom de la Boutique</Text>
          <TextInput
            value={storeName}
            onChangeText={setStoreName}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Numéro WhatsApp Officiel (avec indicatif)</Text>
          <TextInput
            placeholder="Ex: 224600000000"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Téléphone d'Appel</Text>
          <TextInput
            placeholder="+224 600 00 00 00"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Titre de la Bannière d'Accueil</Text>
          <TextInput
            value={bannerTitle}
            onChangeText={setBannerTitle}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Sous-Titre de la Bannière</Text>
          <TextInput
            value={bannerSubtitle}
            onChangeText={setBannerSubtitle}
            multiline
            numberOfLines={2}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={[styles.saveBtn, loading && styles.disabled]}
        >
          {loading ? <ActivityIndicator color="#060501" /> : <Text style={styles.saveBtnText}>Enregistrer</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.dangerZone}>
        <TouchableOpacity onPress={() => router.push('/config')} style={styles.changeKeyBtn}>
          <Text style={styles.changeKeyText}>Modifier les Clés Supabase</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Se Déconnecter</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fef9e7',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#100e04',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
    backgroundColor: '#18160a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    color: '#fef9e7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#060501',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dangerZone: {
    gap: 12,
    marginBottom: 30,
  },
  changeKeyBtn: {
    backgroundColor: '#18160a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  changeKeyText: {
    color: '#facc15',
    fontWeight: '600',
    fontSize: 13,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
