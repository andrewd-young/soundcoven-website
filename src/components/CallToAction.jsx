import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CallToAction = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-covenPurple py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Interested in joining the coven?
        </h2>
        <Link
          to="/login"
          className="inline-block bg-covenRed text-white px-8 py-3 rounded hover:bg-red-700 transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default CallToAction; 