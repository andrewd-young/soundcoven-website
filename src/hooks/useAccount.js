import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

export const useAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState({
    email: user?.email || "",
  });
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);

  const fetchProfileAndApplication = useCallback(async () => {
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
    if (user) {
      setUserDetails({
        email: user.email,
      });
      fetchProfileAndApplication();
    }
  }, [user, fetchProfileAndApplication]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        email: userDetails.email,
      });

      if (error) throw error;
      setMessage("Check your email to confirm the change");
    } catch (error) {
      setMessage(`error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProfile = async () => {
    try {
      setLoading(true);
      setMessage("");
      
      // Get the current application to access status_history
      const { data: currentApp, error: fetchError } = await supabase
        .from("applications")
        .select("status_history")
        .eq("id", application.id)
        .single();

      if (fetchError) throw fetchError;

      // Update application status
      const { error: statusError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          user_accepted_at: new Date().toISOString(),
          status_history: [
            ...(currentApp.status_history || []),
            {
              status: "approved",
              timestamp: new Date().toISOString(),
              user_id: user.id
            }
          ]
        })
        .eq("id", application.id);

      if (statusError) throw statusError;

      // Refresh profile data
      await fetchProfileAndApplication();
    } catch (error) {
      console.error('Error accepting profile:', error);
      setMessage(`error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return "Not Set";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatApplicationStatus = (status) => {
    if (!status) return "Not Started";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return {
    user,
    loading,
    message,
    userDetails,
    profile,
    application,
    setUserDetails,
    handleUpdateEmail,
    handleAcceptProfile,
    formatRole,
    formatApplicationStatus,
    navigate
  };
}; 