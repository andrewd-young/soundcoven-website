import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";
const DEFAULT_COLOR = "#4F1D4D"; // covenLightPurple

const ArtistWideCard = ({ artist }) => {
  const {
    id,
    name,
    genre,
    artist_type,
    location,
    profile_image_url,
    banner_image_url,
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
      <div className="bg-[#432347] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-row-reverse">
          <div className="relative h-72 w-72 flex-shrink-0">
            <img
              src={artist.image || DEFAULT_IMAGE}
              alt={artist.name}
              className="w-full h-full object-cover rounded-l-lg"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
            {banner_image_url && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-l-lg" />
            )}
          </div>
          <div className="p-8 flex-grow">
            <h3 className="text-5xl font-bold mb-6">{name}</h3>
            <div className="space-y-2 text-gray-300 text-lg">
              {genre && <p>Genre: {genre}</p>}
              {artist_type && <p>Type: {artist_type}</p>}
              {location && <p>Location: {location}</p>}
              {school && <p>School: {school}</p>}
            </div>
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
    artist_type: PropTypes.string,
    location: PropTypes.string,
    profile_image_url: PropTypes.string,
    banner_image_url: PropTypes.string,
    school: PropTypes.string,
  }).isRequired,
};

export default ArtistWideCard;
