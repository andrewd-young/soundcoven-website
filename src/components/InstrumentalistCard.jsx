import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGuitar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Tag from './common/Tag';
import { OptimizedImage } from './common/OptimizedImage';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Instrumentalist+Image';

const InstrumentalistCard = ({ instrumentalist }) => {
  return (
    <Link to={`/instrumentalists/${instrumentalist.id}`}>
      <div className="bg-covenLightPurple rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="aspect-w-16 aspect-h-9">
          <OptimizedImage
            src={instrumentalist.profileImageUrl || DEFAULT_IMAGE}
            alt={instrumentalist.name}
            width={400}
            height={225}
            className="w-full h-full"
            objectFit="cover"
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

InstrumentalistCard.propTypes = {
  instrumentalist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    instrument: PropTypes.string,
    school: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }).isRequired,
};

export default InstrumentalistCard; 