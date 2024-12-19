import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import IndustryCard from './components/IndustryCard';
import Filter from './components/Filter';

const IndustryProsPage = ({ industryPros }) => {
  const [filters, setFilters] = useState({});

  const filterConfig = {
    role: { type: 'select', options: [...new Set(industryPros.map(pro => pro.role))] },
    location: { type: 'select', options: [...new Set(industryPros.map(pro => pro.location))] },
    expertise: { type: 'select', options: [...new Set(industryPros.flatMap(pro => pro.expertise))] },
    name: { type: 'search' },
  };

  const filteredPros = useMemo(() => {
    return industryPros.filter(pro => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'name') return pro.name.toLowerCase().includes(value.toLowerCase());
        if (key === 'expertise') return pro.expertise.includes(value);
        return pro[key] === value;
      });
    });
  }, [industryPros, filters]);

  return (
    <section id="industry-pros" className="text-white py-8 px-6 md:px-12 lg:px-24">
      <Filter filters={filterConfig} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredPros.map((pro, index) => (
          <IndustryCard key={index} pro={pro} />
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
      role: PropTypes.string.isRequired,
      company: PropTypes.string,
      location: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      expertise: PropTypes.arrayOf(PropTypes.string),
      notableClients: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default IndustryProsPage;