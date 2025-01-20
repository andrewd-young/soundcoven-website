import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import supabase from "./utils/supabase";
import Button from "./components/common/Button";

const ApplyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        // Store intended path and redirect to login
        sessionStorage.setItem('intendedPath', window.location.pathname);
        navigate('/login');
        return;
      }

      // Check if user has already applied
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_applied, application_type')
        .eq('id', user.id)
        .single();

      if (profile?.has_applied) {
        // If they've already applied, redirect to their previous page or dashboard
        const previousPath = sessionStorage.getItem('intendedPath');
        navigate(previousPath || '/dashboard');
        sessionStorage.removeItem('intendedPath');
      }
    };

    checkApplicationStatus();
  }, [user, navigate]);

  const handleOptionClick = (option) => {
    if (!user) {
      sessionStorage.setItem('intendedPath', `/apply/${option}`);
      navigate('/login');
      return;
    }
    navigate(`/apply/${option}`);
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="text-left mt-20">
        <h1 className="text-4xl text-white mb-8">I am a</h1>
        <div className="flex flex-col">
          <Button
            text="Solo Artist, Band, DJ, Producer"
            onClick={() => handleOptionClick("artist")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Manager, Talent Buyer, Venue Buyer, Booking Agent, Publicist"
            onClick={() => handleOptionClick("industry")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Instrumentalist"
            onClick={() => handleOptionClick("instrumentalist")}
            className="px-4 py-3 mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;