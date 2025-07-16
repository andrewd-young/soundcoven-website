import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import supabase from "./utils/supabase";
import Button from "./components/common/Button";
import ArtistForm from "./components/forms/ArtistForm";
import IndustryForm from "./components/forms/IndustryForm";
import InstrumentalistForm from "./components/forms/InstrumentalistForm";
import { User } from '@supabase/supabase-js';

// Define a common interface for form props
export interface FormProps {
  onBack: () => void;
  className?: string;
}

interface ApplicationData {
  status: string;
  application_type: string;
}

interface ProfileData {
  has_applied: boolean;
  application_id: string | null;
  role: string | null;
  applications: ApplicationData[] | null;
}

const ApplyForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth() as { user: User | null };
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        sessionStorage.setItem('intendedPath', window.location.pathname);
        navigate('/login');
        return;
      }

      try {
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
        
        if ((profile as ProfileData)?.has_applied && (profile as ProfileData)?.application_id && 
            (profile as ProfileData)?.applications?.[0]?.status === 'submitted') {
          navigate('/account');
          return;
        }

        if (urlRole && ['artist', 'industry', 'instrumentalist'].includes(urlRole)) {
          setSelectedRole(urlRole);
        } else if ((profile as ProfileData)?.role && (profile as ProfileData)?.role !== 'other') {
          setSelectedRole((profile as ProfileData).role);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkApplicationStatus();
  }, [user, navigate]);

  const handleOptionClick = async (option: string) => {
    if (!user) {
      sessionStorage.setItem('intendedPath', `/apply/${option}`);
      navigate('/login');
      return;
    }

    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

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
      const formProps: FormProps = {
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
        default:
          return (
            <div className="text-center text-white">
              <p>Invalid role selected. Please try again.</p>
              <Button
                text="Go Back"
                onClick={() => setSelectedRole(null)}
                className="px-4 py-3 mt-4"
              />
            </div>
          );
      }
    }

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