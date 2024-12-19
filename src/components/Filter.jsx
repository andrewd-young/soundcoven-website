import React, { useState } from 'react';
import PropTypes from 'prop-types';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Filter = ({ filters, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-container mb-6">
      <div className="flex flex-wrap gap-4">
        {Object.entries(filters).map(([filterName, filterOptions]) => (
          <div key={filterName} className="filter-group mb-4">
            <h3 className="text-lg font-semibold mb-2">{capitalizeFirstLetter(filterName)}</h3>
            {filterOptions.type === 'select' && (
              <select
                className="p-2 bg-covenLightPurple text-white rounded"
                onChange={(e) => handleFilterChange(filterName, e.target.value)}
                value={activeFilters[filterName] || ''}
              >
                <option value="">All</option>
                {filterOptions.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {filterOptions.type === 'search' && (
              <input
                type="text"
                className="p-2 bg-covenLightPurple text-white rounded"
                placeholder={`Search ${capitalizeFirstLetter(filterName)}...`}
                onChange={(e) => handleFilterChange(filterName, e.target.value)}
                value={activeFilters[filterName] || ''}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(activeFilters).map(([filterName, filterValue]) => (
          filterValue && (
            <div key={filterName} className="tag">
              {capitalizeFirstLetter(filterName)}: {filterValue}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

Filter.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
