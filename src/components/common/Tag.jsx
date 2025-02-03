import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Tag = ({ icon, text, darkMode = false }) => (
  <span className={`
    inline-flex items-center 
    px-4 py-2 
    rounded-full 
    text-base
    overflow-hidden
    ${darkMode 
      ? 'bg-white/20 text-white' 
      : 'bg-white text-covenPurple'
    }
  `}>
    <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-2 flex-shrink-0" />
    <span className="truncate font-medium">{text}</span>
  </span>
);

Tag.propTypes = {
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  darkMode: PropTypes.bool,
};

export default Tag; 