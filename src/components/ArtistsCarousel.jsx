import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";

const ArtistsCarousel = ({ artists }) => {
  return (
    <section id="artists" className="bg-covenPurple text-white py-8 px-24">
      <h2 className="text-2xl font-bold mb-6">Artists You Might Like</h2>
      <div className="flex space-x-4 overflow-x-scroll">
        {artists.map((artist, index) => (
          <Card key={index} artist={artist} className="w-64 flex-shrink-0 bg-teal-900 text-white" />
        ))}
      </div>
    </section>
  );
};
ArtistsCarousel.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      // Add other artist properties here
    })
  ).isRequired,
};

export default ArtistsCarousel;