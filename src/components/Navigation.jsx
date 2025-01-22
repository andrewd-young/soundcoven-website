import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/soundcoven-logo-white.png";
import useApplicationForm from "../hooks/useApplicationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import supabase from "../utils/supabase";

const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);

  const fetchProfileAndApplication = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, applications(*)')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profile);
      if (profile?.applications) {
        setApplication(profile.applications);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileAndApplication();
  }, [fetchProfileAndApplication]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    // Check if we're not on the home page
    if (window.location.pathname !== '/') {
      // Navigate to home page with about hash
      navigate('/#about');
    } else {
      // If already on home page, just scroll to about section
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
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
            alt="Sound Coven Logo"
            className="mb-2"
            style={{ width: "600px" }}
          />
        </Link>
        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-6">
              <Link to="/artists" className="hover:text-gray-300">Artists</Link>
              <Link to="/industry-pros" className="hover:text-gray-300">
                <span className="hidden sm:inline">Industry Pros</span>
                <span className="inline sm:hidden">Pros</span>
              </Link>
              <a 
                href="/#about" 
                onClick={handleAboutClick} 
                className="hover:text-gray-300"
              >
                About
              </a>
            </div>
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span className="hidden sm:inline text-md">{user.email}</span>
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
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-start space-x-4">
            {user ? (
              application?.status === 'pending' ? (
                <span className="text-md">Application Pending</span>
              ) : (
                <>
                  <span className="text-md">Interested in joining the coven?</span>
                  <Link 
                    to="/apply" 
                    className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Apply Now
                  </Link>
                </>
              )
            ) : (
              <>
                <span className="text-md">Interested in joining the coven?</span>
                <Link 
                  to="/login" 
                  className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;