import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Filter = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value, config) => {
    onFilterChange((prev) => {
      if (key === 'location') {
        // For location, we'll pass both the selected value and a comparison function
        return {
          ...prev,
          [key]: {
            value: value,
            matches: (itemLocation) => {
              if (!value) return true; // If no filter value, match everything
              if (!itemLocation) return false; // If no item location, don't match
              
              // Split the item's location string and check if any part matches the filter value
              const locationParts = itemLocation.split('/').map(loc => loc.trim());
              return locationParts.some(loc => loc === value);
            }
          }
        };
      }
      // For other filters, keep the original behavior
      return { ...prev, [key]: value };
    });
  };

  return (
    <div className="mb-8">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden w-full bg-white bg-opacity-10 text-white py-2 px-4 rounded mb-2 text-left flex justify-between items-center"
      >
        Filters
        <span>{isExpanded ? '▼' : '▶'}</span>
      </button>
      <div className={`${isExpanded ? 'flex' : 'hidden'} md:flex flex-wrap gap-4`}>
        {Object.entries(filters).map(([key, config]) => (
          <div key={key} className="w-full md:w-auto">
            {config.type === "select" ? (
              <select
                className="w-full md:w-48 p-2 rounded bg-white bg-opacity-10 text-white h-10"
                onChange={(e) => handleFilterChange(key, e.target.value, config)}
              >
                <option value="">All {key}s</option>
                {Array.isArray(config.options) ? 
                  config.options.flatMap(option => {
                    // If the option contains multiple locations, split them
                    if (typeof option === 'string' && option.includes('/')) {
                      return option.split('/').map(loc => loc.trim());
                    }
                    return option;
                  })
                  // Remove duplicates and sort
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort()
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                : null}
              </select>
            ) : (
              <input
                type="text"
                placeholder={`Search by ${key}...`}
                className="w-full md:w-48 p-2 rounded bg-white bg-opacity-10 text-white h-10"
                onChange={(e) => handleFilterChange(key, e.target.value, config)}
              />
            )}
          </div>
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
