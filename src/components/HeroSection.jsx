import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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
              <Link
                to={`/artists/${artist.name}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-covenRed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                View Artist Profile
              </Link>

              <a
                href="/artists"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-covenPurple transition duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Explore More Artists
              </a>
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
