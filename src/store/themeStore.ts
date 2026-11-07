import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = 'user_theme_preference';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'light', // Priorité 1 : Thème clair par défaut pour accessibilité plein jour

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        set({ mode: saved });
      }
    } catch (e) {
      console.warn('Erreur chargement préférence thème:', e);
    }
  },

  setMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      set({ mode });
    } catch (e) {
      console.warn('Erreur sauvegarde thème:', e);
    }
  },

  toggleTheme: async () => {
    const nextMode = get().mode === 'light' ? 'dark' : 'light';
    await get().setMode(nextMode);
  },
}));
