import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import InstrumentalistCard from "./components/InstrumentalistCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useInstrumentalists } from "./hooks/useInstrumentalists";

const InstrumentalistsPage = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { instrumentalists, loading, error } = useInstrumentalists();

  const filterConfig = useMemo<FilterConfig>(
    () => ({
      instrument: {
        type: "select",
        options: [
          ...new Set(instrumentalists.map((pro) => pro.instrument).filter(Boolean)),
        ],
      },
      school: {
        type: "select",
        options: [
          ...new Set(instrumentalists.map((pro) => pro.school).filter(Boolean)),
        ],
      },
      name: { type: "search" },
    }),
    [instrumentalists]
  );

  const filteredInstrumentalists = useMemo(() => {
    return instrumentalists.filter((instrumentalist) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle special location filter object
        if (
          key === 'location' &&
          typeof value === 'object' &&
          value !== null &&
          'matches' in value &&
          typeof (value as { matches: (loc: string) => boolean }).matches === 'function'
        ) {
            return (value as { matches: (loc: string) => boolean }).matches(
              (instrumentalist as any).location ?? ""
            );
        }
        
        // Handle name search
        if (key === "name") {
          return instrumentalist.name.toLowerCase().includes((value as string).toLowerCase());
        }
        
        // Handle other filters
        return instrumentalist[key as keyof typeof instrumentalist] === value;
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