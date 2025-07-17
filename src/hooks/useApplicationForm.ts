import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { compressImage } from '../utils/imageUtils';
import { User } from '@supabase/supabase-js';

const useApplicationForm = <T extends Record<string, unknown>>(applicationType: string, initialFormData: T) => {
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<T>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "note") {
      const words = value.trim().split(/\s+/);
      if (words.length <= 200) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else {
        setFormData(prev => ({ ...prev, [name]: words.slice(0, 200).join(" ") }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, photo: e.target.files?.[0] || null }));
  };

  const uploadPhoto = async (file: File) => {
    if (!file) return null;
    
    try {
      // Compress image and convert to JPEG, strip metadata
      const compressedImage = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        type: 'image/jpeg', // Force JPEG format
        stripMetadata: true // Strip EXIF and other metadata
      });

      // Always use .jpg extension since we're converting to JPEG
      const fileName = `${user?.id}.jpg`;
      const filePath = `applications/${applicationType}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-photos')
        .upload(filePath, compressedImage, { 
          upsert: true,
          contentType: 'image/jpeg',
          cacheControl: '31536000'
        });
      
      if (uploadError) throw uploadError;
      
      // Properly handle the public URL response
      const { data } = await supabase.storage
        .from('application-photos')
        .getPublicUrl(filePath);
      
      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    transformData: (_fd: T, _p: string | null) => Record<string, unknown>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl: string | null = null;
      // Type guard for 'photo' property
      const hasPhoto = (fd: T): fd is T & { photo: File } =>
        Object.prototype.hasOwnProperty.call(fd, 'photo') && typeof (fd as { [key: string]: unknown }).photo !== 'undefined' && (fd as { [key: string]: unknown }).photo !== null;
      if (hasPhoto(formData)) {
        try {
          photoUrl = await uploadPhoto((formData as { [key: string]: unknown }).photo as File);
        } catch {
          throw new Error('Photo upload failed. Please try again.');
        }
      }

      const applicationData = {
        ...transformData(formData, photoUrl),
        status: 'pending',
        status_history: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            user_id: user?.id
          }
        ],
        updated_at: new Date().toISOString(),
        application_type: applicationType,
        user_id: user?.id,
        current_revision: 1
      };

      const { data: newApplication, error: insertError } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (insertError) {
        // If application creation fails, we should clean up the uploaded photo
        if (photoUrl) {
          const filePath = new URL(photoUrl).pathname.split('/').slice(-3).join('/');
          await supabase.storage
            .from('application-photos')
            .remove([filePath]);
        }
        throw insertError;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          has_applied: true,
          application_id: newApplication.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;
      
      navigate('/account');
    } catch (err: unknown) {
      console.error('Error submitting application:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error submitting application. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    formData,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};

export default useApplicationForm; 