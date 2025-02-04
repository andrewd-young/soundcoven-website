import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInstrumentalists } from './hooks/useInstrumentalists';
import {
  faMapMarkerAlt,
  faGuitar,
  faGraduationCap,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import Tag from './components/common/Tag';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Instrumentalist+Image';

const InstrumentalistBio = () => {
  const { instrumentalistId } = useParams();
  const { instrumentalists, loading, error } = useInstrumentalists();
  
  if (loading) return <div className="min-h-screen bg-covenPurple text-white p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-covenPurple text-white p-8">Error: {error}</div>;
  
  const instrumentalist = instrumentalists.find((i) => i.id === parseInt(instrumentalistId));
  
  if (!instrumentalist) {
    return <Navigate to="/instrumentalists" replace />;
  }

  return (
    <section id="instrumentalist-bio" className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h2 className="text-6xl font-bold mb-6">{instrumentalist.name}</h2>
          <p className="text-lg mb-8 leading-relaxed">{instrumentalist.note || 'No additional information available'}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-4 mb-4">
            {instrumentalist.instrument && (
              <Tag 
                icon={faGuitar} 
                text={instrumentalist.instrument}
                darkMode={false}
              />
            )}
            {instrumentalist.school && (
              <Tag 
                icon={faGraduationCap} 
                text={instrumentalist.school}
                darkMode={false}
              />
            )}
            {instrumentalist.favoriteGenres && (
              <Tag 
                icon={faMusic} 
                text={instrumentalist.favoriteGenres}
                darkMode={false}
              />
            )}
          </div>
        </div>
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={instrumentalist.profileImageUrl || DEFAULT_IMAGE}
              alt={instrumentalist.name}
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

export default InstrumentalistBio; 