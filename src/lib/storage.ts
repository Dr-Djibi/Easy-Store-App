import * as ImagePicker from 'expo-image-picker';
import { useSupabaseStore } from '../store/supabaseStore';

export async function pickAndUploadImage(): Promise<{ success: boolean; url?: string; error?: string }> {
  const { client } = useSupabaseStore.getState();
  if (!client) {
    return { success: false, error: 'Supabase n\'est pas encore configuré.' };
  }

  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return { success: false, error: 'Permission d\'accès aux photos refusée.' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false };
    }

    const asset = result.assets[0];
    const fileExt = (asset.uri.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    const { error: uploadError } = await client.storage
      .from('products')
      .upload(filePath, blob, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = client.storage.from('products').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de l\'upload de l\'image.',
    };
  }
}
