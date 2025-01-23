import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import Button from "./common/Button";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simplified profile query
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

        // Simplified applications query
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  const handleApprove = async (application) => {
    try {
      setLoading(true);

      // Update application status
      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", application.id);

      if (applicationError) throw applicationError;

      // Insert into appropriate table based on application type
      const { error: insertError } = await supabase
        .from(
          application.application_type === "artist"
            ? "artists"
            : application.application_type === "industry"
            ? "industry_pros"
            : "instrumentalists"
        )
        .insert([
          {
            user_id: application.user_id,
            name: application.name,
            photo_url: application.photo_url,
            email: application.email,
            ...(application.application_type === "artist" && {
              artist_type: application.artist_type,
              genres: application.genres,
              streaming_links: application.streaming_links,
              current_needs: application.current_needs,
              upcoming_show: application.upcoming_show,
              influences: application.influences,
            }),
            ...(application.application_type === "industry" && {
              industry_role: application.industry_role,
              favorite_artists: application.favorite_artists,
            }),
            ...(application.application_type === "instrumentalist" && {
              instrument: application.instrument,
              favorite_genres: application.favorite_genres,
            }),
          },
        ]);

      if (insertError) throw insertError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: application.application_type,
        })
        .eq("id", application.user_id);

      if (profileError) throw profileError;

      // Remove approved application from state
      setApplications(applications.filter((app) => app.id !== application.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", applicationId);

      if (error) throw error;
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-white text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

      {applications.length === 0 ? (
        <p className="text-white text-center">No pending applications</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-[#432347] rounded-lg p-6 border border-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl text-white font-semibold">
                    {application.name}
                  </h2>
                  <p className="text-gray-300">
                    {application.application_type.charAt(0).toUpperCase() +
                      application.application_type.slice(1)}{" "}
                    Application
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(application)}
                    text="Approve"
                    className="bg-green-600 hover:bg-green-700"
                  />
                  <Button
                    onClick={() => handleReject(application.id)}
                    text="Reject"
                    className="bg-red-600 hover:bg-red-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div>
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                  <p>
                    <strong>School:</strong> {application.school}
                  </p>
                  {application.note && (
                    <p>
                      <strong>Note:</strong> {application.note}
                    </p>
                  )}
                </div>

                <div>
                  {application.application_type === "artist" && (
                    <>
                      <p>
                        <strong>Artist Type:</strong> {application.artist_type}
                      </p>
                      <p>
                        <strong>Genres:</strong> {application.genres}
                      </p>
                      <p>
                        <strong>Streaming Links:</strong>{" "}
                        {application.streaming_links}
                      </p>
                    </>
                  )}

                  {application.application_type === "industry" && (
                    <>
                      <p>
                        <strong>Industry Role:</strong>{" "}
                        {application.industry_role}
                      </p>
                      <p>
                        <strong>Favorite Artists:</strong>{" "}
                        {application.favorite_artists}
                      </p>
                    </>
                  )}

                  {application.application_type === "instrumentalist" && (
                    <>
                      <p>
                        <strong>Instrument:</strong> {application.instrument}
                      </p>
                      <p>
                        <strong>Favorite Genres:</strong>{" "}
                        {application.favorite_genres}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {application.photo_url && (
                <div className="mt-4">
                  <img
                    src={application.photo_url}
                    alt={`${application.name}'s photo`}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
