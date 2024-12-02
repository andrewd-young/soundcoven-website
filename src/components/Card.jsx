import React from "react";

const Card = ({ artist, className = "", styles = {} }) => {
  if (!artist) {
    return null; // or return some fallback UI
  }

  return (
    <div
      className={`bg-gray-100 rounded-lg shadow-md p-6 ${className}`}
      style={styles}
    >
      <img src={artist.image} alt={artist.name} className="rounded-md mb-4" />
      <h3 className="font-bold">{artist.name}</h3>
      <p>{artist.location}</p>
      <p>{artist.genre}</p>
    </div>
  );
};

export default Card;