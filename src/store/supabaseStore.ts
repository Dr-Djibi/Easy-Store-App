import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseStore {
  url: string | null;
  anonKey: string | null;
  serviceKey: string | null;
  client: SupabaseClient | null;
  isConfigured: boolean;
  loadConfig: () => Promise<void>;
  setConfig: (url: string, anonKey: string, serviceKey: string) => Promise<void>;
  clearConfig: () => Promise<void>;
}

export const useSupabaseStore = create<SupabaseStore>((set) => ({
  url: null,
  anonKey: null,
  serviceKey: null,
  client: null,
  isConfigured: false,

  loadConfig: async () => {
    try {
      const url = await AsyncStorage.getItem('sb_url');
      const anonKey = await AsyncStorage.getItem('sb_anon');
      const serviceKey = await AsyncStorage.getItem('sb_service');

      if (url && anonKey) {
        const client = createClient(url, anonKey, {
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
          },
        });
        set({ url, anonKey, serviceKey, client, isConfigured: true });
      }
    } catch (e) {
      console.error('Erreur chargement config Supabase:', e);
    }
  },

  setConfig: async (url: string, anonKey: string, serviceKey: string) => {
    await AsyncStorage.setItem('sb_url', url);
    await AsyncStorage.setItem('sb_anon', anonKey);
    await AsyncStorage.setItem('sb_service', serviceKey);

    const client = createClient(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
      },
    });

    set({ url, anonKey, serviceKey, client, isConfigured: true });
  },

  clearConfig: async () => {
    await AsyncStorage.multiRemove(['sb_url', 'sb_anon', 'sb_service']);
    set({ url: null, anonKey: null, serviceKey: null, client: null, isConfigured: false });
  },
}));
