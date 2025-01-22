import { supabase } from './supabaseClient';

export const uploadArtistImage = async (file, artistId, type = 'profile') => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${artistId}-${type}-${Math.random()}.${fileExt}`;
    const filePath = `${artistId}/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('artist-images')
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath);

    // Update the artist record with the new image URL
    const columnName = type === 'profile' ? 'profile_image_url' : 'banner_image_url';
    const { error: updateError } = await supabase
      .from('artists')
      .update({ [columnName]: publicUrl })
      .eq('id', artistId);

    if (updateError) throw updateError;

    return { publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadApplicationPhoto = async (file, applicantId, type = 'profile') => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}-${type}-${Math.random()}.${fileExt}`;
    const filePath = `${applicantId}/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('application-photos')
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('application-photos')
      .getPublicUrl(filePath);

    return { publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 