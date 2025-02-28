import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';

export const useIndustryPros = () => {
  const fetchIndustryPros = async () => {
    const { data, error } = await supabase
      .from('industry_professionals')
      .select('*');

    if (error) {
      console.error('Supabase error:', error); // Debug log
      throw error;
    }

    return data.map(pro => ({
      id: pro.id,
      userId: pro.user_id,
      name: pro.name,
      role: pro.role,
      industry_role: pro.industry_role,
      company: pro.company,
      school: pro.school,
      location: pro.location,
      email: pro.email,
      phone: pro.phone,
      profile_image_url: pro.profile_image_url,
      bio: pro.bio,
      favorite_artists: pro.favorite_artists
    }));
  };

  const { data: industryPros = [], isLoading, error } = useQuery({
    queryKey: ['industryPros'],
    queryFn: fetchIndustryPros,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
  });

  return {
    industryPros,
    loading: isLoading,
    error: error?.message
  };
}; 