import React from 'react';
import { Link } from 'react-router-dom';
import { Instrumentalist } from '../types/Instrumentalist';
import AuthImage from './common/AuthImage';
import { faGuitar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Tag from './common/Tag';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Instrumentalist+Image';

interface InstrumentalistCardProps {
  instrumentalist: Instrumentalist;
}

const InstrumentalistCard: React.FC<InstrumentalistCardProps> = ({ instrumentalist }) => {
  return (
    <Link to={`/instrumentalists/${instrumentalist.id}`}>
      <div className="bg-covenLightPurple rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="h-72 rounded-t-lg overflow-hidden">
          <AuthImage
            src={instrumentalist.profileImageUrl || DEFAULT_IMAGE}
            alt={instrumentalist.name}
            width={400}
            height={300}
            className="w-full h-full rounded-t-lg"
            objectFit="cover"
            fallbackSrc={DEFAULT_IMAGE}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{instrumentalist.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {instrumentalist.instrument && (
              <Tag icon={faGuitar} text={instrumentalist.instrument} darkMode={true} />
            )}
            {instrumentalist.school && (
              <Tag icon={faGraduationCap} text={instrumentalist.school} darkMode={true} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// No PropTypes needed, using TypeScript

export default InstrumentalistCard; 