import React from 'react';
import { Redirect } from 'expo-router';
import { useSupabaseStore } from '../store/supabaseStore';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isConfigured } = useSupabaseStore();
  const { session, isLoading } = useAuthStore();

  if (isLoading && isConfigured) {
    return (
      <View style={{ flex: 1, backgroundColor: '#060501', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#facc15" />
      </View>
    );
  }

  if (!isConfigured) {
    return <Redirect href="/config" />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(admin)" />;
}
