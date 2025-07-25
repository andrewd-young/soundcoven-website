import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./common/Button";
import { Tab } from '@headlessui/react';
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { ApplicationData, ArtistApplication, IndustryApplication, InstrumentalistApplication } from "../types/Application";
import AuthImage from "./common/AuthImage";
import { differenceInDays } from 'date-fns';
import { shouldShowManualApprove } from "../hooks/useAdminDashboard";

export const AdminDashboard = () => {
  const { user } = useAuth() as { user: User | null };
  const {
    filteredApplications,
    loading,
    error,
    setSelectedStatus,
    handleFinalizeProfile,
    handleManualApprove,
  } = useAdminDashboard(user);

  const statusCategories = [
    { key: 'pending', label: 'New' },
    { key: 'pending_user_approval', label: 'Reviewed' },
    { key: 'approved', label: 'User Approved' },
    { key: 'changes_requested', label: 'Changes Requested' },
    { key: 'finalized', label: 'Finalized' }
  ];

  // Helper function to get status display text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'pending_user_approval':
        return 'Waiting for User Approval';
      case 'changes_requested':
        return 'Changes Requested';
      case 'approved':
        return 'Approved';
      case 'finalized':
        return 'Finalized';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  // Helper function to get status color classes
  const getStatusColorClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'pending_user_approval':
        return 'bg-blue-500/20 text-blue-300';
      case 'changes_requested':
        return 'bg-orange-500/20 text-orange-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'finalized':
        return 'bg-purple-500/20 text-purple-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getDaysAgoText = (application: ApplicationData) => {
    if (!application) return '';
    
    // Get the most recent date based on status
    let date = application.created_at;
    if (application.finalized_at) date = application.finalized_at;
    else if (application.sent_for_approval_at) date = application.sent_for_approval_at;
    
    if (!date) return ''; // Handle case where date is undefined
    const days = differenceInDays(new Date(), new Date(date));
    return `${days}d ago`;
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
          {filteredApplications.map((application: ApplicationData) => {
            const typedApplication = application as ArtistApplication | IndustryApplication | InstrumentalistApplication;
            return (
            <div
              key={typedApplication.id}
              className="bg-covenLightPurple rounded-lg p-6 border border-white transition-colors flex justify-between"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <Link 
                    to={`/admin/applications/${typedApplication.id}`}
                    className="flex-grow cursor-pointer"
                  >
                    <div>
                      <h2 className="text-2xl text-white font-semibold">
                        {typedApplication.name}
                      </h2>
                      <p className="text-gray-300">
                        {typedApplication.application_type.charAt(0).toUpperCase() +
                          typedApplication.application_type.slice(1)}{" "}
                        Application
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className={`inline-block px-3 py-2 rounded-full text-sm ${getStatusColorClasses(typedApplication.status)}`}>
                          {getStatusDisplay(typedApplication.status)}
                        </p>
                        <span className="text-sm text-gray-400">
                          {getDaysAgoText(typedApplication)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <Link 
                  to={`/admin/applications/${typedApplication.id}`}
                  className="block"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                      <p>
                        <strong>Email:</strong> {typedApplication.email}
                      </p>
                      <p>
                        <strong>School:</strong> {typedApplication.school}
                      </p>
                    </div>

                    <div>
                      {typedApplication.application_type === "artist" && (
                        <>
                          <p>
                            <strong>Artist Type:</strong> {(typedApplication as ArtistApplication).artist_type}
                          </p>
                          <p>
                            <strong>Genres:</strong>{" "}
                            {Array.isArray((typedApplication as ArtistApplication).genres)
                              ? (typedApplication as ArtistApplication).genres?.join(", ")
                              : (typedApplication as ArtistApplication).genres}
                          </p>
                        </>
                      )}

                      {typedApplication.application_type === "industry" && (
                        <>
                          <p>
                            <strong>Industry Role:</strong>{" "}
                            {(typedApplication as IndustryApplication).industry_role}
                          </p>
                          <p>
                            <strong>Favorite Artists:</strong>{" "}
                            {Array.isArray((typedApplication as IndustryApplication).favorite_artists)
                              ? (typedApplication as IndustryApplication).favorite_artists?.join(", ")
                              : 'N/A'}
                          </p>
                        </>
                      )}

                      {typedApplication.application_type === "instrumentalist" && (
                        <>
                          <p>
                            <strong>Instrument:</strong> {(typedApplication as InstrumentalistApplication).instrument}
                          </p>
                          <p>
                            <strong>Favorite Genres:</strong>{" "}
                            {Array.isArray((typedApplication as InstrumentalistApplication).favorite_genres)
                              ? (typedApplication as InstrumentalistApplication).favorite_genres?.join(", ")
                              : (typedApplication as InstrumentalistApplication).favorite_genres}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="flex space-x-2 mt-4">
                  {shouldShowManualApprove(typedApplication) && (
                    <Button
                      onClick={() => handleManualApprove(typedApplication)}
                      text="Approve for User"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    />
                  )}
                  {typedApplication.status === "approved" && (
                    <>
                      <Button 
                        onClick={() => handleFinalizeProfile(typedApplication)}
                        text="Create Page"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading}
                      />
                      <Button 
                        text={
                          <>
                            View Application <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                          </>
                        }
                        className="px-6 py-2 rounded transition-color"
                        link={`/admin/applications/${typedApplication.id}`}
                      />
                    </>
                  )}
                </div>
              </div>

              <AuthImage
                src={typedApplication.photo_url || ''}
                alt={`${typedApplication.name}'s photo`}
                width={250}
                height={250}
                className="rounded-lg ml-4 object-cover min-w-[100px] min-h-[100px]"
                fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(typedApplication.name)}&background=432347&color=fff&size=100`}
              />
            </div>
          );})}
        </div>
      )}
    </div>
  );
};
