import React, { useState } from 'react';

// Define the types for filter config
export type FilterOption = string;
export type FilterType = 'select' | 'search';

export interface SelectFilterConfig {
  type: 'select';
  options: FilterOption[];
}
export interface SearchFilterConfig {
  type: 'search';
}
export type FilterConfig = Record<string, SelectFilterConfig | SearchFilterConfig>;

interface FilterProps {
  filters: FilterConfig;
  onFilterChange: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const Filter = ({ filters, onFilterChange }: FilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string, config: SelectFilterConfig | SearchFilterConfig) => {
    onFilterChange((prev) => {
      if (key === 'location') {
        return {
          ...prev,
          [key]: {
            value: value,
            matches: (itemLocation: string) => {
              if (!value) return true;
              if (!itemLocation) return false;
              const locationParts = itemLocation.split('/').map(loc => loc.trim());
              return locationParts.some(loc => loc === value);
            }
          }
        };
      }
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
                {Array.isArray((config as SelectFilterConfig).options) ? 
                  (config as SelectFilterConfig).options.flatMap(option => {
                    if (typeof option === 'string' && option.includes('/')) {
                      return option.split('/').map(loc => loc.trim());
                    }
                    return option;
                  })
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort()
                  .map(option => (
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

export default Filter;
