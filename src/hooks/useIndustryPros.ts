import { useQuery } from "@tanstack/react-query";

import type { IndustryProfessional } from "../types/IndustryProfessional";
import supabase from "../utils/supabase";

interface RawIndustryProfessionalData {
  id: number;
  user_id?: string;
  name: string;
  role?: string;
  company?: string;
  school?: string;
  location?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  bio?: string;
  industry_role?: string;
  years_experience?: number;
  social_links?: Record<string, string> | string;
  created_at?: string;
  updated_at?: string;
  expertise_areas?: string | string[];
  favorite_artists?: string | string[];
}

export const useIndustryPros = () => {
  const fetchIndustryPros = async (): Promise<IndustryProfessional[]> => {
    const { data, error } = await supabase
      .from("industry_professionals")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return data.map((pro: RawIndustryProfessionalData) => ({
      id: pro.id,
      userId: pro.user_id ?? "",
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
      favorite_artists: Array.isArray(pro.favorite_artists)
        ? pro.favorite_artists
        : typeof pro.favorite_artists === "string"
          ? pro.favorite_artists.split(",").map((a: string) => a.trim())
          : [],
      expertise_areas: Array.isArray(pro.expertise_areas)
        ? pro.expertise_areas
        : typeof pro.expertise_areas === "string"
          ? pro.expertise_areas.split(",").map((a: string) => a.trim())
          : [],
      social_links: Array.isArray(pro.social_links)
        ? pro.social_links
        : typeof pro.social_links === "string"
          ? pro.social_links.split(",").map((a: string) => a.trim())
          : [],
      created_at: pro.created_at,
      updated_at: pro.updated_at,
    }));
  };

  const {
    data: industryPros = [],
    isLoading,
    error,
  } = useQuery<IndustryProfessional[], Error>({
    queryKey: ["industryPros"],
    queryFn: fetchIndustryPros,
    staleTime: 5 * 60 * 1000,
  });

  return {
    industryPros,
    loading: isLoading,
    error: error?.message,
  };
};
