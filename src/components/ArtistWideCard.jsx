import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { isLightColor } from "../utils/colorUtils";
import Tag from "./common/Tag";
import { faMapMarkerAlt, faCompactDisc, faSchool } from "@fortawesome/free-solid-svg-icons";
import { OptimizedImage } from "./common/OptimizedImage";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";
const DEFAULT_COLOR = "#4F1D4D"; // covenLightPurple

const ArtistWideCard = ({ artist }) => {
  const {
    id,
    name,
    genre,
    location,
    school,
  } = artist;

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
        className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <div className="md:w-1/3">
          <OptimizedImage
            src={artist.image || DEFAULT_IMAGE}
            alt={artist.name}
            width={400}
            height={300}
            className="w-full h-48 md:h-full"
            objectFit="cover"
          />
        </div>
        <div className={`flex-1 p-6 flex flex-col justify-center ${isLightColor(bgColor) ? 'text-gray-800' : 'text-white'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-8">{name}</h2>
          
          <div className="flex flex-wrap gap-4 py-2">
            {genre && <Tag icon={faCompactDisc} text={genre} darkMode={!isLightColor(bgColor)} />}
            {location && <Tag icon={faMapMarkerAlt} text={location} darkMode={!isLightColor(bgColor)} />}
            {school && <Tag icon={faSchool} text={school} darkMode={!isLightColor(bgColor)} />}
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
  }).isRequired,
};

export default ArtistWideCard;