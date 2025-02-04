import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import Button from "./common/Button";
import { OptimizedImage } from './common/OptimizedImage';

const ApplicationView = () => {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Check if user is admin
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

        // Fetch application
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("id", applicationId)
          .single();

        if (error) throw error;
        setApplication(data);

        // Initialize profile data based on application type
        const initialProfileData = {
          name: data.name || "",
          photo_url: data.photo_url || "",
          email: data.email || "",
          location: data.location || "",
          age: data.age || "",
          years_active: data.years_active || "",
          bio: data.bio || "",
          streaming_link: data.streaming_link || "",
          instagram_link: data.instagram_link || "",
          genre: data.genre || "",
          type: data.type || "",
          influences: Array.isArray(data.influences) ? data.influences : (data.influences ? [data.influences] : []),
          ...(data.application_type === "artist" && {
            artist_type: data.artist_type || "",
            genres: Array.isArray(data.genres) ? data.genres : (data.genres ? [data.genres] : []),
            streaming_links: Array.isArray(data.streaming_links) ? data.streaming_links : (data.streaming_links ? [data.streaming_links] : []),
            current_needs: data.current_needs || "",
            upcoming_show: data.upcoming_show || "",
            social_links: {},
          }),
          ...(data.application_type === "industry" && {
            industry_role: data.industry_role || "",
            favorite_artists: Array.isArray(data.favorite_artists) ? data.favorite_artists : (data.favorite_artists ? [data.favorite_artists] : []),
            bio: "",
            company: "",
            years_experience: "",
            expertise_areas: [],
          }),
          ...(data.application_type === "instrumentalist" && {
            instrument: data.instrument || "",
            favorite_genres: Array.isArray(data.favorite_genres) ? data.favorite_genres : (data.favorite_genres ? [data.favorite_genres] : []),
            bio: "",
            years_experience: "",
            preferred_styles: [],
            equipment: "",
          }),
        };
        setProfileData(initialProfileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, user.id, navigate]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field, value) => {
    // Convert comma-separated string to array
    const arrayValue = value.split(",").map((item) => item.trim());
    setProfileData((prev) => ({
      ...prev,
      [field]: arrayValue,
    }));
  };

  const handleApprove = async () => {
    try {
      setLoading(true);

      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "pending_user_approval",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          admin_approved_profile: profileData,
          status_history: [...(application.status_history || []), {
            status: "pending_user_approval",
            timestamp: new Date().toISOString(),
            user_id: user.id
          }],
          current_revision: (application.current_revision || 1) + 1,
          last_modified_at: new Date().toISOString(),
          last_modified_by: user.id
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          status_history: [...(application.status_history || []), {
            status: "rejected",
            timestamp: new Date().toISOString(),
            user_id: user.id
          }]
        })
        .eq("id", application.id);

      if (error) throw error;
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!application) return <div className="text-white text-center mt-8">Application not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
                <OptimizedImage
                  src={application.photo_url}
                  alt={`${application.name}'s profile`}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-lg border-4 border-[#432347]"
                  objectFit="cover"
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
              <span className={`px-3 py-1 rounded-full text-sm ${
                application.status === "pending" 
                  ? "bg-yellow-500/20 text-yellow-300"
                  : application.status === "pending_user_approval"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-red-500/20 text-red-300"
              }`}>
                {application.status === "pending" 
                  ? "Pending Review"
                  : application.status === "pending_user_approval"
                  ? "Waiting for User Approval"
                  : "Rejected"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">Submitted: {new Date(application.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Common Fields */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                  Basic Information
                </h3>
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
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={profileData.age || ""}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Years Active</label>
                  <input
                    type="number"
                    value={profileData.years_active || ""}
                    onChange={(e) => handleInputChange("years_active", e.target.value)}
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
                    application.application_type.slice(1)} Details
                </h3>
                
                {application.application_type === "artist" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">Artist Type</label>
                      <input
                        type="text"
                        value={profileData.artist_type || ""}
                        onChange={(e) => handleInputChange("artist_type", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Genres (comma-separated)</label>
                      <input
                        type="text"
                        value={(profileData.genres || []).join(", ")}
                        onChange={(e) => handleArrayInputChange("genres", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Streaming Links (comma-separated)</label>
                      <input
                        type="text"
                        value={(profileData.streaming_links || []).join(", ")}
                        onChange={(e) => handleArrayInputChange("streaming_links", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {application.application_type === "industry" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">Industry Role</label>
                      <input
                        type="text"
                        value={profileData.industry_role || ""}
                        onChange={(e) => handleInputChange("industry_role", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={profileData.company || ""}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Years of Experience</label>
                      <input
                        type="text"
                        value={profileData.years_experience || ""}
                        onChange={(e) => handleInputChange("years_experience", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {application.application_type === "instrumentalist" && (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">Instrument</label>
                      <input
                        type="text"
                        value={profileData.instrument || ""}
                        onChange={(e) => handleInputChange("instrument", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Favorite Genres (comma-separated)</label>
                      <input
                        type="text"
                        value={(profileData.favorite_genres || []).join(", ")}
                        onChange={(e) => handleArrayInputChange("favorite_genres", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Equipment</label>
                      <input
                        type="text"
                        value={profileData.equipment || ""}
                        onChange={(e) => handleInputChange("equipment", e.target.value)}
                        className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Original Application Data */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Original Application Data</h3>
              <div className="bg-covenPurple rounded p-4 text-gray-300">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(application, null, 2)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/20">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView; 