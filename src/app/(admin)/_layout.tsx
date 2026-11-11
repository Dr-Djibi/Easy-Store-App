import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { LayoutDashboard, ShoppingBag, Package, Settings } from 'lucide-react-native';
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
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: -0.3,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.NAV_ACTIVE,
        tabBarInactiveTintColor: colors.NAV_INACTIVE,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 14,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 24,
          backgroundColor: colors.NAV_BG,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: colors.NAV_BORDER,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.35 : 0.06,
          shadowRadius: 14,
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          headerTitle: 'Tableau de bord',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <LayoutDashboard size={20} color={color} strokeWidth={focused ? 2.3 : 1.8} />
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
              <Package size={20} color={color} strokeWidth={focused ? 2.3 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="commandes/index"
        options={{
          title: 'Commandes',
          headerTitle: 'Commandes',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <ShoppingBag size={20} color={color} strokeWidth={focused ? 2.3 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reglages/index"
        options={{
          title: 'Paramètres',
          headerTitle: 'Paramètres',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && { backgroundColor: colors.ACCENT_BG }]}>
              <Settings size={20} color={color} strokeWidth={focused ? 2.3 : 1.8} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    minWidth: 44,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
