import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ArtistWideCard from "./components/ArtistWideCard";
import Filter from "./components/Filter";
import { useArtists } from "./hooks/useArtists";

const ArtistsPage = () => {
  const [filters, setFilters] = useState({});
  const { artists, loading, error } = useArtists();

  const filterConfig = useMemo(
    () => ({
      genre: {
        type: "select",
        options: [...new Set(artists.map((artist) => artist.genre))],
      },
      type: {
        type: "select",
        options: [...new Set(artists.map((artist) => artist.type))],
      },
      location: {
        type: "select",
        options: [...new Set(artists.map((artist) => artist.location))],
      },
      name: { type: "search" },
    }),
    [artists]
  );

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "name")
          return artist.name.toLowerCase().includes(value.toLowerCase());
        return artist[key] === value;
      });
    });
  }, [artists, filters]);

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

  if (!artists?.length)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        No artists found
      </div>
    );

  return (
    <section
      id="artists"
      className="bg-covenPurple text-white pt-0 py-8 px-6 md:px-12 lg:px-24"
    >
      <Filter filters={filterConfig} onFilterChange={setFilters} />
      <div className="flex flex-col gap-6">
        {filteredArtists.map((artist) => (
          <ArtistWideCard key={artist.id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

ArtistsPage.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      age: PropTypes.number,
      location: PropTypes.string,
      genre: PropTypes.string,
      type: PropTypes.string,
      yearsActive: PropTypes.number,
      influences: PropTypes.string,
      image: PropTypes.string,
      streamingLink: PropTypes.string,
      bio: PropTypes.string,
    })
  ).isRequired,
};

export default ArtistsPage;
