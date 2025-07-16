import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useInstrumentalists } from './hooks/useInstrumentalists';
import {
  faGuitar,
  faGraduationCap,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import Tag from './components/common/Tag';
import { AuthImage } from "./components/common/AuthImage";

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
          <p className="text-lg mb-8 leading-relaxed">
            {instrumentalist.bio && (
              <span className="block mt-4">{instrumentalist.bio}</span>
            )}
          </p>
          
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
                text={instrumentalist.favoriteGenres.join(', ')}
                darkMode={false}
              />
            )}
          </div>
        </div>
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl">
            <AuthImage
              src={instrumentalist.profileImageUrl}
              alt={`${instrumentalist.name}'s profile`}
              width={800}
              height={800}
              className="w-full h-full object-cover"
              fallbackSrc={DEFAULT_IMAGE}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentalistBio; 