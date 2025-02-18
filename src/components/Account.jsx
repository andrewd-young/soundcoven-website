import React from "react";
import Button from "./common/Button";
import { useAccount } from "../hooks/useAccount";

const Account = () => {
  const {
    user,
    loading,
    message,
    userDetails,
    profile,
    application,
    setUserDetails,
    handleUpdateEmail,
    handleAcceptProfile,
    formatRole,
    formatApplicationStatus,
    navigate
  } = useAccount();

  if (!user) return <div>Please sign in</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {message && (
          <div className="mb-8 p-4 rounded-lg border text-center">
            <p className={`text-lg ${message.includes('error') ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-green-900/50 border-green-500 text-green-400'}`}>
              {message}
            </p>
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-8">Account Settings</h1>

        {/* Success Box - Show when application is submitted and pending */}
        {application?.status === "pending" && (
          <div className="mb-8 p-6 bg-green-900/50 rounded-lg border border-green-500">
            <h2 className="text-2xl font-semibold text-white mb-2">Application Submitted!</h2>
            <p className="text-gray-300 mb-4">
              While we review your application, explore our community of artists
              and industry professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/artists")}
                text="View Artists"
                className="bg-green-600 hover:bg-green-700 text-white"
              />
              <Button
                onClick={() => navigate("/industry-pros")}
                text="View Industry Pros"
                className="bg-green-600 hover:bg-green-700 text-white"
              />
            </div>
          </div>
        )}

        {/* Show admin-approved profile for user acceptance */}
        {application?.status === "pending_user_approval" && application?.admin_approved_profile && (
          <div className="mb-8 p-6 bg-green-900/50 rounded-lg border border-green-500">
            <h2 className="text-2xl font-semibold text-white mb-2">Profile Ready for Review</h2>
            <p className="text-gray-300 mb-4">
              An admin has reviewed your application and prepared your profile. Please review the details below:
            </p>
            
            <div className="bg-covenLightPurple rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Profile Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-300">
                <div className="space-y-3">
                  <p><strong className="text-white">Name:</strong> {application.admin_approved_profile.name}</p>
                  <p><strong className="text-white">Email:</strong> {application.admin_approved_profile.email}</p>
                  <p className="break-words"><strong className="text-white">Bio:</strong> {application.admin_approved_profile.bio}</p>
                </div>
                
                {application.application_type === "artist" && (
                  <div className="space-y-3">
                    <p><strong className="text-white">Artist Type:</strong> {application.admin_approved_profile.artist_type}</p>
                    <p className="break-words"><strong className="text-white">Genres:</strong> {application.admin_approved_profile.genres.join(", ")}</p>
                    <p className="break-words"><strong className="text-white">Streaming Links:</strong> {application.admin_approved_profile.streaming_links.join(", ")}</p>
                  </div>
                )}

                {application.application_type === "industry" && (
                  <div className="space-y-3">
                    <p><strong className="text-white">Industry Role:</strong> {application.admin_approved_profile.industry_role}</p>
                    <p><strong className="text-white">Company:</strong> {application.admin_approved_profile.company}</p>
                    <p><strong className="text-white">Years of Experience:</strong> {application.admin_approved_profile.years_experience}</p>
                  </div>
                )}

                {application.application_type === "instrumentalist" && (
                  <div className="space-y-3">
                    <p><strong className="text-white">Instrument:</strong> {application.admin_approved_profile.instrument}</p>
                    <p className="break-words"><strong className="text-white">Favorite Genres:</strong> {application.admin_approved_profile.favorite_genres.join(", ")}</p>
                    <p><strong className="text-white">Equipment:</strong> {application.admin_approved_profile.equipment}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => navigate(`/applications/${application.id}/review`)}
                text="Request Changes"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              />
              <Button
                onClick={handleAcceptProfile}
                text={loading ? "Accepting..." : "Accept Profile"}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Profile Approved Message */}
        {application?.status === "approved" && (
          <div className="mb-8 p-6 bg-green-900/50 rounded-lg border border-green-500">
            <h2 className="text-2xl font-semibold text-white mb-2">Profile Approved!</h2>
            <p className="text-gray-300 mb-4">
              An admin will finalize your profile shortly.
            </p>
          </div>
        )}

        {/* Profile Information */}
        <div className="mb-8 p-6 bg-covenLightPurple rounded-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Profile</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold text-white">Role:</span>{" "}
              {formatRole(profile?.role)}
            </p>
            {profile?.role === "other" && profile?.other_description && (
              <p>
                <span className="font-semibold text-white">Description:</span>{" "}
                {profile.other_description}
              </p>
            )}
          </div>
        </div>

        {/* Application Status */}
        <div className="mb-8 p-6 bg-covenLightPurple rounded-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Application Status</h2>
          {profile?.role === "other" ? (
            <div className="space-y-3">
              <p className="text-gray-300 mb-4">
                You're currently registered as "Other". Would you like to apply
                as an artist, industry professional, or instrumentalist?
              </p>
              <Button
                onClick={() => navigate("/apply")}
                text="Change Role & Apply"
                className="bg-covenRed hover:bg-red-700 text-white"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Status:</span>{" "}
                {formatApplicationStatus(application?.status || "not_started")}
              </p>
              {application && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Type:</span>{" "}
                  {formatRole(application.application_type)}
                </p>
              )}
              {(!application ||
                !application.status ||
                application.status === "not_started" ||
                application.status === "draft") && (
                <Button
                  onClick={() => navigate(`/apply/${profile.role}`)}
                  text={application?.status === "draft" ? "Continue Application" : "Start Application"}
                  className="bg-covenRed hover:bg-red-700 mt-2 text-white"
                />
              )}
            </div>
          )}
        </div>

        {/* Email Update Form */}
        <form
          onSubmit={handleUpdateEmail}
          className="p-6 bg-covenLightPurple rounded-lg border border-white/20"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Email Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-covenPurple border border-white/20 rounded text-white focus:border-white focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              text={loading ? "Updating..." : "Change Email"}
              className="w-full disabled:opacity-50"
              onClick={handleUpdateEmail}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
