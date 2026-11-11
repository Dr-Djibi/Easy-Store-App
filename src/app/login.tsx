import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Lock, Mail, ArrowRight, ShieldCheck, Settings, Sparkles } from 'lucide-react-native';
import { useSupabaseStore } from '../store/supabaseStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { client } = useSupabaseStore();

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('last_admin_email').then((savedEmail) => {
      if (savedEmail) setEmail(savedEmail);
    });
  }, []);

  const handleAuth = async () => {
    if (!client) {
      Alert.alert('Configuration requise', 'Supabase doit être configuré avant toute tentative de connexion.');
      router.replace('/config');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir votre adresse email professionnelle.');
      return;
    }

    if (authMode !== 'forgot' && !password.trim()) {
      Alert.alert('Champ requis', 'Veuillez renseigner votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signin') {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw new Error(error.message);

        if (data.session) {
          await AsyncStorage.setItem('last_admin_email', email.trim());
          router.replace('/(admin)');
        }
      } else if (authMode === 'signup') {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw new Error(error.message);

        if (data.session) {
          await AsyncStorage.setItem('last_admin_email', email.trim());
          router.replace('/(admin)');
        } else {
          Alert.alert(
            'Compte créé',
            'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.',
            [{ text: 'Compris', onPress: () => setAuthMode('signin') }]
          );
        }
      } else if (authMode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email.trim());
        if (error) throw new Error(error.message);

        Alert.alert(
          'Email envoyé',
          'Un lien de réinitialisation sécurisé a été transmis à votre adresse email.',
          [{ text: 'Retour à la connexion', onPress: () => setAuthMode('signin') }]
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      Alert.alert('Échec de l\'opération', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandContainer}>
          <View style={[styles.badgePill, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
            <ShieldCheck size={14} color={colors.ACCENT} />
            <Text style={[styles.badgePillText, { color: colors.TEXT_MUTED }]}>Espace Marchand Sécurisé</Text>
          </View>
          <Text style={[styles.brandTitle, { color: colors.TEXT_PRIMARY }]}>Easy Store</Text>
          <Text style={[styles.brandSubtitle, { color: colors.TEXT_MUTED }]}>
            {authMode === 'signin' && 'Connectez-vous pour piloter votre catalogue, vos commandes et vos canaux de vente.'}
            {authMode === 'signup' && 'Créez votre accès administrateur pour configurer votre boutique.'}
            {authMode === 'forgot' && 'Indiquez votre email pour recevoir les instructions de récupération de compte.'}
          </Text>
        </View>

        <View style={[styles.authCard, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
          {/* SÉLECTEUR DE MODE DISCRET */}
          <View style={[styles.tabBar, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
            <TouchableOpacity
              onPress={() => setAuthMode('signin')}
              style={[
                styles.tabBtn,
                authMode === 'signin' && [styles.tabBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: authMode === 'signin' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  authMode === 'signin' && styles.tabBtnTextActive,
                ]}
              >
                Connexion
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAuthMode('signup')}
              style={[
                styles.tabBtn,
                authMode === 'signup' && [styles.tabBtnActive, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }],
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: authMode === 'signup' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                  authMode === 'signup' && styles.tabBtnTextActive,
                ]}
              >
                Créer un compte
              </Text>
            </TouchableOpacity>
          </View>

          {/* CHAMP EMAIL */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Courriel professionnel</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
              <Mail size={16} color={colors.TEXT_MUTED} style={styles.inputIcon} />
              <TextInput
                placeholder="nom@boutique.com"
                placeholderTextColor={colors.TEXT_FAINT}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                style={[styles.input, { color: colors.TEXT_PRIMARY }]}
              />
            </View>
          </View>

          {/* CHAMP MOT DE PASSE (MASQUÉ EN FORGOT) */}
          {authMode !== 'forgot' && (
            <View style={styles.fieldGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={[styles.fieldLabel, { color: colors.TEXT_PRIMARY }]}>Mot de passe</Text>
                {authMode === 'signin' && (
                  <TouchableOpacity onPress={() => setAuthMode('forgot')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={[styles.forgotLink, { color: colors.ACCENT }]}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER }]}>
                <Lock size={16} color={colors.TEXT_MUTED} style={styles.inputIcon} />
                <TextInput
                  placeholder="Saisissez votre mot de passe"
                  placeholderTextColor={colors.TEXT_FAINT}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  style={[styles.input, { color: colors.TEXT_PRIMARY }]}
                />
              </View>
            </View>
          )}

          {/* BOUTON D'ACTION PRINCIPAL */}
          <TouchableOpacity
            onPress={handleAuth}
            disabled={loading}
            style={[styles.primarySubmitBtn, { backgroundColor: colors.ACCENT }, loading && styles.btnDisabled]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? '#060501' : '#ffffff'} />
            ) : (
              <View style={styles.btnContentRow}>
                <Text style={[styles.primarySubmitBtnText, { color: isDark ? '#060501' : '#ffffff' }]}>
                  {authMode === 'signin' && 'Accéder au panneau de contrôle'}
                  {authMode === 'signup' && 'Finaliser la création du compte'}
                  {authMode === 'forgot' && 'Transmettre le lien de réinitialisation'}
                </Text>
                <ArrowRight size={16} color={isDark ? '#060501' : '#ffffff'} />
              </View>
            )}
          </TouchableOpacity>

          {authMode === 'forgot' && (
            <TouchableOpacity
              onPress={() => setAuthMode('signin')}
              style={styles.backToSignInBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.backToSignInText, { color: colors.TEXT_MUTED }]}>
                Retour au formulaire d'authentification
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PIED DE PAGE TECHNIQUE */}
        <View style={styles.footerActionRow}>
          <TouchableOpacity
            onPress={() => router.push('/config')}
            style={[styles.configLinkBtn, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}
            activeOpacity={0.7}
          >
            <Settings size={14} color={colors.TEXT_MUTED} />
            <Text style={[styles.configLinkText, { color: colors.TEXT_MUTED }]}>Configuration des identifiants Supabase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  brandContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.full,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  badgePillText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: SPACING.xs,
  },
  brandSubtitle: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
  },
  authCard: {
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.xl,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: RADII.xl,
    borderWidth: 1,
    marginBottom: SPACING.xl,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.lg,
  },
  tabBtnActive: {
    borderWidth: 1,
  },
  tabBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    fontWeight: '800',
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    paddingVertical: 10,
  },
  primarySubmitBtn: {
    borderRadius: RADII.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primarySubmitBtnText: {
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },
  backToSignInBtn: {
    marginTop: SPACING.md,
    alignItems: 'center',
    paddingVertical: 6,
  },
  backToSignInText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  footerActionRow: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  configLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADII.full,
  },
  configLinkText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
