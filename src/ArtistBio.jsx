import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useArtists } from "./hooks/useArtists";
import {
  faMapMarkerAlt,
  faCompactDisc,
  faUser,
  faClock,
  faMusic,
  faUsers,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faSpotify, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Tag from "./components/common/Tag";
import { AuthImage } from "./components/common/AuthImage";
import MetaTags from "./components/MetaTags";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";

const SocialButton = ({
  icon,
  text,
  link,
  primary = false,
  instagram = false,
}) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
      primary
        ? "bg-green-600 hover:bg-green-700"
        : instagram
        ? "bg-[#DD2A7B] hover:bg-[#C1246C]"
        : "bg-teal-900 hover:bg-teal-800"
    } transition-colors duration-200`}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
    {text}
  </a>
);

const ArtistBio = () => {
  const { artistId } = useParams();
  const { artists, loading, error } = useArtists();

  if (loading)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Error: {error}
      </div>
    );

  const artist = artists.find((a) => a.id === parseInt(artistId));

  if (!artist) {
    return <Navigate to="/artists" replace />;
  }

  return (
    <>
      <MetaTags
        title={`${artist.name} - Coven`}
        description={artist.bio || "No bio available"}
        image={artist.image || DEFAULT_IMAGE}
        type="profile"
      />
      <section
        id="artist-bio"
        className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h2 className="text-6xl font-bold mb-6">{artist.name}</h2>
            <p className="text-lg mb-8 leading-relaxed">
              {artist.bio || "No bio available"}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {artist.streamingLinks.map((link, index) => (
                <SocialButton
                  key={index}
                  icon={faSpotify}
                  text={`Listen`}
                  link={link}
                  primary
                />
              ))}
              {artist.instagramLink && (
                <SocialButton
                  icon={faInstagram}
                  text="Follow"
                  link={artist.instagramLink}
                  instagram
                />
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-4 mb-4">
              {artist.location && (
                <Tag
                  icon={faMapMarkerAlt}
                  text={artist.location}
                  darkMode={false}
                />
              )}
              {artist.genres && artist.genres.length > 0 && (
                <Tag
                  icon={faCompactDisc}
                  text={artist.genres.join(", ")}
                  darkMode={false}
                />
              )}
              {artist.age && (
                <Tag
                  icon={faUser}
                  text={`${artist.age} years old`}
                  darkMode={false}
                />
              )}
              {artist.type && (
                <Tag icon={faUsers} text={artist.type.charAt(0).toUpperCase() + artist.type.slice(1)} darkMode={false} />
              )}
              {artist.school && (
                <Tag
                  icon={faGraduationCap}
                  text={artist.school}
                  darkMode={false}
                />
              )}
              {Array.isArray(artist.influences) && artist.influences.length > 0 && (
                <Tag
                  icon={faMusic}
                  text={`Influences: ${artist.influences.join(", ")}`}
                  darkMode={false}
                />
              )}
            </div>
          </div>
          <div className="relative z-10">
            <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl">
              <AuthImage
                src={artist.image || DEFAULT_IMAGE}
                alt={artist.name}
                width={800}
                height={800}
                className="w-full h-full"
                objectFit="cover"
                fallbackSrc={DEFAULT_IMAGE}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ArtistBio;
