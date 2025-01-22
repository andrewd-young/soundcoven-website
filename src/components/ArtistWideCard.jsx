import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";
const DEFAULT_COLOR = "#4F1D4D"; // covenLightPurple

const WideCard = ({ artist }) => {
  const isUsingDefaultImage = !artist.image;
  const { colors } = useExtractColors(artist.image || DEFAULT_IMAGE, {
    crossOrigin: "anonymous",
    defaultColor: DEFAULT_COLOR,
    skip: isUsingDefaultImage, // Skip extraction if using default image
  });

  const bgColor = isUsingDefaultImage
    ? DEFAULT_COLOR
    : colors?.[0] || DEFAULT_COLOR;

  if (!artist) {
    return null;
  }

  return (
    <Link
      to={`/artists/${artist.id}`}
      className="h-auto rounded-lg shadow-md w-full mb-4 flex flex-col md:flex-row-reverse items-center transition-colors duration-200"
      style={{ backgroundColor: bgColor }}
    >
      <img
        src={artist.image || DEFAULT_IMAGE}
        alt={artist.name}
        className="w-full md:w-1/3 h-auto md:h-full mb-4 md:mb-0"
        onError={(e) => {
          e.target.src = DEFAULT_IMAGE;
        }}
        style={{
          objectFit: "cover",
          borderRadius: "0.5rem",
        }}
      />
      <div className="flex flex-col w-full md:w-2/3 p-6">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          {artist.name}
        </h3>
        <div>
          <p className="card-text my-3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-7" />{" "}
            {artist.location || "Location not specified"}
          </p>
          <p className="card-text my-3">
            <FontAwesomeIcon icon={faCompactDisc} className="w-7" />{" "}
            {artist.genre || "Genre not specified"}
          </p>
        </div>
      </div>
    </Link>
  );
};

WideCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    location: PropTypes.string,
    genre: PropTypes.string,
  }).isRequired,
};

export default WideCard;
