import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';

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
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${applicationId || 'temp'}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('application-photos')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('application-photos')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e, transformData) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo, applicationId);
      }

      const applicationData = {
        ...transformData(formData, photoUrl),
        status: 'pending',
        updated_at: new Date().toISOString(),
        application_type: applicationType,
        user_id: user.id
      };

      let response;
      if (applicationId) {
        response = await supabase
          .from('applications')
          .update(applicationData)
          .eq('id', applicationId)
          .select()
          .single();
      } else {
        response = await supabase
          .from('applications')
          .insert([applicationData])
          .select()
          .single();
      }

      if (response.error) throw response.error;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          has_applied: true,
          application_id: response.data.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      navigate('/account');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
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