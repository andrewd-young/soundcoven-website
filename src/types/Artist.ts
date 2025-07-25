// Prisma model for artists:
// id: BigInt, user_id: String?, name: String, age: Int?, location: String?, school: String?, artist_type: String?, influences: String[], bio: String?, profile_image_url: String?, contact_phone: String?, is_featured: Boolean?, instagram_link: String?, images_updated_at: DateTime?, email: String?, genres: String[], streaming_links: String[], current_needs: String[], upcoming_shows: String[], social_links: Json?, created_at: DateTime?, updated_at: DateTime?

export interface Artist {
  id: string; // Use string for compatibility with frontend
  user_id?: string;
  name: string;
  age?: number;
  location?: string;
  school?: string;
  artist_type?: string;
  influences: string[];
  bio?: string;
  profile_image_url?: string;
  contact_phone?: string;
  is_featured?: boolean;
  instagram_link?: string;
  images_updated_at?: string;
  email?: string;
  genres: string[];
  streaming_links: string[];
  current_needs?: string[];
  upcoming_shows?: string[];
  social_links?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}
