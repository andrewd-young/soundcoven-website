import React from "react";
import PropTypes from "prop-types";
import ArtistWideCard from "./components/ArtistWideCard";

const ArtistsPage = ({ artists }) => {
  return (
    <section id="artists" className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col gap-6">
        {artists.map((artist, index) => (
          <ArtistWideCard key={index} artist={artist} />
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
    })
  ).isRequired,
};

export default ArtistsPage;