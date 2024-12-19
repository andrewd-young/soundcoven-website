import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/soundcoven-logo-white.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate("/#about");
  };

  return (
    <nav className="bg-covenPurple text-white py-8 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      <Link to="/">
        <img
          src={Logo}
          alt="Logo"
          className="mb-4"
          style={{ width: "900px" }}
        />
      </Link>
      <ul className="flex space-x-6 text-lg">
        <li>
          <Link to="/artists" className="hover:text-red-400">
            Artists
          </Link>
        </li>
        <li>
          <Link to="/industry-pros" className="hover:text-red-400">
            <span className="hidden sm:inline">Industry Pros</span>
            <span className="inline sm:hidden">Pros</span>
          </Link>
        </li>
        <li>
          <a
            href="/#about"
            onClick={handleAboutClick}
            className="hover:text-red-400"
          >
            About
          </a>
        </li>
        <li>
          <a href="/apply" className="hover:text-red-400">
            Apply
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;