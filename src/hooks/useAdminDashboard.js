import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

export const useAdminDashboard = (user) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending');

  const getTableName = (applicationType) => {
    switch (applicationType) {
      case 'artist':
        return 'artists';
      case 'instrumentalist':
        return 'instrumentalists';
      case 'industry':
        return 'industry_professionals';
      default:
        throw new Error(`Unknown application type: ${applicationType}`);
    }
  };

  const fetchApplications = useCallback(async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (profile?.role !== "admin") {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleFinalizeProfile = async (application) => {
    try {
      // First check if we have a valid photo URL
      if (!application.photo_url) {
        throw new Error('No photo URL found in application');
      }

      // Extract just the profile data we want to save
      const profileData = {
        ...application.admin_approved_profile,
        profile_image_url: application.photo_url,
        user_id: application.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Remove any undefined or null values
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined || profileData[key] === null) {
          delete profileData[key];
        }
      });

      // Create the profile
      const { data: newProfile, error: profileError } = await supabase
        .from(getTableName(application.application_type))
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      if (!newProfile) {
        throw new Error('Profile was not created');
      }

      // Update application status to finalized
      const { error: applicationError } = await supabase
        .from('applications')
        .update({
          status: 'finalized',
          status_history: [...(application.status_history || []), {
            status: 'finalized',
            timestamp: new Date().toISOString(),
            user_id: user.id
          }],
          finalized_at: new Date().toISOString(),
          finalized_by: user.id
        })
        .eq('id', application.id);

      if (applicationError) {
        console.error('Application update error:', applicationError);
        throw applicationError;
      }

      // Update the applications list
      setFilteredApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, status: 'finalized' }
            : app
        )
      );

    } catch (error) {
      console.error('Error finalizing profile:', error);
      throw error;
    }
  };

  // Filter applications when selected status changes
  useEffect(() => {
    const filtered = applications.filter(app => app.status === selectedStatus);
    setFilteredApplications(filtered);
  }, [selectedStatus, applications]);

  // Initial fetch
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    filteredApplications,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    handleFinalizeProfile
  };
}; 