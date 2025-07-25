import { useQuery } from "@tanstack/react-query";

import { Artist } from "../types/Artist";
import supabase from "../utils/supabase";

interface RawArtistData {
  id: string;
  user_id: string;
  name: string;
  age?: number;
  location?: string;
  school?: string;
  artist_type?: string;
  influences: string | string[];
  bio?: string;
  profile_image_url?: string;
  contact_phone?: string;
  is_featured?: boolean;
  instagram_link?: string;
  images_updated_at?: string;
  email?: string;
  genres: string | string[];
  streaming_links: string | string[];
  current_needs: string | string[];
  upcoming_shows: string | string[];
  social_links?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  years_active?: number;
}

export const useArtists = () => {
  const fetchArtists = async (): Promise<Artist[]> => {
    const { data, error } = await supabase.from("artists").select("*");

    if (error) {
      console.error("Supabase error:", error); // Debug log
      throw error;
    }

    return data.map((artist: RawArtistData) => {
      const social_links = artist.social_links || {};
      return {
        id: artist.id,
        user_id: artist.user_id,
        name: artist.name,
        age: artist.age,
        location: artist.location,
        school: artist.school,
        artist_type: artist.artist_type,
        influences: Array.isArray(artist.influences)
          ? artist.influences
          : artist.influences
            ? artist.influences.split(",").map((i: string) => i.trim())
            : [],
        bio: artist.bio,
        profile_image_url: artist.profile_image_url,
        contact_phone: artist.contact_phone,
        is_featured: artist.is_featured,
        instagram_link: artist.instagram_link,
        images_updated_at: artist.images_updated_at,
        email: artist.email,
        genres: Array.isArray(artist.genres)
          ? artist.genres
          : artist.genres
            ? artist.genres.split(",").map((g: string) => g.trim())
            : [],
        streaming_links: Array.isArray(artist.streaming_links)
          ? artist.streaming_links
          : artist.streaming_links
            ? (artist.streaming_links as string)
                .split(",")
                .map((s: string) => s.trim())
            : [],
        current_needs: Array.isArray(artist.current_needs)
          ? artist.current_needs
          : artist.current_needs
            ? (artist.current_needs as string)
                .split(",")
                .map((s: string) => s.trim())
            : undefined,
        upcoming_shows: Array.isArray(artist.upcoming_shows)
          ? artist.upcoming_shows
          : artist.upcoming_shows
            ? (artist.upcoming_shows as string)
                .split(",")
                .map((s: string) => s.trim())
            : undefined,
        social_links: social_links,
        created_at: artist.created_at,
        updated_at: artist.updated_at,
      };
    });
  };

  const {
    data: artists = [],
    isLoading,
    error,
  } = useQuery<Artist[], Error>({
    queryKey: ["artists"],
    queryFn: fetchArtists,
    staleTime: 5 * 60 * 1000,
  });

  return {
    artists,
    loading: isLoading,
    error: error?.message,
  };
};
