import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUniversity } from "@fortawesome/free-solid-svg-icons";
import { AuthImage } from "./common/AuthImage";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Profile+Image";

const IndustryCard = ({ pro, className = "", styles = {} }) => {
  if (!pro) {
    return null;
  }

  const isLightBackground = (color) => {
    if (!color) return false; // Return false for undefined/null colors
    // Convert color to RGB and check its brightness
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

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
        <AuthImage
          src={pro.profile_image_url || DEFAULT_IMAGE}
          alt={pro.name}
          className="w-full h-full"
          objectFit="cover"
          objectPosition="top"
          fallbackSrc={DEFAULT_IMAGE}
        />
      </div>
      <div
        className={`flex flex-col flex-grow p-4 ${
          isLightBackground(styles?.backgroundColor)
            ? "text-on-light"
            : "text-white"
        }`}
      >
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
          <p className="card-text text-gray-300">at {pro.company}</p>
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
    profile_image_url: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

export default IndustryCard;
