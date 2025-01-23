import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import Navbar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        // List of paths that are always accessible
        const publicPaths = ["/apply", "/login", "/signup", "/", "/logout"];
        const isPublicPath = publicPaths.some(
          (path) =>
            location.pathname === path ||
            location.pathname.startsWith("/apply/")
        );

        // If no profile and not on a public path, redirect to apply
        if (!profile && !isPublicPath && user) {
          navigate("/apply");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="bg-covenPurple min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-pulse space-y-4 w-full max-w-2xl mx-auto p-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-covenPurple min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
