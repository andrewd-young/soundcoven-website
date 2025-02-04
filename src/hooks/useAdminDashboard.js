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
      setLoading(true);
      
      // Extract only the fields that match our database schema
      const { type, upcoming_show, ...rawProfileData } = application.admin_approved_profile;
      
      // Define allowed fields for each profile type
      const profileData = {};
      
      if (application.application_type === "artist") {
        const { name, email, bio, artist_type, genres, streaming_links } = rawProfileData;
        
        // Check if artist already exists
        const { data: existingArtist, error: checkError } = await supabase
          .from("artists")
          .select("*")
          .eq("user_id", application.user_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw checkError;
        }

        if (existingArtist) {
          console.log('Artist already exists, skipping creation');
        } else {
          // Ensure artist_type matches the database constraint values
          const validArtistTypes = ['Band', 'Solo', 'DJ', 'Producer'];
          
          if (!validArtistTypes.includes(artist_type)) {
            throw new Error(`Invalid artist type. Must be one of: ${validArtistTypes.join(', ')}`);
          }
          
          Object.assign(profileData, {
            name,
            email,
            bio,
            artist_type,
            genres,
            streaming_links
          });

          // Insert only if artist doesn't exist
          const { error: insertError } = await supabase
            .from("artists")
            .insert([
              {
                user_id: application.user_id,
                ...profileData,
              },
            ]);

          if (insertError) throw insertError;
        }
      } else if (application.application_type === "industry") {
        // Check if industry pro already exists
        const { data: existingPro, error: checkError } = await supabase
          .from("industry_pros")
          .select("*")
          .eq("user_id", application.user_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingPro) {
          console.log('Industry pro already exists, skipping creation');
        } else {
          const { name, email, bio, industry_role, company, years_experience } = rawProfileData;
          Object.assign(profileData, {
            name,
            email,
            bio,
            industry_role,
            company,
            years_experience
          });

          const { error: insertError } = await supabase
            .from("industry_pros")
            .insert([
              {
                user_id: application.user_id,
                ...profileData,
              },
            ]);

          if (insertError) throw insertError;
        }
      } else {
        // Check if instrumentalist already exists
        const { data: existingInstrumentalist, error: checkError } = await supabase
          .from("instrumentalists")
          .select("*")
          .eq("user_id", application.user_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingInstrumentalist) {
          console.log('Instrumentalist already exists, skipping creation');
        } else {
          const { name, email, bio, instrument, favorite_genres, equipment } = rawProfileData;
          Object.assign(profileData, {
            name,
            email,
            bio,
            instrument,
            favorite_genres,
            equipment
          });

          const { error: insertError } = await supabase
            .from("instrumentalists")
            .insert([
              {
                user_id: application.user_id,
                ...profileData,
              },
            ]);

          if (insertError) throw insertError;
        }
      }

      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: application.application_type,
        })
        .eq("id", application.user_id);

      if (profileError) throw profileError;

      // Update application status
      const { error: statusError } = await supabase
        .from("applications")
        .update({
          status: "finalized",
          finalized_at: new Date().toISOString(),
          finalized_by: user.id,
          status_history: [...(application.status_history || []), {
            status: "finalized",
            timestamp: new Date().toISOString(),
            admin_id: user.id
          }]
        })
        .eq("id", application.id);

      if (statusError) throw statusError;

      // Refresh applications list
      fetchApplications();
    } catch (error) {
      console.error('Error finalizing profile:', error);
      alert('Error finalizing profile. Please try again.');
    } finally {
      setLoading(false);
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