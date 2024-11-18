import React from "react";

const Button = ({ text, className }) => {
  return (
    <button className={`px-4 py-2 rounded text-white font-semibold ${className}`}>
      {text}
    </button>
  );
};

export default Button;
