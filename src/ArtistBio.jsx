import React from "react";
import { useParams } from "react-router-dom";

const ArtistBio = ({ artists }) => {
    const { artistName } = useParams();
    const artist = artists.find(a => a.name === artistName);
  
    if (!artist) {
      return <div>Artist not found</div>;
    }
  
    return (
        <section id="artist-bio" className="bg-covenPurple text-white py-8 px-24">
        <h2 className="text-2xl font-bold mb-6">About {artist.name}</h2>
        <div className="grid grid-cols-2 gap-4">
            <div>
            <img src={artist.image} alt={artist.name} className="rounded-lg shadow-md" />
            </div>
            <div>
            <p className="text-lg">{artist.bio}</p>
            </div>
        </div>
        </section>
    );
};

export default ArtistBio;