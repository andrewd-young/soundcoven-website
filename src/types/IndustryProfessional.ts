export interface IndustryProfessional {
  id: number; // <-- Change from string to number
  name: string;
  industry_role?: string;
  role?: string;
  company?: string;
  years_experience?: number;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  school?: string;
  favorite_artists: string[];
  expertise_areas: string[];
  social_links?: string[];
  profile_image_url?: string;
  userId: string;
  created_at?: string;
  updated_at?: string;
}
