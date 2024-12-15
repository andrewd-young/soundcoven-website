import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const WideCard = ({ artist }) => {
  const { dominantColor } = useExtractColors(artist.image);
  const bgColor = dominantColor || "#fff";

  if (!artist) {
    return null; // or return some fallback UI
  }

  return (
    <Link to={`/artists/${artist.name}`} className="h-80 rounded-lg shadow-md pl-6 w-full mb-4 flex flex-col md:flex-row-reverse items-center" style={{ backgroundColor: bgColor }}>
      <img src={artist.image} alt={artist.name} className="mb-4 md:mb-0 md:w-1/3 h-full md:h-full md:ml-0" style={{ width: '560px', objectFit: 'cover', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }} />
      <div className="flex flex-col w-full md:w-2/3">
        <h3 className="text-4xl font-bold mb-2">{artist.name}</h3>
        <p className="text-lg mb-1"><FontAwesomeIcon icon={faMapMarkerAlt} /> {artist.location}</p>
        <p className="text-lg"> <FontAwesomeIcon icon={faCompactDisc} /> {artist.genre}</p>
      </div>
    </Link>
  );
};
WideCard.propTypes = {
  artist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string,
    genre: PropTypes.string,
  }).isRequired,
};

export default WideCard;