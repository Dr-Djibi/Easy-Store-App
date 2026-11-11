import { useState } from 'react';
import { Alert } from 'react-native';
import { getAllSettings, updateSetting } from '@/lib/settings';

export function useSettings() {
  const [form, setForm] = useState({
    storeName: '',
    whatsapp: '',
    phone: '',
    bannerTitle: '',
    bannerSubtitle: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllSettings();
      setForm({
        storeName: data.STORE_NAME || '',
        whatsapp: data.WHATSAPP_NUMBER || '',
        phone: data.STORE_PHONE || '',
        bannerTitle: data.STORE_BANNER_TITLE || '',
        bannerSubtitle: data.STORE_BANNER_SUBTITLE || '',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const entries: [string, string][] = [
        ['STORE_NAME', form.storeName],
        ['WHATSAPP_NUMBER', form.whatsapp],
        ['STORE_PHONE', form.phone],
        ['STORE_BANNER_TITLE', form.bannerTitle],
        ['STORE_BANNER_SUBTITLE', form.bannerSubtitle],
      ];

      for (const [k, v] of entries) {
        const res = await updateSetting(k, v);
        if (!res.success) {
          throw new Error(res.error || 'Erreur lors de la mise à jour.');
        }
      }

      Alert.alert('Succès', 'Paramètres de la boutique mis à jour.');
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setSaving(false);
    }
  };

  return { form, setForm, loading, saving, load, save };
}
