import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';

const Account = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setUserDetails({
        email: user.email,
      });
    }
  }, [user]);

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

  if (!user) return <div>Please sign in</div>;

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-md mt-20">
        <h1 className="text-4xl font-bold text-white mb-8">Account Settings</h1>
        
        <form onSubmit={handleUpdateEmail} className="space-y-6">
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