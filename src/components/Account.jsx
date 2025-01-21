import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import Button from './common/Button';

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({
    email: user?.email || '',
  });
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);

  const fetchProfileAndApplication = useCallback(async () => {
    try {
      // Fetch profile with application details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, applications(*)')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profile);
      if (profile?.applications) {
        setApplication(profile.applications);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setUserDetails({
        email: user.email,
      });
      fetchProfileAndApplication();
    }
  }, [user, fetchProfileAndApplication]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        email: userDetails.email,
      });

      if (error) throw error;
      setMessage('Check your email to confirm the change');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return 'Not Set';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatApplicationStatus = (status) => {
    if (!status) return 'Not Started';
    // Convert not_started to "Not Started", etc.
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!user) return <div>Please sign in</div>;

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-md mt-20">
        <h1 className="text-4xl font-bold text-white mb-8">Account Settings</h1>
        
        {/* Success Box - Show when application is submitted and pending */}
        {application?.status === 'pending' && (
          <div className="mb-8 p-4 bg-green-900 rounded border border-green-500">
            <h2 className="text-2xl text-white mb-2">Application Submitted!</h2>
            <p className="text-white mb-4">
              While we review your application, explore our community of artists and industry professionals.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/artists')}
                text="View Artists"
                className=" text-white py-2 px-4 rounded"
              />
              <Button
                onClick={() => navigate('/industry')}
                text="View Industry Pros"
                className=" text-white py-2 px-4 rounded"
              />
            </div>
          </div>
        )}
        
        {/* Profile Information */}
        <div className="mb-8 p-4 bg-[#432347] rounded border border-white">
          <h2 className="text-2xl text-white mb-4">Profile</h2>
          <div className="space-y-2">
            <p className="text-white">
              <span className="font-semibold">Role:</span> {formatRole(profile?.role)}
            </p>
            {profile?.role === 'other' && profile?.other_description && (
              <p className="text-white">
                <span className="font-semibold">Description:</span> {profile.other_description}
              </p>
            )}
          </div>
        </div>

        {/* Application Status */}
        {profile?.role === 'other' ? (
          <div className="mb-8 p-4 bg-[#432347] rounded border border-white">
            <h2 className="text-2xl text-white mb-4">Application Status</h2>
            <div className="space-y-2">
              <p className="text-white mb-4">
                You're currently registered as "Other". Would you like to apply as an artist, industry professional, or instrumentalist?
              </p>
              <button
                onClick={() => navigate('/apply')}
                className="mt-2 bg-covenRed text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Change Role & Apply
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-[#432347] rounded border border-white">
            <h2 className="text-2xl text-white mb-4">Application Status</h2>
            <div className="space-y-2">
              <p className="text-white">
                <span className="font-semibold">Status:</span> {formatApplicationStatus(application?.status || 'not_started')}
              </p>
              {application && (
                <p className="text-white">
                  <span className="font-semibold">Type:</span> {formatRole(application.application_type)}
                </p>
              )}
              {(!application || !application.status || application.status === 'not_started' || application.status === 'draft') && (
                <button
                  onClick={() => {
                    // Set the role in the URL directly
                    window.location.href = `/apply/${profile.role}`;
                  }}
                  className="mt-2 bg-covenRed text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  {application?.status === 'draft' ? 'Continue Application' : 'Start Application'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Email Update Form */}
        <form onSubmit={handleUpdateEmail} className="space-y-6 p-4 bg-[#432347] rounded border border-white">
          <h2 className="text-2xl text-white mb-4">Email Settings</h2>
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#432347] border border-white rounded text-white"
            />
          </div>

          {message && (
            <div className={`text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-covenRed text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account; 