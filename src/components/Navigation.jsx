import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/soundcoven-logo-white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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
        .from("profiles")
        .select("*, applications(*)")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profile);
      if (profile?.applications) {
        setApplication(profile.applications);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileAndApplication();
  }, [fetchProfileAndApplication]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    // Check if we're not on the home page
    if (window.location.pathname !== "/") {
      // Navigate to home page with about hash
      navigate("/#about");
    } else {
      // If already on home page, just scroll to about section
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-covenPurple text-white py-4 px-6 md:px-12 lg:px-24 text-lg space-x-6">
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
            <div className="flex items-center space-x-8">
              <Link to="/artists" className="hover:text-gray-300 text-xl">
                Artists
              </Link>
              <Link to="/industry-pros" className="hover:text-gray-300 text-xl">
                <span className="hidden sm:inline">Industry Pros</span>
                <span className="inline sm:hidden">Pros</span>
              </Link>
              <Link to="/instrumentalists" className="hover:text-gray-300 text-xl">
                <span className="hidden sm:inline">Instrumentalists</span>
                <span className="inline sm:hidden">Musicians</span>
              </Link>
              <a
                href="/#about"
                onClick={handleAboutClick}
                className="hover:text-gray-300 text-xl"
              >
                About
              </a>
            </div>
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 text-lg"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Account
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                      {profile?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 last:rounded-b-md"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 w-[120px] justify-center"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-start space-x-4">
            {user && profile?.role !== "admin" && (
              <>
                {application?.status === "pending" ? (
                  <span className="text-md">Application Pending</span>
                ) : (
                  <>
                    <span className="text-md">
                      Interested in joining the coven?
                    </span>
                    <Link
                      to="/apply"
                      className="bg-white text-covenPurple px-6 py-2 rounded w-[120px] hover:bg-gray-100 transition-colors"
                    >
                      Apply
                    </Link>
                  </>
                )}
              </>
            )}
            {!user && (
              <>
                <span className="text-md">
                  Interested in joining the coven?
                </span>
                <Link
                  to="/login"
                  className="bg-white text-covenPurple px-6 py-2 rounded hover:bg-gray-100 transition-colors w-[120px] text-center flex-shrink-0"
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
