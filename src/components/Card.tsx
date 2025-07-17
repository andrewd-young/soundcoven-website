import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";
import OptimizedImage from "./common/OptimizedImage";
import { Artist } from "../types/Artist";

const Card = ({ artist, className = "", styles = {} }: { artist: Artist; className?: string; styles?: React.CSSProperties }) => {
  const { dominantColor } = useExtractColors(artist.profile_image_url || "");
  const bgColor = dominantColor || "#fff";

  if (!artist) {
    return null; // or return some fallback UI
  }

  return (
    <Link
      to={`/artists/${artist.name}`}
      className={`bg-gray-100 rounded-lg shadow-md ${className}`}
      style={{
        ...styles,
        height: "500px",
        width: "320px",
        backgroundColor: bgColor,
      }}
    >
      <OptimizedImage
        src={artist.profile_image_url || ""}
        alt={artist.name}
        width={320}
        height={315}
        className="mb-6"
        objectFit="cover"
      />
      <div className="mx-4 mb-6" style={{ overflow: "hidden" }}>
        <h3 className="font-bold text-4xl">{artist.name}</h3>
      </div>
      <p className="card-text mx-4 my-3">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-7" />{" "}
        {artist.location}
      </p>
      <p className="card-text mx-4 my-3">
        <FontAwesomeIcon icon={faCompactDisc} className="w-7" /> {artist.genres.join(", ")}
      </p>
    </Link>
  );
};

Card.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profile_image_url: PropTypes.string,
    location: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

export default Card;
