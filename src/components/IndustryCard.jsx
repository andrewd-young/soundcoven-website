import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUniversity } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Profile+Image';

const IndustryCard = ({ pro, className = "", styles = {} }) => {
  if (!pro) {
    return null;
  }

  return (
    <Link
      to={`/industry-pros/${pro.id}`}
      className={`rounded-lg shadow-md bg-covenLightPurple flex flex-col ${className}`}
      style={{
        ...styles,
        height: "440px",
        width: "320px",
        margin: "auto",
      }}
    >
      <div className="h-72 overflow-hidden rounded-t-lg">
        <img
          src={pro.image || DEFAULT_IMAGE}
          alt={pro.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="mb-2">
          <h3 className="font-bold text-4xl truncate">{pro.name}</h3>
        </div>
        {pro.school && (
          <p className="card-text mb-2">
            <FontAwesomeIcon icon={faUniversity} className="w-7" /> {pro.school}
          </p>
        )}
        {pro.role && (
          <p className="card-text mb-2">
            <FontAwesomeIcon icon={faBriefcase} className="w-7" /> {pro.role}
          </p>
        )}
        {pro.company && (
          <p className="card-text text-gray-300">
            at {pro.company}
          </p>
        )}
      </div>
    </Link>
  );
};

IndustryCard.propTypes = {
  pro: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    company: PropTypes.string,
    school: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

export default IndustryCard;
