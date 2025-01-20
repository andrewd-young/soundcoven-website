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
import Login from "./components/Login";
import ArtistForm from "./components/forms/ArtistForm";
import IndustryForm from "./components/forms/IndustryForm";
import InstrumentalistForm from "./components/forms/InstrumentalistForm";
import IndustryProsPage from "./IndustryProsPage";
import artists from "./artists";
import industryPros from "./industryPros";
import IndustryProBio from "./IndustryProBio";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./components/Account";
import CallToAction from "./components/CallToAction";

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
  return (
    <Router>
      <AuthProvider>
        <SpeedInsights/>
        <Analytics/>
        <ScrollToHashElement />
        <div className="bg-covenPurple min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection artist={artists[1]} />
                <ArtistsCarousel artists={artists} />
                <About />
                <CallToAction />
              </>
            } />
            <Route path="/artists" element={
              <ProtectedRoute>
                <ArtistsPage artists={artists} />
              </ProtectedRoute>
            } />
            <Route path="/industry-pros" element={
              <ProtectedRoute>
                <IndustryProsPage industryPros={industryPros} />
              </ProtectedRoute>
            } />
            <Route path="/apply" element={
              <ProtectedRoute>
                <ApplyForm />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login title="Sign Up or Login" />} />
            <Route path="/artists/:artistName" element={<ArtistBio artists={artists} />} />
            <Route path="/pros/:proName" element={<IndustryProBio industryPros={industryPros} />} />
            <Route path="/apply/artist" element={<ArtistForm />} />
            <Route path="/apply/industry" element={<IndustryForm />} />
            <Route path="/apply/instrumentalist" element={<InstrumentalistForm />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;