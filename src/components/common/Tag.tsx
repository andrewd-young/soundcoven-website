import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import PropTypes from "prop-types";

interface TagProps {
  icon: IconDefinition;
  text: string;
  darkMode?: boolean;
}

const Tag: React.FC<TagProps> = ({ icon, text, darkMode = false }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      darkMode
        ? "bg-white bg-opacity-20 text-white"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    <FontAwesomeIcon icon={icon} className="w-3 h-3" />
    {text}
  </span>
);

Tag.propTypes = {
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  darkMode: PropTypes.bool,
};

export default Tag; 