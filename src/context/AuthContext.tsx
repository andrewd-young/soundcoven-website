import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

import { User } from "../types/User";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // If user exists and came from email verification (has access_token in URL)
      if (session?.user && window.location.hash.includes("access_token")) {
        navigate("/apply");
      }
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      // Handle email verification redirect
      if (
        _event === "SIGNED_IN" &&
        window.location.hash.includes("access_token")
      ) {
        navigate("/apply");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
