import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-covenPurple text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        SOUND<span className="text-red-500">COVEN</span>
      </h1>
      <ul className="flex space-x-6 text-lg">
        <li><a href="#artists" className="hover:text-red-400">Artists</a></li>
        <li><a href="#live" className="hover:text-red-400">Live</a></li>
        <li><a href="#about" className="hover:text-red-400">About</a></li>
        <li><a href="#contact" className="hover:text-red-400">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
