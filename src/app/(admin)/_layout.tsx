import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function AdminLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.BG_PRIMARY,
        },
        headerTintColor: colors.TEXT_PRIMARY,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.NAV_ACTIVE,
        tabBarInactiveTintColor: colors.NAV_INACTIVE,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 14,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 28,
          backgroundColor: colors.NAV_BG,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: colors.NAV_BORDER,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 16,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <Ionicons name={focused ? 'grid' : 'grid-outline'} color={color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <Ionicons name={focused ? 'bag-handle' : 'bag-handle-outline'} color={color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="produits"
        options={{
          title: 'Produits',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <Ionicons name={focused ? 'cube' : 'cube-outline'} color={color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reglages"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={20} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
