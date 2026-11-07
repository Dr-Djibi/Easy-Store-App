import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSupabaseStore } from '../store/supabaseStore';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useThemeStore } from '@/store/themeStore';

export default function RootLayout() {
  const { loadConfig, client } = useSupabaseStore();
  const { setSession, setLoading } = useAuthStore();
  const { colors, isDark } = useAppTheme();
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    loadTheme();
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
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.BG_PRIMARY },
          headerTintColor: colors.TEXT_PRIMARY,
          contentStyle: { backgroundColor: colors.BG_PRIMARY },
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
