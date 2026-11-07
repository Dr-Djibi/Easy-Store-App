import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSupabaseStore } from '../store/supabaseStore';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { loadConfig, client } = useSupabaseStore();
  const { setSession, setLoading } = useAuthStore();

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }

    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#060501' },
          headerTintColor: '#fef9e7',
          contentStyle: { backgroundColor: '#060501' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="config" options={{ title: 'Liaison Supabase' }} />
        <Stack.Screen name="login" options={{ title: 'Connexion Admin' }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
