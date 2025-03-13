import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import IndustryCard from "./components/IndustryCard";
import Filter from "./components/Filter";
import { useIndustryPros } from "./hooks/useIndustryPros";

const IndustryProsPage = () => {
  const [filters, setFilters] = useState({});
  const { industryPros, loading, error } = useIndustryPros();

  const filterConfig = useMemo(
    () => ({
      role: {
        type: "select",
        options: [
          ...new Set(industryPros.map((pro) => pro.role).filter(Boolean)),
        ],
      },
      location: {
        type: "select",
        options: [
          ...new Set(industryPros.map((pro) => pro.location).filter(Boolean)),
        ],
      },
      school: {
        type: "select",
        options: [
          ...new Set(industryPros.map((pro) => pro.school).filter(Boolean)),
        ],
      },
      name: { type: "search" },
    }),
    [industryPros]
  );

  const filteredPros = useMemo(() => {
    return industryPros.filter((pro) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle special location filter object
        if (key === 'location' && typeof value === 'object') {
          return value.matches(pro.location);
        }
        
        // Handle name search
        if (key === "name") {
          return pro.name.toLowerCase().includes(value.toLowerCase());
        }
        
        // Handle other filters
        return pro[key] === value;
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

IndustryProsPage.propTypes = {
  industryPros: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      company: PropTypes.string,
      school: PropTypes.string,
      location: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      profile_image_url: PropTypes.string,
      bio: PropTypes.string,
      // These will be added later
      // expertise: PropTypes.arrayOf(PropTypes.string),
      // notableClients: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default IndustryProsPage;
