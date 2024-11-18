import React from "react";
import Card from "./Card";
import placeholder from "../assets/placeholder-image-1.png";

const ArtistsCarousel = () => {
  const artists = [
    { name: "Artist 1", location: "Northeastern", genre: "Punk Rock" },
    { name: "Artist 2", location: "Northeastern", genre: "Punk Rock" },
    { name: "Artist 3", location: "Northeastern", genre: "Punk Rock" },
  ];

  return (
    <section id="artists" className="bg-covenPurple text-white py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Artists You Might Like</h2>
      <div className="flex space-x-4 overflow-x-scroll px-6">
        {artists.map((artist, index) => (
          <Card key={index} className="w-64 flex-shrink-0 text-center bg-teal-900 text-white">
            <img src={placeholder} alt={artist.name} className="rounded-md mb-4" />
            <h3 className="font-bold">{artist.name}</h3>
            <p>{artist.location}</p>
            <p>{artist.genre}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ArtistsCarousel;
