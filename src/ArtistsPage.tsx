import React, { useState, useMemo } from "react";
import ArtistWideCard from "./components/ArtistWideCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useArtists } from "./hooks/useArtists";

interface Artist {
  id: number;
  userId: string;
  name: string;
  age?: number;
  location?: string;
  genres: string[];
  type?: string;
  school?: string;
  influences: string[];
  profile_image_url?: string;
  contactPhone?: string;
  isFeatured?: boolean;
  instagramLink?: string;
  images_updated_at?: string;
  email?: string;
  streamingLinks: string[];
  current_needs?: string[];
  upcoming_shows?: string[];
  socialLinks?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

const ArtistsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { artists, loading, error } = useArtists();

  const filterConfig = useMemo<FilterConfig>(
    () => ({
      genres: {
        type: "select",
        options: Array.from(new Set(artists.flatMap((artist) => artist.genres))),
      },
      type: {
        type: "select",
        options: Array.from(new Set(artists.map((artist) => artist.type).filter(Boolean))),
      },
      location: {
        type: "select",
        options: Array.from(new Set(artists.map((artist) => artist.location).filter(Boolean))),
      },
      school: {
        type: "select",
        options: Array.from(new Set(artists.map((artist) => artist.school).filter(Boolean))),
      },
      name: { type: "search" },
    }),
    [artists]
  );

  const filteredArtists = useMemo(() => {
    return artists.filter((artist: Artist) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (
          key === 'location' &&
          typeof value === 'object' &&
          value !== null &&
          typeof (value as { matches: (loc: string) => boolean }).matches === 'function'
        ) {
          return (value as { matches: (loc: string) => boolean }).matches(
            artist.location ?? ""
          );
        }
        
        if (key === "name") {
          return artist.name.toLowerCase().includes((value as string).toLowerCase());
        }
        
        // Handle array fields (genres, influences, streamingLinks)
        if (Array.isArray((artist as any)[key])) {
          return ((artist as any)[key] as string[]).some(item => 
            (value as string).toLowerCase().includes(item.toLowerCase())
          );
        }

        return (artist as any)[key] === value;
      });
    });
  }, [artists, filters]);

  if (loading)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Error: {error}
      </div>
    );

  if (!artists?.length)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        No artists found
      </div>
    );

  return (
    <section
      id="artists"
      className="bg-covenPurple text-white pt-0 py-8 px-6 md:px-12 lg:px-24"
    >
      <Filter filters={filterConfig} onFilterChange={setFilters} />
      <div className="flex flex-col gap-6">
        {filteredArtists.map((artist) => (
          <ArtistWideCard key={artist.id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default ArtistsPage;
