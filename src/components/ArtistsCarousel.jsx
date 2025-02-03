import React, { useRef, useState, useEffect } from "react";
import { useArtists } from "../hooks/useArtists";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useExtractColors } from "react-extract-colors";
import { isLightColor } from "../utils/colorUtils";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";
const DEFAULT_COLOR = "#4F1D4D"; // covenLightPurple

const ArtistCard = ({ artist }) => {
  const isUsingDefaultImage = !artist.image;
  const { colors } = useExtractColors(artist.image || DEFAULT_IMAGE, {
    crossOrigin: "anonymous",
    defaultColor: DEFAULT_COLOR,
    skip: isUsingDefaultImage,
  });

  const bgColor = isUsingDefaultImage
    ? DEFAULT_COLOR
    : colors?.[0] || DEFAULT_COLOR;

  return (
    <Link to={`/artists/${artist.id}`} className="block">
      <div
        className="w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={artist.image || DEFAULT_IMAGE}
            alt={artist.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
        <div className={`p-4 ${isLightColor(bgColor) ? 'text-on-light' : 'text-white'}`}>
          <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
          <p className="text-sm opacity-75">
            {artist.genre || "Genre not specified"}
          </p>
        </div>
      </div>
    </Link>
  );
};

const ArtistsCarousel = () => {
  const { artists, loading, error } = useArtists();
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
    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;
  if (!artists?.length) return null;

  return (
    <section
      id="artists"
      className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24 relative"
    >
      <h2 className="text-4xl font-bold mb-6">Newest Additions</h2>
      <div className="relative">
        {/* Gradient Effect */}
        {!isScrolledToStart && (
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-covenPurple pointer-events-none z-10 hidden sm:block" />
        )}
        {!isScrolledToEnd && (
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-covenPurple pointer-events-none z-10 hidden sm:block" />
        )}

        {/* Scrollable Artists */}
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
        >
          {artists.slice(0, 5).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
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
    </section>
  );
};

export default ArtistsCarousel;
