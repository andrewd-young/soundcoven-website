import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';

interface RawInstrumentalistData {
  id: number;
  user_id?: string;
  name: string;
  email?: string;
  instrument?: string;
  school?: string;
  favorite_genres: string | string[];
  note?: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  years_experience?: number;
  location?: string;
  photo_url?: string;
  equipment: string | string[];
  social_links?: Record<string, any>;
  rate?: string;
}

interface Instrumentalist {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  instrument?: string;
  school?: string;
  favoriteGenres: string[];
  note?: string;
  profileImageUrl?: string;
  bio?: string;
  years_experience?: number;
  location?: string;
  photo_url?: string;
  equipment: string[];
  social_links?: Record<string, any>;
  rate?: string;
}

export const useInstrumentalists = () => {
  const fetchInstrumentalists = async (): Promise<Instrumentalist[]> => {
    const { data, error } = await supabase
      .from('instrumentalists')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data.map((instrumentalist: RawInstrumentalistData) => ({
      id: String(instrumentalist.id),
      userId: instrumentalist.user_id,
      name: instrumentalist.name,
      email: instrumentalist.email,
      instrument: instrumentalist.instrument,
      school: instrumentalist.school,
      favoriteGenres: Array.isArray(instrumentalist.favorite_genres) ? instrumentalist.favorite_genres : (instrumentalist.favorite_genres ? instrumentalist.favorite_genres.split(',').map((g: string) => g.trim()) : []),
      note: instrumentalist.note,
      profileImageUrl: instrumentalist.profile_image_url,
      bio: instrumentalist.bio,
      years_experience: instrumentalist.years_experience,
      location: instrumentalist.location,
      photo_url: instrumentalist.photo_url,
      equipment: Array.isArray(instrumentalist.equipment) ? instrumentalist.equipment : (instrumentalist.equipment ? instrumentalist.equipment.split(',').map((e: string) => e.trim()) : []),
      social_links: instrumentalist.social_links || {},
      rate: instrumentalist.rate,
    }));
  };

  const { data: instrumentalists = [], isLoading, error } = useQuery<Instrumentalist[], Error>({
    queryKey: ['instrumentalists'],
    queryFn: fetchInstrumentalists,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    instrumentalists,
    loading: isLoading,
    error: error?.message
  };
}; 