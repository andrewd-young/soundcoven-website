import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { compressImage } from '../utils/imageUtils';

const useApplicationForm = (applicationType, initialFormData) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
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

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const uploadPhoto = async (file) => {
    if (!file) return null;
    
    try {
      const compressedImage = await compressImage(file);
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      // Make sure the path is correct
      const filePath = `applications/${applicationType}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-photos')
        .upload(filePath, compressedImage, { 
          upsert: true,
          contentType: file.type,
          cacheControl: '31536000'
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('application-photos')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e, transformData) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;
      if (formData.photo) {
        try {
          photoUrl = await uploadPhoto(formData.photo);
        } catch (error) {
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
            user_id: user.id
          }
        ],
        updated_at: new Date().toISOString(),
        application_type: applicationType,
        user_id: user.id,
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
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      navigate('/account');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.message || 'Error submitting application. Please try again.');
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