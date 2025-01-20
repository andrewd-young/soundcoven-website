import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import supabase from "./utils/supabase";
import Button from "./components/common/Button";
import ArtistForm from "./components/forms/ArtistForm";
import IndustryForm from "./components/forms/IndustryForm";
import InstrumentalistForm from "./components/forms/InstrumentalistForm";

const ApplyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        sessionStorage.setItem('intendedPath', window.location.pathname);
        navigate('/login');
        return;
      }

      try {
        // Extract role from URL if present
        const urlRole = window.location.pathname.split('/apply/')[1];
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            has_applied, 
            application_id, 
            role,
            applications (
              status,
              application_type
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Only redirect if application is fully submitted
        if (profile?.has_applied && profile?.application_id && 
            profile?.applications?.status === 'submitted') {
          navigate('/dashboard');
          return;
        }

        // If URL contains a valid role, use that, otherwise use profile role
        if (urlRole && ['artist', 'industry', 'instrumentalist'].includes(urlRole)) {
          setSelectedRole(urlRole);
        } else if (profile?.role && profile.role !== 'other') {
          setSelectedRole(profile.role);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkApplicationStatus();
  }, [user, navigate]);

  const handleOptionClick = async (option) => {
    if (!user) {
      sessionStorage.setItem('intendedPath', `/apply/${option}`);
      navigate('/login');
      return;
    }

    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw profileError;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            role: option,
            created_at: new Date().toISOString()
          }]);

        if (createError) throw createError;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: option,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      setSelectedRole(option);
    } catch (error) {
      console.error('Error handling profile:', error);
    }
  };

  const renderForm = () => {
    if (selectedRole) {
      const formProps = {
        onBack: () => setSelectedRole(null),
        className: "w-full max-w-xl"
      };

      switch (selectedRole) {
        case 'artist':
          return <ArtistForm {...formProps} />;
        case 'industry':
          return <IndustryForm {...formProps} />;
        case 'instrumentalist':
          return <InstrumentalistForm {...formProps} />;
        case 'other':
          return (
            <div className="text-center text-white">
              <h2 className="text-2xl mb-4">Thanks for your interest!</h2>
              <p className="mb-6">While we don't have a specific application form for your role yet, we'd love to learn more about what you do.</p>
              <p className="mb-6">Please check back later for updates or feel free to apply under one of our other categories if they better match your needs.</p>
              <Button
                text="Go Back"
                onClick={() => setSelectedRole(null)}
                className="px-4 py-3"
              />
            </div>
          );
      }
    }

    // Initial options view
    return (
      <>
        <h1 className="text-4xl text-white mb-8">I am a</h1>
        <div className="flex flex-col">
          <Button
            text="Solo Artist, Band, DJ, Producer"
            onClick={() => handleOptionClick("artist")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Manager, Talent Buyer, Venue Buyer, Publicist"
            onClick={() => handleOptionClick("industry")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Instrumentalist"
            onClick={() => handleOptionClick("instrumentalist")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Other"
            onClick={() => handleOptionClick("other")}
            className="px-4 py-3 mb-4"
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className={`text-left mt-20 ${selectedRole ? 'w-full max-w-xl' : 'w-full max-w-md'}`}>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
};

export default ApplyForm;