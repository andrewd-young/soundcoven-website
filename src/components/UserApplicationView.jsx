import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import Button from "./common/Button";
import { AuthImage } from "./common/AuthImage";

const UserApplicationView = () => {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [modificationRequest, setModificationRequest] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("id", applicationId)
          .single();

        if (error) throw error;
        if (data.user_id !== user.id) {
          navigate("/");
          return;
        }

        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, user.id, navigate]);

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "approved",
          status_history: [
            ...(application.status_history || []),
            {
              status: "approved",
              timestamp: new Date().toISOString(),
              user_id: user.id,
            },
          ],
        })
        .eq("id", applicationId);

      if (error) throw error;
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRequestChanges = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "changes_requested",
          modification_requests: [
            ...(application.modification_requests || []),
            modificationRequest,
          ],
          status_history: [
            ...(application.status_history || []),
            {
              status: "changes_requested",
              timestamp: new Date().toISOString(),
              user_id: user.id,
              message: modificationRequest,
            },
          ],
        })
        .eq("id", applicationId);

      if (error) throw error;
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="text-white text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  if (!application) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-covenLightPurple rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Review Your Application
        </h1>

        {application.status === "pending_user_approval" && (
          <div className="bg-green-500/20 text-green-300 p-4 rounded-lg mb-6">
            Your application was approved! Please review the details below.
          </div>
        )}

        {/* Display the admin-approved profile data */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Approved Profile Details
          </h2>
          <pre className="bg-covenPurple p-4 rounded text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(application.admin_approved_profile, null, 2)}
          </pre>
        </div>

        {/* Request Changes Form */}
        <div className="mb-6">
          <label className="block text-white mb-2">Request Changes</label>
          <textarea
            value={modificationRequest}
            onChange={(e) => setModificationRequest(e.target.value)}
            className="w-full px-3 py-2 bg-covenPurple border border-white/20 rounded text-white"
            rows={4}
            placeholder="Describe any changes you'd like to request..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={handleRequestChanges}
            text="Request Changes"
            className="bg-yellow-600 hover:bg-yellow-700"
            disabled={!modificationRequest.trim()}
          />
          <Button
            onClick={handleApprove}
            text="Approve Profile"
            className="bg-green-600 hover:bg-green-700"
          />
        </div>

        {/* Application Photo */}
        {application.photo_url && (
          <AuthImage
            src={application.photo_url}
            alt={`${application.name}'s photo`}
            width={200}
            height={200}
            className="rounded-lg ml-4"
          />
        )}
      </div>
    </div>
  );
};

export default UserApplicationView;
