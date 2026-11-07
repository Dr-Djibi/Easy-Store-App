import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getAllSettings, updateSetting } from '@/lib/settings';

interface SettingsForm {
  storeName: string;
  whatsapp: string;
  phone: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

export function useSettings() {
  const [form, setForm] = useState<SettingsForm>({
    storeName: '',
    whatsapp: '',
    phone: '',
    bannerTitle: '',
    bannerSubtitle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getAllSettings();
      setForm({
        storeName: s.STORE_NAME || '',
        whatsapp: s.WHATSAPP_NUMBER || '',
        phone: s.STORE_PHONE || '',
        bannerTitle: s.STORE_BANNER_TITLE || '',
        bannerSubtitle: s.STORE_BANNER_SUBTITLE || '',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const results = await Promise.all([
        updateSetting('STORE_NAME', form.storeName),
        updateSetting('WHATSAPP_NUMBER', form.whatsapp),
        updateSetting('STORE_PHONE', form.phone),
        updateSetting('STORE_BANNER_TITLE', form.bannerTitle),
        updateSetting('STORE_BANNER_SUBTITLE', form.bannerSubtitle),
      ]);
      const failed = results.find((r) => !r.success);
      if (failed) {
        throw new Error(failed.error || 'Erreur lors de la sauvegarde.');
      }
      Alert.alert('Succès 🎉', 'Paramètres de la boutique mis à jour !');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder les paramètres.');
    } finally {
      setSaving(false);
    }
  }, [form]);

  return { form, setForm, loading, saving, load, save };
}
