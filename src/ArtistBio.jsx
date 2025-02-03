import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useArtists } from './hooks/useArtists';
import {
  faMapMarkerAlt,
  faCompactDisc,
  faUser,
  faClock,
  faMusic,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faSpotify, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Tag from './components/common/Tag';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Artist+Image';

const SocialButton = ({ icon, text, link, primary = false, instagram = false }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
      primary ? 'bg-green-600 hover:bg-green-700' : 
      instagram ? 'bg-[#DD2A7B] hover:bg-[#C1246C]' :
      'bg-teal-900 hover:bg-teal-800'
    } transition-colors duration-200`}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
    {text}
  </a>
);

const ArtistBio = () => {
  const { artistId } = useParams();
  const { artists, loading, error } = useArtists();
  
  if (loading) return <div className="min-h-screen bg-covenPurple text-white p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-covenPurple text-white p-8">Error: {error}</div>;
  
  const artist = artists.find((a) => a.id === parseInt(artistId));
  
  if (!artist) {
    return <Navigate to="/artists" replace />;
  }

  return (
    <section id="artist-bio" className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h2 className="text-6xl font-bold mb-6">{artist.name}</h2>
          <p className="text-lg mb-8 leading-relaxed">{artist.bio || 'No bio available'}</p>
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mb-6">
            {artist.streamingLink && (
              <SocialButton 
                icon={faSpotify} 
                text="Listen on Spotify"
                link={artist.streamingLink}
                primary
              />
            )}
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
            {artist.genre && (
              <Tag 
                icon={faCompactDisc} 
                text={artist.genre}
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
              <Tag 
                icon={faUsers} 
                text={artist.type}
                darkMode={false}
              />
            )}
            {artist.yearsActive && (
              <Tag 
                icon={faClock} 
                text={`${artist.yearsActive} years active`}
                darkMode={false}
              />
            )}
            {artist.influences && (
              <Tag 
                icon={faMusic} 
                text={`Influences: ${artist.influences}`}
                darkMode={false}
              />
            )}
          </div>
        </div>
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={artist.image || DEFAULT_IMAGE}
              alt={artist.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistBio;
