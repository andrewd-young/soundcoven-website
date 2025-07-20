import { differenceInDays } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ApplicationData,
  ArtistApplication,
  IndustryApplication,
} from "../types/Application";
import supabase from "../utils/supabase";

// Remove unused ApplicationHistoryEntry, InstrumentalistApplication, ProfileData

type Application = ApplicationData;

export const useAdminDashboard = (user: { id: string } | null) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");

  const getTableName = (
    applicationType: Application["application_type"],
  ): string => {
    switch (applicationType) {
      case "artist":
        return "artists";
      case "instrumentalist":
        return "instrumentalists";
      case "industry":
        return "industry_professionals";
      default:
        throw new Error(`Unknown application type: ${applicationType}`);
    }
  };

  const fetchApplications = useCallback(async () => {
    try {
      if (!user) {
        navigate("/");
        return;
      }

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
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleFinalizeProfile = async (application: Application) => {
    try {
      const allowedFields = {
        instrumentalist: [
          "name",
          "bio",
          "email",
          "profile_image_url",
          "user_id",
          "created_at",
          "updated_at",
          "instrument",
          "years_experience",
          "equipment",
          "rate",
          "location",
          "social_links",
          "school",
          "favorite_genres",
        ],
        artist: [
          "name",
          "bio",
          "email",
          "profile_image_url",
          "user_id",
          "created_at",
          "updated_at",
          "artist_type",
          "genres",
          "influences",
          "streaming_links",
          "location",
          "social_links",
          "school",
        ],
        industry: [
          "name",
          "bio",
          "email",
          "profile_image_url",
          "user_id",
          "created_at",
          "updated_at",
          "industry_role",
          "company",
          "expertise_areas",
          "location",
          "social_links",
          "favorite_artists",
          "school",
          "phone",
          "role",
          "years_experience",
        ],
      };

      const arrayFields = [
        "equipment",
        "genres",
        "influences",
        "streaming_links",
        "expertise_areas",
        "favorite_artists",
        "favorite_genres",
        "current_needs",
        "upcoming_shows",
      ];

      const allowed = allowedFields[application.application_type];
      if (!allowed) {
        throw new Error(
          `Unknown application type: ${application.application_type}`,
        );
      }

      const { error: deleteError } = await supabase
        .from(getTableName(application.application_type))
        .delete()
        .eq("user_id", application.user_id);

      if (deleteError) {
        console.error("Error deleting existing profile:", deleteError);
        throw deleteError;
      }

      // Use application.social_links and application.school as fallback
      const socialLinks = {
        ...(application.social_links || {}),
      };
      if (
        (application.admin_approved_profile as IndustryApplication)?.website
      ) {
        socialLinks.website = (
          application.admin_approved_profile as IndustryApplication
        ).website!;
      }
      if (
        (application.admin_approved_profile as IndustryApplication)?.linkedin
      ) {
        socialLinks.linkedin = (
          application.admin_approved_profile as IndustryApplication
        ).linkedin!;
      }

      // Helper to safely get string[] from possible string | string[] | undefined
      function toStringArray(val: unknown): string[] {
        if (Array.isArray(val)) return val as string[];
        if (typeof val === "string") return val.split(",").map((v) => v.trim());
        return [];
      }

      const genresVal =
        (application as ArtistApplication).genres ??
        (application.admin_approved_profile as ArtistApplication)?.genres;
      const influencesVal =
        (application as ArtistApplication).influences ??
        (application.admin_approved_profile as ArtistApplication)?.influences;
      const favoriteArtistsVal =
        (application as IndustryApplication).favorite_artists ??
        (application.admin_approved_profile as IndustryApplication)
          ?.favorite_artists;

      const profileData: Record<string, unknown> = {
        ...application.admin_approved_profile,
        user_id: application.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        social_links: socialLinks,
        streaming_links: Array.isArray(
          (application as ArtistApplication).streaming_links,
        )
          ? (application as ArtistApplication).streaming_links
          : Array.isArray(
                (application.admin_approved_profile as ArtistApplication)
                  ?.streaming_links,
              )
            ? ((application.admin_approved_profile as ArtistApplication)
                ?.streaming_links ?? [])
            : [],
        school: application.school || null,
        genres: toStringArray(genresVal),
        influences: toStringArray(influencesVal),
        favorite_artists: toStringArray(favoriteArtistsVal),
        profile_image_url: application.photo_url || null,
      };

      if (application.application_type === "artist") {
        const artistTypeMap: Record<string, string> = {
          "solo artist": "solo",
          solo: "solo",
          band: "band",
          duo: "duo",
        };

        const rawArtistType = (
          (application.admin_approved_profile as ArtistApplication)
            ?.artist_type || ""
        ).toLowerCase();
        profileData.artist_type = artistTypeMap[rawArtistType] || "solo";
      }

      delete profileData.website;
      delete profileData.linkedin;

      // Use Record<string, unknown> for cleanedProfileData
      const cleanedProfileData = Object.keys(profileData)
        .filter((key) => allowed.includes(key))
        .reduce((obj: Record<string, unknown>, key: string) => {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            if (arrayFields.includes(key)) {
              obj[key] = Array.isArray(profileData[key])
                ? profileData[key]
                : typeof profileData[key] === "string"
                  ? (profileData[key] as string)
                      .split(",")
                      .map((item: string) => item.trim())
                  : [];
            } else {
              obj[key] = profileData[key];
            }
          }
          return obj;
        }, {});

      const { data: newProfile, error: profileError } = await supabase
        .from(getTableName(application.application_type))
        .insert([cleanedProfileData])
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      if (!newProfile) {
        throw new Error("Profile was not created");
      }

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "finalized",
          status_history: [
            ...(application.status_history || []),
            {
              status: "finalized",
              timestamp: new Date().toISOString(),
              user_id: user?.id,
            },
          ],
          finalized_at: new Date().toISOString(),
          finalized_by: user?.id,
        })
        .eq("id", application.id);

      if (applicationError) {
        console.error("Application update error:", applicationError);
        throw applicationError;
      }

      setFilteredApplications((prev) =>
        prev.map((app) =>
          app.id === application.id ? { ...app, status: "finalized" } : app,
        ),
      );
    } catch (error) {
      console.error("Error finalizing profile:", error);
      throw error;
    }
  };

  const handleManualApprove = async (application: Application) => {
    try {
      const now = new Date().toISOString();

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          last_modified_at: now,
          last_modified_by: user?.id,
          status_history: [
            ...(application.status_history || []),
            {
              status: "approved",
              timestamp: now,
              user_id: user?.id,
              note: "Manually approved by admin after 7 days",
            },
          ],
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;

      setFilteredApplications((prev) =>
        prev.map((app) =>
          app.id === application.id ? { ...app, status: "approved" } : app,
        ),
      );
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  const handleUnpublishProfile = async (application: Application) => {
    try {
      const { error: deleteError } = await supabase
        .from(getTableName(application.application_type))
        .delete()
        .eq("user_id", application.user_id);

      if (deleteError) throw deleteError;

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          status_history: [
            ...(application.status_history || []),
            {
              status: "approved",
              timestamp: new Date().toISOString(),
              user_id: user?.id,
              note: "Unpublished by admin",
            },
          ],
          last_modified_at: new Date().toISOString(),
          last_modified_by: user?.id,
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;

      setFilteredApplications((prev) =>
        prev.map((app) =>
          app.id === application.id ? { ...app, status: "approved" } : app,
        ),
      );
    } catch (error) {
      console.error("Error unpublishing profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const filtered = applications.filter(
      (app) => app.status === selectedStatus,
    );
    setFilteredApplications(filtered);
  }, [selectedStatus, applications]);

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
    handleUnpublishProfile,
  };
};

export const shouldShowManualApprove = (application: Application) => {
  if (!application || application.status !== "pending_user_approval") {
    return false;
  }

  const pendingUserApprovalEntry = application.status_history?.find(
    (entry) => entry.status === "pending_user_approval",
  );

  if (!pendingUserApprovalEntry) {
    return false;
  }

  const daysSinceApproval = differenceInDays(
    new Date(),
    new Date(pendingUserApprovalEntry.timestamp),
  );

  return daysSinceApproval >= 7;
};
