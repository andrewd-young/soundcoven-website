import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-covenPurple text-white py-8 mt-auto px-6 md:px-12 lg:px-24">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-4 md:mb-0">© 2024 SoundCoven</div>
        <div className="flex items-center space-x-6">
          <Link to="/terms" className="text-sm hover:text-red-500">
            Terms of Use
          </Link>
          <a
            href="https://www.instagram.com/soundcoven/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
