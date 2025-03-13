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

    return data.map(artist => {
      // Parse social links
      const socialLinks = artist.social_links || {};
      const instagramLink = socialLinks.instagram || 
                           (socialLinks.links ? socialLinks.links.split(',')
                             .find(link => link.trim().includes('instagram.com')) : null);
      return {
        id: artist.id,
        userId: artist.user_id,
        name: artist.name,
        age: artist.age,
        location: artist.location,
        school: artist.school,
        genres: Array.isArray(artist.genres) ? artist.genres :
                (artist.genres ? artist.genres.split(',').map(g => g.trim()) : []),
        type: artist.artist_type,
        yearsActive: artist.years_active,
        influences: Array.isArray(artist.influences) ? artist.influences : 
                   (artist.influences ? artist.influences.split(',').map(i => i.trim()) : []),
        bio: artist.bio,
        streamingLinks: Array.isArray(artist.streaming_links) ? artist.streaming_links : 
                       (artist.streaming_links ? artist.streaming_links.split(',') : []),
        image: artist.profile_image_url,
        contactPhone: artist.contact_phone,
        isFeatured: artist.is_featured,
        instagramLink: instagramLink,
        socialLinks: artist.social_links || {},  // Keep the full social_links object just in case
      };
    });
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