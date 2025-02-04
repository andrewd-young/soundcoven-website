import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Filter = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
                className="w-full md:w-48 p-2 rounded bg-white bg-opacity-10 text-white"
                onChange={(e) => onFilterChange((prev) => ({ ...prev, [key]: e.target.value }))}
              >
                <option value="">All {key}s</option>
                {config.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={`Search by ${key}...`}
                className="w-full md:w-48 p-2 rounded bg-white bg-opacity-10 text-white"
                onChange={(e) =>
                  onFilterChange((prev) => ({ ...prev, [key]: e.target.value }))
                }
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
