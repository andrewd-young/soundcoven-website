import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-covenPurple text-white py-8 mt-auto px-6 md:px-12 lg:px-24">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">© 2024 SoundCoven</div>
        <div>
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
