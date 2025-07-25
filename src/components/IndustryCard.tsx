import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUniversity } from "@fortawesome/free-solid-svg-icons";
import AuthImage from "./common/AuthImage";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Profile+Image";

interface IndustryCardProps {
  pro: {
    id: number;
    name: string;
    role?: string;
    company?: string;
    school?: string;
    location?: string;
    email?: string;
    phone?: string;
    profile_image_url?: string;
  };
  className?: string;
  styles?: Record<string, string>;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ pro, className = "", styles = {} }) => {
  if (!pro) {
    return null;
  }

  return (
    <Link to={`/industry-pros/${pro.id}`}>
      <div
        className={`bg-covenLightPurple rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}
        style={styles}
      >
        <div className="h-72 rounded-t-lg overflow-hidden">
          <AuthImage
            src={pro.profile_image_url || DEFAULT_IMAGE}
            alt={pro.name}
            width={400}
            height={300}
            className="w-full h-full rounded-t-lg"
            objectFit="cover"
            fallbackSrc={DEFAULT_IMAGE}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{pro.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {pro.role && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                <FontAwesomeIcon icon={faBriefcase} className="w-3 h-3" />
                {pro.role}
              </span>
            )}
            {pro.school && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                <FontAwesomeIcon icon={faUniversity} className="w-3 h-3" />
                {pro.school}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IndustryCard;
