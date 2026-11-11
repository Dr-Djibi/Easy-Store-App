import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Sun, Moon, LogOut, KeyRound } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FormField, LoadingScreen } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useSupabaseStore } from '@/store/supabaseStore';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode, isDark } = useAppTheme();
  const { signOut } = useAuthStore();
  const { client } = useSupabaseStore();
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
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.BG_PRIMARY }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Paramètres Boutique</Text>

      {/* SÉLECTEUR DE THÈME */}
      <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Thème de l'Application</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.TEXT_MUTED }]}>
          Basculez entre l'affichage clair et le contraste sombre selon vos préférences.
        </Text>

        <View style={[styles.themeSelectorRow, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
          <TouchableOpacity
            onPress={() => setMode('light')}
            style={[
              styles.themeBtn,
              mode === 'light' && [styles.themeBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.ACCENT }],
            ]}
          >
            <Sun size={18} color={mode === 'light' ? colors.ACCENT : colors.TEXT_MUTED} />
            <Text
              style={[
                styles.themeBtnText,
                { color: mode === 'light' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                mode === 'light' && styles.themeBtnTextBold,
              ]}
            >
              Clair
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('dark')}
            style={[
              styles.themeBtn,
              mode === 'dark' && [styles.themeBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.ACCENT }],
            ]}
          >
            <Moon size={18} color={mode === 'dark' ? colors.ACCENT : colors.TEXT_MUTED} />
            <Text
              style={[
                styles.themeBtnText,
                { color: mode === 'dark' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                mode === 'dark' && styles.themeBtnTextBold,
              ]}
            >
              Sombre
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* COORDONNÉES DE LA BOUTIQUE */}
      <View style={[styles.card, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Identité et Contact</Text>
        
        <FormField
          label="Nom de la Boutique"
          value={form.storeName}
          onChangeText={(v) => setForm((f) => ({ ...f, storeName: v }))}
          placeholder="Ex: Mode Conakry Express"
        />
        <FormField
          label="Numéro WhatsApp Officiel avec indicatif"
          value={form.whatsapp}
          onChangeText={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
          placeholder="Ex: 224600000000"
          keyboardType="phone-pad"
        />
        <FormField
          label="Téléphone d'Appel Direct"
          value={form.phone}
          onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
          placeholder="+224 600 00 00 00"
          keyboardType="phone-pad"
        />
        <FormField
          label="Titre de la Bannière d'Accueil"
          value={form.bannerTitle}
          onChangeText={(v) => setForm((f) => ({ ...f, bannerTitle: v }))}
          placeholder="Ex: Nouveautés Exclusives"
        />
        <FormField
          label="Sous-Titre de la Bannière"
          value={form.bannerSubtitle}
          onChangeText={(v) => setForm((f) => ({ ...f, bannerSubtitle: v }))}
          placeholder="Ex: Livraison express en 24h à domicile"
          multiline
          numberOfLines={2}
          style={styles.textArea}
        />

        <TouchableOpacity
          onPress={save}
          disabled={saving}
          style={[styles.saveBtn, { backgroundColor: colors.ACCENT }, saving && styles.disabled]}
        >
          {saving ? (
            <ActivityIndicator color={isDark ? '#060501' : '#ffffff'} />
          ) : (
            <Text style={[styles.saveBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
              Enregistrer les Réglages
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ZONE CONNEXION ET ACCÈS */}
      <View style={styles.dangerZone}>
        <TouchableOpacity
          onPress={() => router.push('/config')}
          style={[styles.secondaryBtn, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}
        >
          <KeyRound size={16} color={colors.TEXT_MUTED} />
          <Text style={[styles.secondaryBtnText, { color: colors.TEXT_PRIMARY }]}>
            Modifier les Clés Supabase
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutBtn, { backgroundColor: colors.DANGER_BG_LIGHT, borderColor: colors.DANGER_BORDER }]}
        >
          <LogOut size={16} color={colors.DANGER} />
          <Text style={[styles.logoutText, { color: colors.DANGER }]}>
            Se Déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    marginBottom: SPACING.lg,
    letterSpacing: -0.5,
  },
  card: {
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    borderRadius: RADII.xl,
    padding: 4,
    borderWidth: 1,
    gap: 4,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: RADII.lg,
  },
  themeBtnActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  themeBtnTextBold: {
    fontWeight: '800',
  },
  textArea: {
    height: 64,
    textAlignVertical: 'top',
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: RADII.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontWeight: '800',
    fontSize: FONT_SIZE.base,
  },
  dangerZone: {
    gap: SPACING.md,
    marginBottom: SPACING.xxxl,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: RADII.xl,
  },
  secondaryBtnText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: RADII.xl,
  },
  logoutText: {
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },
});
