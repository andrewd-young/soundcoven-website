import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';

export const useArtists = () => {
  const fetchArtists = async () => {
    const { data, error } = await supabase
      .from('artists')
      .select('*');

    if (error) {
      console.error('Supabase error:', error); // Debug log
      throw error;
    }

    return data.map(artist => ({
      id: artist.id,
      userId: artist.user_id,
      name: artist.name,
      age: artist.age,
      location: artist.location,
      school: artist.school,
      genre: artist.genre,
      type: artist.artist_type,
      yearsActive: artist.years_active,
      influences: artist.influences,
      bio: artist.bio,
      streamingLink: artist.streaming_link,
      image: artist.profile_image_url,
      contactPhone: artist.contact_phone,
      isFeatured: artist.is_featured,
      instagramLink: artist.instagram_link,
    }));
  };

  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: fetchArtists,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
  });

  return {
    artists,
    loading: isLoading,
    error: error?.message
  };
}; 