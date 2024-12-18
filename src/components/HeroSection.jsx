import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const HeroSection = ({ artist }) => {
  return (
    <section className="bg-covenPurple text-white py-8 px-24 relative">
      <div className="grid md:grid-cols-2 items-center gap-8">
        {/* Artist Image */}
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
            <img 
              src={artist.image} 
              alt={artist.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Artist Information */}
        <div className="space-y-6 z-20">
          <h3 className="italic text-2xl md:text-3xl lg:text-4xl">FEATURED</h3>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {artist.name}
          </h1>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                text="View Artist Profile"
                link={`/artists/${artist.name}`}
                className="bg-covenRed border-0"
              />
              <Button
                text="Explore More Artists"
                link="/artists"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  artist: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default HeroSection;
