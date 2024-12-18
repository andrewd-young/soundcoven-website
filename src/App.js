import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ArtistsCarousel from "./components/ArtistsCarousel";
import About from "./components/About";
import Footer from "./components/Footer";
import ArtistsPage from "./ArtistsPage";
import ArtistBio from "./ArtistBio";
import ApplyForm from "./ApplyForm";
import ArtistForm from "./components/ArtistForm";
import IndustryForm from "./components/IndustryForm";
import InstrumentalistForm from "./components/InstrumentalistForm";
import Placeholder1 from "./assets/placeholder-image-1.png";
import Placeholder2 from "./assets/placeholder-image-2.jpeg";
import Placeholder3 from "./assets/placeholder-image-3.jpg";

const ScrollToHashElement = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
};

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
      name: "Inhaler", 
      location: "Boston University", 
      genre: "Indie Rock", 
      image: Placeholder2, 
      bio: "Inhaler are an Irish rock band originating from Dublin. Formed in 2012, the band consist of vocalist and guitarist Elijah Hewson, bassist Robert Keating, guitarist Josh Jenkinson and drummer Ryan McMahon."
    },
    { 
      name: "Dark Room", 
      location: "Berklee College of Music", 
      genre: "Alt Pop", 
      image: Placeholder3, 
      bio: "Dark Room's dreamy soundscapes and introspective lyrics create a hauntingly beautiful listening experience."
    },
    { 
      name: "Crystalline", 
      location: "Northeastern University", 
      genre: "Trap House", 
      image: Placeholder1, 
      bio: "Raven Riot channels raw energy into anthems that critique societal norms with blistering guitar riffs and unapologetic lyrics."
    },
  ];

  return (
    <Router>
      <ScrollToHashElement />
      <div className="bg-covenPurple min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection artist={artists[1]} />
              <ArtistsCarousel artists={artists} />
              <About />
            </>
          } />
          <Route path="/artists" element={<ArtistsPage artists={artists} />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/artists/:artistName" element={<ArtistBio artists={artists} />} />
          <Route path="/apply/artist" element={<ArtistForm />} />
          <Route path="/apply/industry" element={<IndustryForm />} />
          <Route path="/apply/instrumentalist" element={<InstrumentalistForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;