import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./common/Button";
import { Tab } from '@headlessui/react';
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AuthImage } from "./common/AuthImage";

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    filteredApplications,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    handleFinalizeProfile
  } = useAdminDashboard(user);

  const statusCategories = [
    { key: 'pending', label: 'New' },
    { key: 'pending_user_approval', label: 'Reviewed' },
    { key: 'approved', label: 'User Approved' },
    { key: 'changes_requested', label: 'Changes Requested' },
    { key: 'finalized', label: 'Finalized' }
  ];

  // Helper function to get status display text
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'pending_user_approval':
        return 'Waiting for User Approval';
      case 'changes_requested':
        return 'Changes Requested';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  // Helper function to get status color classes
  const getStatusColorClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'pending_user_approval':
        return 'bg-blue-500/20 text-blue-300';
      case 'changes_requested':
        return 'bg-orange-500/20 text-orange-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getOptimizedImageUrl = (url) => {
    if (!url) return url;
    // Only add transformation parameters if it's a Supabase storage URL
    if (url.includes('storage.googleapis.com') || url.includes('supabase')) {
      return `${url}?width=1200&quality=75&format=jpeg`;
    }
    return url;
  };

  if (loading)
    return <div className="text-white text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

      <Tab.Group onChange={(index) => setSelectedStatus(statusCategories[index].key)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-covenPurple p-1 mb-6">
          {statusCategories.map((category) => (
            <Tab
              key={category.key}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected 
                   ? 'bg-white text-covenPurple'
                   : 'text-white hover:bg-white/[0.12]'
                 }`
              }
            >
              {category.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      {filteredApplications.length === 0 ? (
        <p className="text-white text-center">No applications found</p>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-covenLightPurple rounded-lg p-6 border border-white transition-colors flex justify-between"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <Link 
                    to={`/admin/applications/${application.id}`}
                    className="flex-grow cursor-pointer"
                  >
                    <div>
                      <h2 className="text-2xl text-white font-semibold">
                        {application.name}
                      </h2>
                      <p className="text-gray-300">
                        {application.application_type.charAt(0).toUpperCase() +
                          application.application_type.slice(1)}{" "}
                        Application
                      </p>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColorClasses(application.status)}`}>
                        {getStatusDisplay(application.status)}
                      </p>
                    </div>
                  </Link>
                </div>

                <Link 
                  to={`/admin/applications/${application.id}`}
                  className="block"
                >
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

                {application.status === "approved" && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleFinalizeProfile(application)}
                      text="Create Artist Page"
                      className="bg-green-600 hover:bg-green-700 text-white mt-4"
                      disabled={loading}
                    />
                    <Button 
                      text={
                        <>
                          View Application <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </>
                      }
                      className="px-6 py-2 rounded transition-color mt-4"
                      link={`/admin/applications/${application.id}`}
                    />
                  </div>
                )}
              </div>

              <AuthImage
                src={application.photo_url}
                alt={`${application.name}'s photo`}
                width={200}
                height={200}
                className="rounded-lg ml-4"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
