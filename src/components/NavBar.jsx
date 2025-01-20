import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/soundcoven-logo-white.png";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate("/#about");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    }
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-covenPurple text-white py-4 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col items-center">
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="mb-2"
            style={{ width: "600px" }}
          />
        </Link>
        <div className="flex justify-between items-center w-full">
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
          </ul>

          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 hover:text-red-400"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="hidden sm:inline">{user.email}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-2" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="hover:text-red-400">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;