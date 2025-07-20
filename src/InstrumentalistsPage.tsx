import React, { useState, useMemo } from "react";
import InstrumentalistCard from "./components/InstrumentalistCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useInstrumentalists } from "./hooks/useInstrumentalists";
import { Instrumentalist } from "./types/Instrumentalist";

const InstrumentalistsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { instrumentalists, loading, error } = useInstrumentalists();

  const validInstrumentalists = useMemo(() => instrumentalists.filter(i => typeof i.userId === 'string') as Instrumentalist[], [instrumentalists]);

  const filterConfig: FilterConfig = useMemo(
    () => ({
      instrument: {
        type: "select",
        options: Array.from(new Set(validInstrumentalists.map((pro) => pro.instrument).filter((v): v is string => typeof v === 'string'))),
      },
      school: {
        type: "select",
        options: Array.from(new Set(validInstrumentalists.map((pro) => pro.school).filter((v): v is string => typeof v === 'string'))),
      },
      name: { type: "search" },
    }),
    [validInstrumentalists]
  );

  const filteredInstrumentalists = useMemo(() => {
    return validInstrumentalists.filter((instrumentalist: Instrumentalist) => {
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
        if (Array.isArray((instrumentalist as unknown as Record<string, unknown>)[key])) {
          return ((instrumentalist as unknown as Record<string, unknown>)[key] as string[]).some(item => 
            (value as string).toLowerCase().includes(item.toLowerCase())
          );
        }

        return (instrumentalist as unknown as Record<string, unknown>)[key] === value;
      });
    });
  }, [validInstrumentalists, filters]);

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