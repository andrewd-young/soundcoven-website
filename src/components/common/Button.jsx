import React from "react";
import PropTypes from "prop-types";

const Button = ({ text, className, onClick, link }) => {
  const buttonClass = `inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-opacity-90 transition duration-300 transform hover:-translate-y-1 hover:scale-105 ${className}`;

  if (link) {
    return (
      <a href={link} className={buttonClass}>
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.string,
};

export default Button;
