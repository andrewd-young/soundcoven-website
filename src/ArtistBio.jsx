import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";

const ArtistBio = ({ artists }) => {
  const { artistName } = useParams();
  const artist = artists.find((a) => a.name === artistName);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <section id="artist-bio" className="bg-covenPurple text-white py-8 px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-6xl font-bold mb-6">{artist.name}</h2>
          <p className="text-base mb-4">{artist.bio}</p>
          <p className="text-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {artist.location}
          </p>
          <p className="text-lg">
            <FontAwesomeIcon icon={faCompactDisc} /> {artist.genre}
          </p>
        </div>
      </div>
    </section>
  );
};
ArtistBio.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ArtistBio;
