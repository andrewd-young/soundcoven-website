import React from "react";
import PropTypes from "prop-types";

const Button = ({ text, className }) => {
  return (
    <button
      className={`border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition ${className}`}
    >
      {text}
    </button>
  );
};
Button.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Button;
