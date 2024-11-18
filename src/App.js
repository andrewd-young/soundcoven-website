import React from "react";
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ArtistsCarousel from "./components/ArtistsCarousel";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="bg-covenPurple min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <ArtistsCarousel />
      <Footer />
    </div>
  );
};

export default App;

