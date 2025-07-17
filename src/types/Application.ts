
// --- Application Types matching Prisma schema ---

export interface BaseApplication {
  id: string;
  user_id: string;
  application_type: "artist" | "industry" | "instrumentalist";
  name: string;
  email: string;
  school: string;
  note?: string;
  photo_url?: string;
  location?: string;
  bio?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  status_history: Array<{ status: string; timestamp: string; user_id?: string; note?: string }>;
  modification_requests: string[];
  current_revision?: number;
  last_modified_at?: string;
  last_modified_by?: string;
  status: "pending" | "pending_user_approval" | "changes_requested" | "approved" | "rejected" | "finalized";
  admin_approved_profile?: ArtistProfileData | IndustryProfileData | InstrumentalistProfileData | null;
  finalized_at?: string;
  finalized_by?: string;
  user_accepted_at?: string;
  phone_number?: string;
  sent_for_approval_at?: string;
  auto_approval_date?: string;
}

export interface ArtistApplication extends BaseApplication {
  application_type: "artist";
  artist_type?: string;
  genres?: string[];
  streaming_links?: string[];
  upcoming_show?: string;
  influences?: string[];
  current_needs?: string;
  type?: string;
  years_active?: string;
  instagram_link?: string;
}

export interface IndustryApplication extends BaseApplication {
  application_type: "industry";
  industry_role?: string;
  company?: string;
  years_experience?: number;
  expertise_areas?: string[];
  favorite_artists?: string[];
  website?: string;
  linkedin?: string;
  phone?: string;
}

export interface InstrumentalistApplication extends BaseApplication {
  application_type: "instrumentalist";
  instrument?: string;
  years_experience?: number;
  equipment?: string[];
  rate?: string;
  favorite_genres?: string[];
}

// Canonical ApplicationData (used for application records)
export type ApplicationData = ArtistApplication | IndustryApplication | InstrumentalistApplication;

// --- Profile Data Types ---

export interface BaseProfileData {
  name: string;
  photo_url?: string;
  email: string;
  location?: string;
  bio?: string;
  instagram_link?: string;
  streaming_link?: string;
}

export interface ArtistProfileData extends BaseProfileData {
  artist_type?: string;
  genres?: string[];
  streaming_links?: string[];
  influences?: string[];
  years_active?: string;
  current_needs?: string;
  type?: string;
}

export interface IndustryProfileData extends BaseProfileData {
  industry_role?: string;
  company?: string;
  years_experience?: number;
  expertise_areas?: string[];
  favorite_artists?: string[];
  website?: string;
  linkedin?: string;
}

export interface InstrumentalistProfileData extends BaseProfileData {
  instrument?: string;
  years_experience?: number;
  equipment?: string[];
  rate?: string;
}

// Canonical ProfileData (used for admin_approved_profile, etc.)
export type ProfileData = ArtistProfileData | IndustryProfileData | InstrumentalistProfileData;
export type AllProfileKeys = keyof ArtistProfileData | keyof IndustryProfileData | keyof InstrumentalistProfileData;

// FormProps for forms
export interface FormProps {
  onBack: () => void;
  className?: string;
}

// UserProfileData for ApplyForm (user's profile, not application profile)
export interface UserProfileData {
  has_applied: boolean;
  application_id: string | null;
  role: string | null;
  applications: { status: string; application_type: string }[] | null;
}
