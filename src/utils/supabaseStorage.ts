import { supabase } from './supabase';

export const uploadArtistImage = async (file: File, artistId: string, type: 'profile' | 'banner' = 'profile') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${artistId}-${type}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${artistId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('artist-images')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl || '';

    const columnName = type === 'profile' ? 'profile_image_url' : 'banner_image_url';
    const { error: updateError } = await supabase
      .from('artists')
      .update({ [columnName]: publicUrl })
      .eq('id', artistId);
    if (updateError) throw updateError;

    return { publicUrl };
  } catch (error) {
    console.error('Error uploading artist image:', error);
    throw error;
  }
};

export const uploadApplicationImage = async (file: File, applicantId: string, type: 'profile' | 'banner' = 'profile') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}-${type}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${applicantId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('application-photos')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('application-photos')
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl || '';

    return { publicUrl };
  } catch (error) {
    console.error('Error uploading application image:', error);
    throw error;
  }
};