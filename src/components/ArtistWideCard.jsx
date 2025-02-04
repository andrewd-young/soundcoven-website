import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { isLightColor } from "../utils/colorUtils";
import Tag from "./common/Tag";
import {
  faMapMarkerAlt,
  faCompactDisc,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { OptimizedImage } from "./common/OptimizedImage";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";
const DEFAULT_COLOR = "#4F1D4D"; // covenLightPurple

const ArtistWideCard = ({ artist }) => {
  const { id, name, genre, location, school } = artist;

  const isUsingDefaultImage = !artist.image;
  const { colors } = useExtractColors(artist.image || DEFAULT_IMAGE, {
    crossOrigin: "anonymous",
    defaultColor: DEFAULT_COLOR,
    skip: isUsingDefaultImage,
  });

  const bgColor = isUsingDefaultImage
    ? DEFAULT_COLOR
    : colors?.[0] || DEFAULT_COLOR;

  if (!artist) {
    return null;
  }

  return (
    <Link
      to={`/artists/${id}`}
      className="block hover:scale-[1.02] transition-transform duration-200"
    >
      <div
        className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg relative"
        style={{ backgroundColor: bgColor }}
      >
        {/* Image Container - Full width on mobile, 1/3 width on desktop */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <OptimizedImage
            src={artist.image || DEFAULT_IMAGE}
            alt={artist.name}
            className="w-full h-auto md:h-full object-cover"
          />
        </div>

        {/* Text Content - Below image on mobile, beside it on desktop */}
        <div
          className={`flex-1 p-6 flex flex-col justify-center min-w-0 ${
            isLightColor(bgColor) ? "text-gray-800" : "text-white"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            {name}
          </h2>
          <div className="flex flex-wrap gap-2 py-1">
            {genre && (
              <Tag
                icon={faCompactDisc}
                text={genre}
                darkMode={!isLightColor(bgColor)}
              />
            )}
            {location && (
              <Tag
                icon={faMapMarkerAlt}
                text={location}
                darkMode={!isLightColor(bgColor)}
              />
            )}
            {school && (
              <Tag
                icon={faSchool}
                text={school}
                darkMode={!isLightColor(bgColor)}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ArtistWideCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    genre: PropTypes.string,
    location: PropTypes.string,
    school: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default ArtistWideCard;
