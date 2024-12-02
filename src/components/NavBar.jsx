import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/soundcoven-logo-white.png";

const Navbar = () => {
  return (
    <nav className="bg-covenPurple text-white py-8 px-24 flex flex-col items-center">
      <Link to="/">
        <img src={Logo} alt="Logo" className="mb-4" style={{ width: '900px' }} />
      </Link>
      <ul className="flex space-x-6 text-lg">
        <li><Link to="/artists" className="hover:text-red-400">Artists</Link></li>
        <li><a href="#live" className="hover:text-red-400">Live</a></li>
        <li><a href="#about" className="hover:text-red-400">About</a></li>
        <li><a href="#contact" className="hover:text-red-400">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;