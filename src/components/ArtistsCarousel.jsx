import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ArtistsCarousel = ({ artists }) => {
  const carouselRef = useRef(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth);
      setIsScrolledToStart(scrollLeft === 0);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <section id="artists" className="bg-covenPurple text-white py-8 px-24 relative">
      <h2 className="text-2xl font-bold mb-6">Artists You Might Like</h2>
      <div className="relative">
        {/* Gradient Effect */}
        {!isScrolledToStart && (
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-covenPurple pointer-events-none z-10" />
        )}
        {!isScrolledToEnd && (
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-covenPurple pointer-events-none z-10" />
        )}
        
        {/* Scrollable Artists */}
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
        >
          {artists.slice(0, 5).map((artist) => (
            <Card
              key={artist.id}
              artist={artist}
              className="w-64 flex-shrink-0 bg-teal-900 text-white"
            />
          ))}
        </div>

        {/* Scroll Arrows */}
        {!isScrolledToStart && (
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-covenPurple p-2 rounded-full shadow-md z-20 hover:bg-gray-200 w-12 h-12 flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {!isScrolledToEnd && (
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-covenPurple p-2 rounded-full shadow-md z-20 hover:bg-gray-200 w-12 h-12 flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>

      {/* Link to more artists */}
      <div className="mt-6 text-right">
        <a href="/artists" className="text-teal-300 hover:underline">
          See More Artists
        </a>
      </div>
    </section>
  );
};

ArtistsCarousel.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      // Add other artist properties here
    })
  ).isRequired,
};

export default ArtistsCarousel;