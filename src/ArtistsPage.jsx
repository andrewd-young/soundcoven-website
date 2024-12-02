import React from "react";
import WideCard from "./components/WideCard";

const ArtistsPage = ({ artists }) => {
  return (
    <section id="artists" className="bg-covenPurple text-white py-8 px-24">
      <h2 className="text-2xl font-bold mb-6">Artists</h2>
      <div className="flex flex-col">
        {artists.map((artist, index) => (
          <WideCard key={index} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default ArtistsPage;