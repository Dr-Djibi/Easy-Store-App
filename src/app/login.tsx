import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSupabaseStore } from '../store/supabaseStore';

export default function LoginScreen() {
  const router = useRouter();
  const { client } = useSupabaseStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Pré-remplir automatiquement le dernier email utilisé
  useEffect(() => {
    AsyncStorage.getItem('last_admin_email').then((savedEmail) => {
      if (savedEmail) setEmail(savedEmail);
    });
  }, []);

  const handleLogin = async () => {
    if (!client) {
      Alert.alert('Erreur', 'Supabase n\'est pas encore configuré.');
      router.replace('/config');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir votre email et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        // Mémoriser l'email pour le confort de connexion
        await AsyncStorage.setItem('last_admin_email', email.trim());
        router.replace('/(admin)');
      }
    } catch (err: unknown) {
      Alert.alert('Échec de connexion', err instanceof Error ? err.message : 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Easyphy</Text>
        <Text style={styles.subtitle}>Gérez vos produits, commandes et stocks en direct sur WhatsApp et le Web.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Adresse Email</Text>
          <TextInput
            placeholder="admin@easystore.com"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            placeholder="••••••••••••"
            placeholderTextColor="rgba(254, 249, 231, 0.4)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[styles.btn, loading && styles.btnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#060501" />
          ) : (
            <Text style={styles.btnText}>Se Connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/config')}
          style={styles.changeConfigBtn}
        >
          <Text style={styles.changeConfigText}>Changer l'URL / Clés Supabase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#060501',
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
  changeConfigBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  changeConfigText: {
    color: '#facc15',
    fontSize: 13,
    fontWeight: '600',
  },
});
