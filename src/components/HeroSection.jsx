import React from "react";
import { Link } from "react-router-dom";
import Button from "./common/Button";
import { useArtists } from "../hooks/useArtists";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Artist+Image";

const HeroSection = () => {
  const { artists, loading, error } = useArtists();
  const featuredArtist =
    artists.find((artist) => artist.isFeatured) || artists[0];

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;
  if (!featuredArtist) return null;

  return (
    <section className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24 relative">
      <div className="grid md:grid-cols-2 items-center gap-8">
        {/* Artist Image */}
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
            <img
              src={featuredArtist.image || DEFAULT_IMAGE}
              alt={featuredArtist.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </div>
        </div>

        {/* Artist Information */}
        <div className="space-y-6 z-20">
          <h3 className="italic text-2xl md:text-3xl lg:text-4xl">FEATURED</h3>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {featuredArtist.name}
          </h1>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                text="View Artist Profile"
                link={`/artists/${featuredArtist.id}`}
                className="bg-covenRed border-0"
              />
              <Button text="Explore More Artists" link="/artists" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
