import React, { useState, useMemo } from "react";
import InstrumentalistCard from "./components/InstrumentalistCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useInstrumentalists } from "./hooks/useInstrumentalists";

interface Instrumentalist {
  id: number;
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
  social_links?: Record<string, any>;
  rate?: string;
  created_at?: string;
  updated_at?: string;
}

const InstrumentalistsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { instrumentalists, loading, error } = useInstrumentalists();

  const filterConfig: FilterConfig = useMemo(
    () => ({
      instrument: {
        type: "select",
        options: Array.from(new Set(instrumentalists.map((pro) => pro.instrument).filter(Boolean))),
      },
      school: {
        type: "select",
        options: Array.from(new Set(instrumentalists.map((pro) => pro.school).filter(Boolean))),
      },
      name: { type: "search" },
    }),
    [instrumentalists]
  );

  const filteredInstrumentalists = useMemo(() => {
    return instrumentalists.filter((instrumentalist: Instrumentalist) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (
          key === 'location' &&
          typeof value === 'object' &&
          value !== null &&
          typeof (value as { matches: (loc: string) => boolean }).matches === 'function'
        ) {
            return (value as { matches: (loc: string) => boolean }).matches(
              instrumentalist.location ?? ""
            );
        }
        
        if (key === "name") {
          return instrumentalist.name.toLowerCase().includes((value as string).toLowerCase());
        }
        
        // Handle array fields (favoriteGenres, equipment)
        if (Array.isArray((instrumentalist as any)[key])) {
          return ((instrumentalist as any)[key] as string[]).some(item => 
            (value as string).toLowerCase().includes(item.toLowerCase())
          );
        }

        return (instrumentalist as any)[key] === value;
      });
    });
  }, [instrumentalists, filters]);

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

  if (!instrumentalists?.length)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        No instrumentalists found
      </div>
    );

  return (
    <section
      id="instrumentalists"
      className="bg-covenPurple text-white pt-0 py-8 px-6 md:px-12 lg:px-24"
    >
      <Filter filters={filterConfig} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredInstrumentalists.map((instrumentalist) => (
          <InstrumentalistCard
            key={instrumentalist.id}
            instrumentalist={instrumentalist}
          />
        ))}
      </div>
    </section>
  );
};

export default InstrumentalistsPage; 