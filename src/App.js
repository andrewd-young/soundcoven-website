import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ArtistsCarousel from "./components/ArtistsCarousel";
import Footer from "./components/Footer";
import ArtistsPage from "./ArtistsPage";
import ArtistBio from "./ArtistBio";
import Placeholder1 from "./assets/placeholder-image-1.png";
import Placeholder2 from "./assets/placeholder-image-2.jpeg";
import Placeholder3 from "./assets/placeholder-image-3.jpg";

const App = () => {
  const artists = [
    { name: "Artist 1", location: "Northeastern", genre: "Punk Rock", image: Placeholder1 },
    { name: "Artist 2", location: "Boston University", genre: "Punk Rock", image: Placeholder2 },
    { name: "Artist 3", location: "Berklee", genre: "Punk Rock", image: Placeholder3 },
  ];

  return (
    <Router>
      <div className="bg-covenPurple min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ArtistsCarousel artists={artists} />
            </>
          } />
          <Route path="/artists" element={<ArtistsPage artists={artists} />} />
          <Route path="/artists/:artistName" element={<ArtistBio artists={artists} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;