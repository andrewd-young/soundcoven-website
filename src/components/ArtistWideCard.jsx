import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";

const WideCard = ({ artist }) => {
  const { dominantColor } = useExtractColors(artist.image);
  const bgColor = dominantColor || "#fff";

  if (!artist) {
    return null; // or return some fallback UI
  }

  return (
    <Link
      to={`/artists/${artist.name}`}
      className="h-auto rounded-lg shadow-md w-full mb-4 flex flex-col md:flex-row-reverse items-center"
      style={{ backgroundColor: bgColor }}
    >
      <img
        src={artist.image}
        alt={artist.name}
        className="w-full md:w-1/3 h-auto md:h-full mb-4 md:mb-0"
        style={{
          objectFit: "cover",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          borderBottomLeftRadius: "0.5rem",
        }}
      />
      <div className="flex flex-col w-full md:w-2/3 p-6">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{artist.name}</h3>
        <div>
          <p className="card-text my-3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-7" />{" "}
            {artist.location}
          </p>
          <p className="card-text my-3">
            <FontAwesomeIcon icon={faCompactDisc} className="w-7" />{" "}
            {artist.genre}
          </p>
        </div>
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
