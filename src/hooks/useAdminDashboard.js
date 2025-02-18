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
      
      if (!application?.admin_approved_profile) {
        throw new Error('No approved profile data found');
      }

      // Move photo to public bucket if it exists
      let publicPhotoUrl = null;
      if (application.admin_approved_profile.photo_url) {
        try {
          // Extract just the filename from the URL
          const photoUrl = application.admin_approved_profile.photo_url;
          const fileName = photoUrl.split('/').pop();
          
          if (!fileName) {
            console.warn('Could not extract filename from photo URL');
            // Continue with null photo URL
          } else {
            // First verify the file exists
            const { data: fileExists } = await supabase.storage
              .from('application-photos')
              .list('applications/artist', {
                search: fileName
              });

            if (!fileExists || fileExists.length === 0) {
              console.warn('Photo file not found in storage:', fileName);
              // Continue with null photo URL
            } else {
              // Download the file
              const { data: fileData, error: downloadError } = await supabase.storage
                .from('application-photos')
                .download(`applications/artist/${fileName}`);
                
              if (downloadError) {
                console.error('Download error:', downloadError);
                // Continue with null photo URL
              } else {
                // Determine content type from file data
                const contentType = fileData.type || 'image/jpeg';

                // Upload to public bucket in artist folder
                const newPath = `artist/${fileName}`;

                const { error: uploadError } = await supabase.storage
                  .from('public')
                  .upload(newPath, fileData, {
                    upsert: true,
                    contentType: contentType,
                    cacheControl: '31536000'
                  });

                if (uploadError) {
                  console.error('Upload error:', uploadError);
                  // Continue with null photo URL
                } else {
                  // Get the new public URL - this is a synchronous operation
                  const { data } = supabase.storage
                    .from('public')
                    .getPublicUrl(newPath);

                  publicPhotoUrl = data.publicUrl;

                  // Only delete the original if the move was successful
                  await supabase.storage
                    .from('application-photos')
                    .remove([`applications/artist/${fileName}`]);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error moving photo:', error);
          // Continue with null photo URL
        }
      }

      // Check if profile already exists
      const tableName = application.application_type === "artist"
        ? "artists"
        : application.application_type === "industry"
        ? "industry_pros"
        : "instrumentalists";

      const { data: existingProfile, error: checkError } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", application.user_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      if (existingProfile) {
        throw new Error(`A ${application.application_type} profile already exists for this user`);
      }

      // Transform the admin_approved_profile data
      const transformedProfile = {
        user_id: application.user_id,
        name: application.admin_approved_profile.name || '',
        email: application.admin_approved_profile.email || '',
        bio: application.admin_approved_profile.bio || '',
        location: application.admin_approved_profile.location || '',
        photo_url: publicPhotoUrl,
        profile_image_url: publicPhotoUrl,
        social_links: Array.isArray(application.admin_approved_profile.social_links) 
          ? application.admin_approved_profile.social_links 
          : [],
      };

      // Add type-specific fields for artists
      if (application.application_type === "artist") {
        Object.assign(transformedProfile, {
          artist_type: application.admin_approved_profile.artist_type || '',
          genres: Array.isArray(application.admin_approved_profile.genres) 
            ? application.admin_approved_profile.genres 
            : [],
          streaming_links: Array.isArray(application.admin_approved_profile.streaming_links)
            ? application.admin_approved_profile.streaming_links
            : [],
          influences: Array.isArray(application.admin_approved_profile.influences)
            ? application.admin_approved_profile.influences
            : [],
          current_needs: Array.isArray(application.admin_approved_profile.current_needs)
            ? application.admin_approved_profile.current_needs
            : [],
          upcoming_shows: Array.isArray(application.admin_approved_profile.upcoming_shows)
            ? application.admin_approved_profile.upcoming_shows
            : [],
          instagram_link: application.admin_approved_profile.instagram_link || ''
        });
      } else if (application.application_type === "industry") {
        Object.assign(transformedProfile, {
          industry_role: application.admin_approved_profile.industry_role || '',
          company: application.admin_approved_profile.company || '',
          favorite_artists: Array.isArray(application.admin_approved_profile.favorite_artists)
            ? application.admin_approved_profile.favorite_artists
            : typeof application.admin_approved_profile.favorite_artists === 'string'
              ? application.admin_approved_profile.favorite_artists.split(',').map(a => a.trim())
              : []
        });
      } else if (application.application_type === "instrumentalist") {
        Object.assign(transformedProfile, {
          instrument: application.admin_approved_profile.instrument || '',
          favorite_genres: Array.isArray(application.admin_approved_profile.favorite_genres)
            ? application.admin_approved_profile.favorite_genres
            : typeof application.admin_approved_profile.favorite_genres === 'string'
              ? application.admin_approved_profile.favorite_genres.split(',').map(g => g.trim())
              : [],
          equipment: Array.isArray(application.admin_approved_profile.equipment)
            ? application.admin_approved_profile.equipment
            : typeof application.admin_approved_profile.equipment === 'string'
              ? application.admin_approved_profile.equipment.split(',').map(e => e.trim())
              : []
        });
      }
      
      // Insert into appropriate table
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([transformedProfile]);

      if (insertError) throw insertError;

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
      setError(error.message);
      throw error; // Re-throw to prevent further execution
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