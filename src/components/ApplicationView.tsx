import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import Button from "./common/Button";
import AuthImage from "./common/AuthImage";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { addDays, differenceInDays, format } from 'date-fns';
import { User } from "@supabase/supabase-js";
import { ApplicationData, ProfileData, AllProfileKeys, ArtistProfileData, IndustryProfileData, InstrumentalistProfileData, ArtistApplication, IndustryApplication, InstrumentalistApplication } from "../types";

const parseStringArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return value.split(",").map((s) => s.trim());
  return [];
};

const ApplicationView: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { handleFinalizeProfile, handleUnpublishProfile } = useAdminDashboard(user);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user?.id)
          .single();

        if (profileError) throw profileError;
        setUserRole(profile?.role);
        if (profile?.role !== "admin") {
          navigate("/");
          return;
        }

        const { data, error } = await supabase
          .from("applications")
          .select("*, admin_approved_profile")
          .eq("id", applicationId)
          .single();

        if (error) throw error;

        const appData = data as ApplicationData;

        setApplication({
          ...appData,
          admin_approved_profile: appData.admin_approved_profile || ({} as ProfileData),
        });

        const initialProfileData: ProfileData = {
          name: appData.name || "",
          photo_url: appData.photo_url || "",
          email: appData.email || "",
          location: appData.location || "",
          bio: appData.bio || "",
          instagram_link: (appData as ArtistApplication).instagram_link || "",
          streaming_link: (appData as ArtistApplication).streaming_links?.[0] || "",
          ...(appData.application_type === "artist" && {
            artist_type: (appData as ArtistApplication).artist_type || "",
            genres: parseStringArray((appData as ArtistApplication).genres || []),
            streaming_links: parseStringArray((appData as ArtistApplication).streaming_links || []),
            influences: parseStringArray((appData as ArtistApplication).influences || []),
            years_active: (appData as ArtistApplication).years_active || "",
            current_needs: (appData as ArtistApplication).current_needs || "",
            type: (appData as ArtistApplication).type || "",
          }),
          ...(appData.application_type === "industry" && {
            industry_role: (appData as IndustryApplication).industry_role || "",
            company: (appData as IndustryApplication).company || "",
            years_experience: (appData as IndustryApplication).years_experience || "",
            expertise_areas: parseStringArray((appData as IndustryApplication).expertise_areas || []),
            favorite_artists: parseStringArray((appData as IndustryApplication).favorite_artists || []),
            website: (appData as IndustryApplication).website || "",
            linkedin: (appData as IndustryApplication).linkedin || "",
          }),
          ...(appData.application_type === "instrumentalist" && {
            instrument: (appData as InstrumentalistApplication).instrument || "",
            years_experience: (appData as InstrumentalistApplication).years_experience || "",
            equipment: parseStringArray((appData as InstrumentalistApplication).equipment || []),
            rate: (appData as InstrumentalistApplication).rate || "",
          }),
        };
        setProfileData(initialProfileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, user?.id, navigate]);

  useEffect(() => {
    if (application) {
      setApplication((prev: ApplicationData | null) => {
        if (!prev) return null;
        return {
          ...prev,
          admin_approved_profile: profileData,
        };
      });
    }
  }, [application, profileData]);

  const handleInputChange = (field: AllProfileKeys, value: string | number) => {
    setProfileData((prev: ProfileData) => ({
      ...prev,
      [field]: field === "years_experience" ? parseInt(value as string) || "" : value,
    }));
  };

  const handleArrayInputChange = (field: AllProfileKeys, value: string) => {
    const arrayValue = value.split(",").map((item) => item.trim());
    setProfileData((prev: ProfileData) => ({
      ...prev,
      [field]: arrayValue,
    }));
  };

  const handleApprove = async () => {
    try {
      setLoading(true);

      const now = new Date().toISOString();
      const autoApprovalDate = addDays(new Date(), 7).toISOString();

      const cleanedProfileData = { ...profileData };
      const unwantedFields = ["availability", "portfolio_links", "preferred_styles"];
      unwantedFields.forEach((field) => delete cleanedProfileData[field as keyof typeof cleanedProfileData]);

      if (!application) return;

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "pending_user_approval",
          reviewed_at: now,
          reviewed_by: user?.id,
          admin_approved_profile: cleanedProfileData,
          sent_for_approval_at: now,
          auto_approval_date: autoApprovalDate,
          status_history: [
            ...(application.status_history || []),
            {
              status: "pending_user_approval",
              timestamp: now,
              user_id: user?.id,
            },
          ],
          current_revision: (application.current_revision || 1) + 1,
          last_modified_at: now,
          last_modified_by: user?.id,
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;
      navigate(userRole === "admin" ? "/admin" : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      if (!application) return;
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          status_history: [
            ...(application.status_history || []),
            {
              status: "rejected",
              timestamp: new Date().toISOString(),
              user_id: user?.id,
            },
          ],
        })
        .eq("id", application.id);

      if (error) throw error;
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setLoading(true);
      if (!application) return;
      await handleFinalizeProfile(application);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      
      const now = new Date().toISOString();
      const autoApprovalDate = addDays(new Date(), 7).toISOString();

      if (!application) return;

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          admin_approved_profile: profileData,
          last_modified_at: now,
          last_modified_by: user?.id,
          sent_for_approval_at: now,
          auto_approval_date: autoApprovalDate,
          status: "pending_user_approval",
          status_history: [
            ...(application.status_history || []),
            {
              status: "pending_user_approval",
              timestamp: now,
              user_id: user?.id,
              note: "Profile edited by admin"
            },
          ],
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const daysSinceApplication = application?.sent_for_approval_at ? 
    differenceInDays(new Date(), new Date(application.sent_for_approval_at)) : 0;
  
  if (loading)
    return <div className="text-white text-center mt-8">Loading...</div>;
  if (error)
      return <div className="text-red-500 text-center mt-8">{error as string || 'Unknown error' as string}</div>;
  if (!application)
    return (
      <div className="text-white text-center mt-8">Application not found</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-covenLightPurple rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Review Application</h1>
          <Button
            onClick={() => navigate("/admin")}
            text="← Back to Dashboard"
            className="bg-covenPurple hover:bg-opacity-80"
          />
        </div>

        <div className="bg-[#432347] rounded-lg border border-white overflow-hidden">
          {/* Header Section with Image */}
          <div className="relative h-24 bg-[#432347]">
            <div className="absolute -bottom-16 left-6 flex items-end">
              {application.photo_url ? (
                <AuthImage
                  src={application.photo_url}
                  alt={`${application.name}'s profile`}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-lg border-4 border-[#432347]"
                  fallbackSrc={application.photo_url}
                />
              ) : (
                <div className="w-32 h-32 rounded-lg border-4 border-[#432347] bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-white">
                    {application.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-4 mb-4">
                <h2 className="text-3xl font-bold text-white">
                  {application.name}
                </h2>
                <p className="text-gray-300">
                  {application.application_type.charAt(0).toUpperCase() +
                    application.application_type.slice(1)}{" "}
                  Application
                </p>
              </div>
            </div>
          </div>

          {/* Application Status */}
          <div className="px-6 pt-20 pb-6 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  application.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : application.status === "pending_user_approval"
                    ? "bg-blue-500/20 text-blue-300"
                    : application.status === "approved"
                    ? "bg-green-500/20 text-green-300"
                    : application.status === "finalized"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {application.status === "pending"
                  ? "Pending Review"
                  : application.status === "pending_user_approval"
                  ? "Waiting for User Approval"
                  : application.status === "approved"
                  ? "Approved"
                  : application.status === "finalized"
                  ? "Finalized"
                  : "Rejected"}
              </span>
              {application.sent_for_approval_at && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-300">
                    Days since sent for approval: {daysSinceApplication}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                  Basic Information
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong>Date Applied:</strong>{" "}
                    {format(new Date(application.created_at), 'MMM d, yyyy')}
                  </p>
                  {application.sent_for_approval_at && (
                    <p>
                      <strong>Sent for Approval:</strong>{" "}
                      {format(new Date(application.sent_for_approval_at), 'MMM d, yyyy')}
                      {application.status === 'pending_user_approval' && (
                        <span className="ml-2 text-gray-400">
                          ({daysSinceApplication} days ago)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Type-specific fields */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                  {application.application_type.charAt(0).toUpperCase() +
                    application.application_type.slice(1)}{" "}
                  Details
                </h3>

                {application.application_type === "artist" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Artist Type
                      </label>
                      <input
                        type="text"
                        value={(profileData as ArtistProfileData).artist_type || ""}
                        onChange={(e) =>
                          handleInputChange("artist_type", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Years Active
                      </label>
                      <input
                        type="text"
                        value={(profileData as ArtistProfileData).years_active || ""}
                        onChange={(e) =>
                          handleInputChange("years_active", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Genres (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={((profileData as ArtistProfileData).genres || []).join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange("genres", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Influences (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={((profileData as ArtistProfileData).influences || []).join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange("influences", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Current Needs
                      </label>
                      <textarea
                        value={(profileData as ArtistProfileData).current_needs || ""}
                        onChange={(e) =>
                          handleInputChange("current_needs", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {application.application_type === "industry" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Industry Role
                      </label>
                      <input
                        type="text"
                        value={(profileData as IndustryProfileData).industry_role || ""}
                        onChange={(e) =>
                          handleInputChange("industry_role", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={(profileData as IndustryProfileData).company || ""}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={(profileData as IndustryProfileData).years_experience || ""}
                        onChange={(e) =>
                          handleInputChange("years_experience", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Expertise Areas (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={((profileData as IndustryProfileData).expertise_areas || []).join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "expertise_areas",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={(profileData as IndustryProfileData).website || ""}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Favorite Artists (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={((profileData as IndustryProfileData).favorite_artists || []).join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "favorite_artists",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {application.application_type === "instrumentalist" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Instrument
                      </label>
                      <input
                        type="text"
                        value={(profileData as InstrumentalistProfileData).instrument || ""}
                        onChange={(e) =>
                          handleInputChange("instrument", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={(profileData as InstrumentalistProfileData).years_experience || ""}
                        onChange={(e) =>
                          handleInputChange("years_experience", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Equipment
                      </label>
                      <textarea
                        value={((profileData as InstrumentalistProfileData).equipment || []).join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange("equipment", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Rate</label>
                      <input
                        type="text"
                        value={(profileData as InstrumentalistProfileData).rate || ""}
                        onChange={(e) =>
                          handleInputChange("rate", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                        placeholder="Hourly or per-project rate"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Original Application Data */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Original Application Data
              </h3>
              <div className="bg-covenPurple rounded p-4 text-gray-300">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(application, null, 2)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/20">
              {application?.status === "pending" && (
                <>
                  <Button
                    onClick={handleReject}
                    text="Reject Application"
                    className="bg-red-600 hover:bg-red-700 px-6"
                  />
                  <Button
                    onClick={handleApprove}
                    text="Approve & Send to User"
                    className="bg-green-600 hover:bg-green-700 px-6"
                  />
                </>
              )}
              {application?.status === "pending_user_approval" && (
                <>
                  <Button
                    onClick={handleEditProfile}
                    text="Save Changes & Resend"
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                  />
                </>
              )}
              {application?.status === "approved" && (
                <Button
                  onClick={handleFinalize}
                  text="Create Page"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                />
              )}
              {application?.status === "finalized" && (
                <Button
                  onClick={() => handleUnpublishProfile(application as ApplicationData)}
                  text="Unpublish Page"
                  className="bg-red-600 hover:bg-red-700 px-6"
                  disabled={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
