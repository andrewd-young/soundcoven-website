import React, { useState, useMemo } from "react";
import IndustryCard from "./components/IndustryCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useIndustryPros } from "./hooks/useIndustryPros";

import { IndustryProfessional } from "./types/IndustryProfessional";

const IndustryProsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { industryPros, loading, error } = useIndustryPros();

  const filterConfig: FilterConfig = useMemo(
    () => ({
      role: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.role).filter(Boolean))) as string[],
      },
      location: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.location).filter(Boolean))) as string[],
      },
      school: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.school).filter(Boolean))) as string[],
      },
      name: { type: "search" },
    }),
    [industryPros]
  );

  const filteredPros = useMemo(() => {
    // Filter out entries missing required properties
    const validPros = industryPros.filter(
      (pro): pro is IndustryProfessional =>
        pro &&
        Array.isArray(pro.expertise_areas) &&
        typeof pro.name === "string" &&
        typeof pro.role === "string"
    );
    return validPros.filter((pro) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        // Location filter (string or custom matcher)
        if (key === "location") {
          if (typeof value === "string") {
            return (pro.location ?? '').toLowerCase() === value.toLowerCase();
          }
            if (
            typeof value === "object" &&
            value !== null &&
            typeof (value as { matches: () => boolean }).matches === "function"
            ) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return (value as { matches: (loc: string) => boolean }).matches(pro.location ?? '');
            }
        }

        // Name filter
        if (key === "name" && typeof value === "string") {
          return pro.name.toLowerCase().includes(value.toLowerCase());
        }

        // Array fields
        if (
          (key === "expertise_areas" || key === "favorite_artists") &&
          (key === "expertise_areas" && Array.isArray(pro.expertise_areas) && typeof value === "string") ||
          (key === "favorite_artists" && Array.isArray(pro.favorite_artists) && typeof value === "string")
        ) {
          const arr =
            key === "expertise_areas"
              ? pro.expertise_areas
              : key === "favorite_artists"
              ? pro.favorite_artists
              : [];
          return arr.some((item) => item.toLowerCase().includes(value.toLowerCase()));
        }

        // Default equality
        return (pro as IndustryProfessional)[key as keyof IndustryProfessional] === value;
      });
    });
  }, [industryPros, filters]);

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

  if (!industryPros?.length)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        No industry professionals found
      </div>
    );

  return (
    <section
      id="industry-pros"
      className="bg-covenPurple text-white pt-0 py-8 px-6 md:px-12 lg:px-24"
    >
      <Filter filters={filterConfig} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredPros.map((pro) => (
          <IndustryCard
            key={pro.id}
            pro={{
              ...pro,
              // Ensure all required fields have fallback values
              role: pro.role || "Role not specified",
              company: pro.company || "",
              location: pro.location || "Location not specified",
              email: pro.email || "Email not specified",
              phone: pro.phone || "Phone not specified",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default IndustryProsPage;
