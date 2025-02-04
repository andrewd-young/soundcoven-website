import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';

export const useInstrumentalists = () => {
  const fetchInstrumentalists = async () => {
    const { data, error } = await supabase
      .from('instrumentalists')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data.map(instrumentalist => ({
      id: instrumentalist.id,
      userId: instrumentalist.user_id,
      name: instrumentalist.name,
      email: instrumentalist.email,
      instrument: instrumentalist.instrument,
      school: instrumentalist.school,
      favoriteGenres: instrumentalist.favorite_genres,
      note: instrumentalist.note,
      profileImageUrl: instrumentalist.profile_image_url,
    }));
  };

  const { data: instrumentalists = [], isLoading, error } = useQuery({
    queryKey: ['instrumentalists'],
    queryFn: fetchInstrumentalists,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
  });

  return {
    instrumentalists,
    loading: isLoading,
    error: error?.message
  };
}; 