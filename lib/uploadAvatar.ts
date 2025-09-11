import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadAvatarImage(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'Image must be smaller than 5MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };

  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteAvatarImage(url: string): Promise<boolean> {
  try {
    // Extract the path from the URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'avatars');
    
    if (bucketIndex === -1 || bucketIndex === urlParts.length - 1) {
      return false; // Not a valid avatar URL from our storage
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected delete error:', error);
    return false;
  }
}
