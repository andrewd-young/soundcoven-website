import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUniversity } from "@fortawesome/free-solid-svg-icons";

const IndustryCard = ({ pro, className = "", styles = {} }) => {
  if (!pro) {
    return null; // or return some fallback UI
  }

  return (
    <Link
      to={`/pros/${pro.name}`}
      className={`rounded-lg shadow-md bg-covenLightPurple ${className}`}
      style={{
        ...styles,
        height: "500px",
        width: "320px",
        margin: "auto",
      }}
    >
      <img
        src={pro.image}
        alt={pro.name}
        className="mb-6 rounded-t-lg w-full h-auto object-cover"
      />
      <div className="mx-4 mb-6" style={{ overflow: "hidden" }}>
        <h3 className="font-bold text-4xl truncate">{pro.name}</h3>
      </div>
      <p className="card-text mx-4 my-3">
        <FontAwesomeIcon icon={faUniversity} className="w-7" /> {pro.school}
      </p>
      <p className="card-text mx-4 my-3">
        <FontAwesomeIcon icon={faBriefcase} className="w-7" /> {pro.role}
      </p>
    </Link>
  );
};

IndustryCard.propTypes = {
  pro: PropTypes.object.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

export default IndustryCard;
