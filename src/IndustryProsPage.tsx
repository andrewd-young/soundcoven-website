import React, { useState, useMemo } from "react";
import IndustryCard from "./components/IndustryCard";
import Filter, { FilterConfig } from "./components/Filter";
import { useIndustryPros } from "./hooks/useIndustryPros";

interface IndustryProfessional {
  id: number;
  userId: string;
  name: string;
  role?: string;
  company?: string;
  school?: string;
  location?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  bio?: string;
  industry_role?: string;
  years_experience?: number;
  social_links?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  expertise_areas?: string[];
  favorite_artists?: string[];
}

const IndustryProsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const { industryPros, loading, error } = useIndustryPros();

  const filterConfig: FilterConfig = useMemo(
    () => ({
      role: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.role).filter(Boolean))),
      },
      location: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.location).filter(Boolean))),
      },
      school: {
        type: "select",
        options: Array.from(new Set(industryPros.map((pro) => pro.school).filter(Boolean))),
      },
      name: { type: "search" },
    }),
    [industryPros]
  );

  const filteredPros = useMemo(() => {
    return industryPros.filter((pro: IndustryProfessional) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (
          key === 'location' &&
          typeof value === 'object' &&
          value !== null &&
          typeof (value as { matches: (loc: string) => boolean }).matches === 'function'
        ) {
          return (value as { matches: (loc: string) => boolean }).matches(
            pro.location ?? ""
          );
        }
        
        if (key === "name") {
          return pro.name.toLowerCase().includes((value as string).toLowerCase());
        }
        
        // Handle array fields (expertise_areas, favorite_artists)
        if (Array.isArray((pro as any)[key])) {
          return ((pro as any)[key] as string[]).some(item => 
            (value as string).toLowerCase().includes(item.toLowerCase())
          );
        }

        return (pro as any)[key] === value;
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
