import React from "react";

const Card = ({ children, className = "", styles = {} }) => {
  return (
    <div
      className={`bg-gray-100 rounded-lg shadow-md p-6 ${className}`}
      style={styles}
    >
      {children}
    </div>
  );
};

export default Card;
