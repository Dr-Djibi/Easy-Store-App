import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';
import { FormField, LoadingScreen } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useSupabaseStore } from '@/store/supabaseStore';
import { COLORS, SPACING, RADII, FONT_SIZE } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { client, clearConfig } = useSupabaseStore();
  const { form, setForm, loading, saving, load, save } = useSettings();

  useEffect(() => {
    load();
  }, []);

  const handleLogout = () => {
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

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paramètres Boutique</Text>

      <View style={styles.card}>
        <FormField
          label="Nom de la Boutique"
          value={form.storeName}
          onChangeText={(v) => setForm((f) => ({ ...f, storeName: v }))}
        />
        <FormField
          label="Numéro WhatsApp Officiel (avec indicatif)"
          value={form.whatsapp}
          onChangeText={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
          placeholder="Ex: 224600000000"
          keyboardType="phone-pad"
        />
        <FormField
          label="Téléphone d'Appel"
          value={form.phone}
          onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
          placeholder="+224 600 00 00 00"
          keyboardType="phone-pad"
        />
        <FormField
          label="Titre de la Bannière d'Accueil"
          value={form.bannerTitle}
          onChangeText={(v) => setForm((f) => ({ ...f, bannerTitle: v }))}
        />
        <FormField
          label="Sous-Titre de la Bannière"
          value={form.bannerSubtitle}
          onChangeText={(v) => setForm((f) => ({ ...f, bannerSubtitle: v }))}
          multiline
          numberOfLines={2}
          style={styles.textArea}
        />

        <TouchableOpacity
          onPress={save}
          disabled={saving}
          style={[styles.saveBtn, saving && styles.disabled]}
        >
          {saving
            ? <ActivityIndicator color={COLORS.BG_PRIMARY} />
            : <Text style={styles.saveBtnText}>Enregistrer</Text>
          }
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
    padding: SPACING.xl,
    backgroundColor: COLORS.BG_PRIMARY,
    flexGrow: 1,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: COLORS.BG_PRIMARY,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.base,
  },
  dangerZone: {
    gap: SPACING.md,
    marginBottom: SPACING.xxxl,
  },
  changeKeyBtn: {
    backgroundColor: COLORS.BG_INPUT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
  },
  changeKeyText: {
    color: COLORS.ACCENT,
    fontWeight: '600',
    fontSize: FONT_SIZE.sm,
  },
  logoutBtn: {
    backgroundColor: COLORS.DANGER_BG_LIGHT,
    borderWidth: 1,
    borderColor: COLORS.DANGER_BORDER,
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.DANGER,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.sm,
  },
});
