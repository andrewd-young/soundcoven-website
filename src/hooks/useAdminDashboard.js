import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { differenceInDays } from "date-fns";

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
      // Define the allowed fields for each profile type
      const allowedFields = {
        instrumentalist: [
          'name',
          'bio',
          'email',
          'profile_image_url',
          'user_id',
          'created_at',
          'updated_at',
          'instrument',
          'years_experience',
          'equipment',
          'rate',
          'location',
          'social_links',
        ],
        artist: [
          'name',
          'bio',
          'email',
          'profile_image_url',
          'user_id',
          'created_at',
          'updated_at',
          'artist_type',
          'genres',
          'influences',
          'streaming_links',
          'location',
          'social_links',
        ],
        industry: [
          'name',
          'bio',
          'email',
          'profile_image_url',
          'user_id',
          'created_at',
          'updated_at',
          'industry_role',
          'company',
          'expertise_areas',
          'website',
          'location',
          'social_links',
          'favorite_artists',
        ],
      };

      // Define which fields should be arrays
      const arrayFields = [
        'equipment',
        'genres',
        'influences',
        'streaming_links',
        'expertise_areas',
        'favorite_artists',
      ];

      // Get the allowed fields for this application type
      const allowed = allowedFields[application.application_type];
      if (!allowed) {
        throw new Error(`Unknown application type: ${application.application_type}`);
      }
      
      // Format social links
      const socialLinks = {
        ...(application.admin_approved_profile.social_links || {}),
      };
      
      // Only add website and linkedin if they exist
      if (application.admin_approved_profile.website) {
        socialLinks.website = application.admin_approved_profile.website;
      }
      if (application.admin_approved_profile.linkedin) {
        socialLinks.linkedin = application.admin_approved_profile.linkedin;
      }

      // Filter and format the profile data
      const profileData = {
        ...application.admin_approved_profile,
        user_id: application.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        social_links: socialLinks,
        favorite_artists: application.favorite_artists || [],
        profile_image_url: application.photo_url || null, // Use the original photo_url directly
      };

      // Special handling for artist_type
      if (application.application_type === 'artist') {
        // Map common variations to allowed values
        const artistTypeMap = {
          'solo artist': 'solo',
          'solo': 'solo',
          'band': 'band',
          'duo': 'duo'
        };

        const rawArtistType = (application.admin_approved_profile.artist_type || '').toLowerCase();
        profileData.artist_type = artistTypeMap[rawArtistType] || 'solo';
      }

      // Remove standalone website and linkedin fields as they're now in social_links
      delete profileData.website;
      delete profileData.linkedin;

      // Create a new object with only the allowed fields and proper array formatting
      const cleanedProfileData = Object.keys(profileData)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            if (arrayFields.includes(key)) {
              obj[key] = Array.isArray(profileData[key]) 
                ? profileData[key]
                : profileData[key].split(',').map(item => item.trim());
            } else {
              obj[key] = profileData[key];
            }
          }
          return obj;
        }, {});

      // Debug the final data
      // console.log('Final profile data:', cleanedProfileData);
      // console.log('Artist type in final data:', cleanedProfileData.artist_type);

      // Create the profile
      const { data: newProfile, error: profileError } = await supabase
        .from(getTableName(application.application_type))
        .insert([cleanedProfileData])
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

  const handleManualApprove = async (application) => {
    try {
      const now = new Date().toISOString();
      
      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          last_modified_at: now,
          last_modified_by: user.id,
          status_history: [
            ...(application.status_history || []),
            {
              status: "approved",
              timestamp: now,
              user_id: user.id,
              note: "Manually approved by admin after 7 days"
            },
          ],
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;
      
      // Update local state
      setFilteredApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, status: 'approved' }
            : app
        )
      );
    } catch (err) {
      console.error('Error approving application:', err);
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
    handleFinalizeProfile,
    handleManualApprove,
  };
};

export const shouldShowManualApprove = (application) => {
  if (!application || application.status !== 'pending_user_approval') {
    return false;
  }
  
  // Find the pending_user_approval status entry in history
  const pendingUserApprovalEntry = application.status_history?.find(
    entry => entry.status === 'pending_user_approval'
  );
  
  if (!pendingUserApprovalEntry) {
    return false;
  }

  const daysSinceApproval = differenceInDays(
    new Date(),
    new Date(pendingUserApprovalEntry.timestamp)
  );
  
  return daysSinceApproval >= 7;
}; 