import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
          .in("status", ["pending", "pending_user_approval"])
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
              className="bg-covenLightPurple rounded-lg p-6 border border-white transition-colors"
            >
              <Link 
                to={`/admin/applications/${application.id}`}
                className="block"
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
                    <p className="text-gray-300">
                      Status: {application.status === "pending_user_approval" ? "Waiting for user approval" : "Pending review"}
                    </p>
                  </div>
                  <Button 
                    text={
                      <>
                        View Application <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                      </>
                    }
                    className="px-6 py-2 rounded  transition-color"
                    link={`/admin/applications/${application.id}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div>
                    <p>
                      <strong>Email:</strong> {application.email}
                    </p>
                    <p>
                      <strong>School:</strong> {application.school}
                    </p>
                  </div>

                  <div>
                    {application.application_type === "artist" && (
                      <>
                        <p>
                          <strong>Artist Type:</strong> {application.artist_type}
                        </p>
                        <p>
                          <strong>Genres:</strong>{" "}
                          {Array.isArray(application.genres)
                            ? application.genres.join(", ")
                            : application.genres}
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
                          {Array.isArray(application.favorite_artists)
                            ? application.favorite_artists.join(", ")
                            : application.favorite_artists}
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
                          {Array.isArray(application.favorite_genres)
                            ? application.favorite_genres.join(", ")
                            : application.favorite_genres}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
