import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { useExtractColors } from "react-extract-colors";

const HeroSection = ({ artist }) => {
  const { dominantColor } = useExtractColors(artist.image);
  const bgColor = dominantColor || "#1a1a1a"; // Fallback background color

  if (!artist) {
    return null;
  }

  return (
    <section
      className="relative flex justify-center items-center min-h-[80vh] px-6 sm:px-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${artist.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient to Background Color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 20%, transparent 100%)`,
          }}
        ></div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col justify-center items-start text-left w-full max-w-screen-lg pl-6 sm:pl-12">
        {/* Artist Name (Left Side, Italic) */}
        <p className="text-white italic text-3xl sm:text-4xl font-light mb-4">
          {artist.name}
        </p>

        {/* Hero Title */}
        <h2 className="text-white text-5xl sm:text-6xl font-bold mb-6">
          FEATURED
        </h2>

        {/* CTA Button */}
        <Button 
          text="Apply" 
          className="bg-white text-black hover:bg-gray-200 transition duration-300 shadow-lg" 
        />
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