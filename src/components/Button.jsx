import React from "react";
import PropTypes from 'prop-types';

const Button = ({ text, className }) => {
  return (
    <button className={`px-4 py-2 rounded text-white font-semibold ${className}`}>
      {text}
    </button>
  );
};
Button.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Button;