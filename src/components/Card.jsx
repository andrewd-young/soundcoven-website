import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useExtractColors } from "react-extract-colors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const Card = ({ artist, className = "", styles = {} }) => {
  const { dominantColor } = useExtractColors(artist.image);
  const bgColor = dominantColor || "#fff";


  if (!artist) {
    return null; // or return some fallback UI
  }

  return (
    <Link to={`/artists/${artist.name}`}
      className={`bg-gray-100 rounded-lg shadow-md ${className}`}
      style={{ ...styles, height: '500px', width: '320px', backgroundColor: bgColor }}
    >
      <img 
        src={artist.image} 
        alt={artist.name} 
        className="mb-6" 
        style={{ 
          width: '100%', height: '315px', objectFit: 'cover', borderTopRightRadius: '0.5rem', borderTopLeftRadius: '0.5rem' }} 
      />
      <div className="mx-4 mb-6" style={{overflow: 'hidden' }}>
        <h3 className="font-bold text-4xl">{artist.name}</h3>
      </div>
      <p className="card-text mx-4 my-3">
        <FontAwesomeIcon icon={faMapMarkerAlt} className='w-7' /> {artist.location}
      </p>
      <p className="card-text mx-4 my-3" >
        <FontAwesomeIcon icon={faCompactDisc} className='w-7' /> {artist.genre}
      </p>
    </Link>
  );
};

Card.propTypes = {
  artist: PropTypes.object.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object
};

export default Card;