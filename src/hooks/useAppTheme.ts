import { useThemeStore } from '@/store/themeStore';
import { THEME_LIGHT, THEME_DARK } from '@/constants/theme';

export function useAppTheme() {
  const { mode, setMode, toggleTheme } = useThemeStore();
  const colors = mode === 'dark' ? THEME_DARK : THEME_LIGHT;
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,
    colors,
    setMode,
    toggleTheme,
  };
}
