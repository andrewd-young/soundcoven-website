export interface Instrumentalist {
  id: string;
  userId: string;
  name: string;
  email?: string;
  instrument?: string;
  school?: string;
  favoriteGenres?: string[];
  note?: string;
  profileImageUrl?: string;
  bio?: string;
  years_experience?: number;
  location?: string;
  photo_url?: string;
  equipment?: string[];
  social_links?: Record<string, string>;
  rate?: string;
  created_at?: string;
  updated_at?: string;
}
