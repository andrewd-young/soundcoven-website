import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCompactDisc,
  faUser,
  faClock,
  faMusic,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
// import {
//   faSoundcloud,
//   faSpotify,
//   faItunes,
// } from "@fortawesome/free-brands-svg-icons";

const ArtistBio = ({ artists }) => {
  const { artistName } = useParams();
  const artist = artists.find((a) => a.name === artistName);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <section id="artist-bio" className="bg-covenPurple text-white py-8 px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h2 className="text-6xl font-bold mb-6">{artist.name}</h2>
          <p className="text-base mb-4">{artist.bio}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6" />{" "}
              {artist.location}
            </span>
            <span className="tag">
              <FontAwesomeIcon icon={faCompactDisc} className="w-6" />{" "}
              {artist.genre}
            </span>
            <span className="tag">
              <FontAwesomeIcon icon={faUser} className="w-6" /> {artist.age}{" "}
              years old
            </span>
            <span className="tag">
              <FontAwesomeIcon icon={faUsers} className="w-6" /> {artist.type}
            </span>
            <span className="tag">
              <FontAwesomeIcon icon={faClock} className="w-6" />{" "}
              {artist.yearsActive} years active
            </span>
            <span className="tag">
              <FontAwesomeIcon icon={faMusic} className="w-6" /> Influences:{" "}
              {artist.influences}
            </span>
          </div>
          {/* <div className="flex gap-4 mb-4">
            <a
              href={artist.soundcloudLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faSoundcloud} className="w-8 h-8" />
            </a>
            <a
              href={artist.spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faSpotify} className="w-8 h-8" />
            </a>
            <a
              href={artist.appleMusicLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faItunes} className="w-8 h-8" />
            </a>
          </div> */}
        </div>
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
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
      age: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      yearsActive: PropTypes.number.isRequired,
      influences: PropTypes.string.isRequired,
      soundcloudLink: PropTypes.string,
      spotifyLink: PropTypes.string,
      appleMusicLink: PropTypes.string,
    })
  ).isRequired,
};

export default ArtistBio;
