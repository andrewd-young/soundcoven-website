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
    { 
      name: "Raven Riot", 
      location: "Northeastern University", 
      genre: "Punk Rock", 
      image: Placeholder1, 
      bio: "Raven Riot channels raw energy into anthems that critique societal norms with blistering guitar riffs and unapologetic lyrics."
    },
    { 
      name: "The Boston Banshees", 
      location: "Boston University", 
      genre: "Punk Rock", 
      image: Placeholder2, 
      bio: "The Boston Banshees bring a haunting edge to punk rock, blending aggressive beats with ethereal melodies and fiery vocals." 
    },
    { 
      name: "NoiseCraft", 
      location: "Berklee College of Music", 
      genre: "Punk Rock", 
      image: Placeholder3, 
      bio: "NoiseCraft fuses technical mastery with the rebellious spirit of punk, creating a sound that’s both innovative and rebellious."
    },
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