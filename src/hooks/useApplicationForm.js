import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { compressImage } from '../utils/imageUtils';

const useApplicationForm = (applicationType, initialFormData) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
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

  const uploadPhoto = async (file, applicationId) => {
    if (!file) return null;
    
    try {
      const compressedImage = await compressImage(file);
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${applicationId || Date.now()}.${fileExt}`;
      const filePath = `applications/${applicationType}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-photos')
        .upload(filePath, compressedImage, { 
          upsert: true,
          contentType: file.type,
          cacheControl: '31536000' // 1 year cache
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL using the correct bucket name
      const { data: { publicUrl } } = supabase.storage
        .from('application-photos')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e, transformData) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First upload the photo if one exists
      let photoUrl = null;
      if (formData.photo) {
        // Generate a temporary ID for the photo upload
        const tempId = `temp_${Date.now()}`;
        try {
          photoUrl = await uploadPhoto(formData.photo, tempId);
        } catch (error) {
          throw new Error('Photo upload failed. Please try again.');
        }
      }

      // Only proceed with application creation if photo upload succeeded (if photo was provided)
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

  useEffect(() => {
    const fetchDraftApplication = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'draft')
          .eq('application_type', applicationType)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setApplicationId(data.id);
          setFormData(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error fetching draft application:', error);
      }
    };

    if (user) {
      fetchDraftApplication();
    }
  }, [user, applicationType]);

  return {
    loading,
    formData,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};

export default useApplicationForm; 