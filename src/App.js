import React from "react";
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ArtistsCarousel from "./components/ArtistsCarousel";
import Footer from "./components/Footer";

const App = () => {
  const artists = [
    { name: "Artist 1", location: "Northeastern", genre: "Punk Rock" },
    { name: "Artist 2", location: "Northeastern", genre: "Punk Rock" },
    { name: "Artist 3", location: "Northeastern", genre: "Punk Rock" },
  ];

  return (
    <div className="bg-covenPurple min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <ArtistsCarousel artists={artists} />
      <Footer />
    </div>
  );
};

export default App;

