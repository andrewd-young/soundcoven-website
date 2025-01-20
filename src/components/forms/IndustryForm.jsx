import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../utils/supabase";

const IndustryForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    school: "",
    photo: null,
    favoriteArtists: "",
    note: "",
  });

  const noteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "note") {
      const words = value.trim().split(/\s+/);
      if (words.length <= 200) {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: words.slice(0, 200).join(" ") });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
      }

      const { error } = await supabase
        .from('applications')
        .update({
          name: formData.name,
          email: formData.email,
          school: formData.school,
          industry_role: formData.role,
          photo_url: photoUrl,
          favorite_artists: formData.favoriteArtists,
          note: formData.note,
          status: 'pending',
          updated_at: new Date()
        })
        .eq('id', applicationId);

      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const adjustHeight = (ref) => {
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  };

  useEffect(() => {
    adjustHeight(noteRef);
  }, [formData.note]);

  useEffect(() => {
    const fetchDraftApplication = async () => {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .eq('application_type', 'industry')
        .single();
      
      if (data) {
        setApplicationId(data.id);
      } else {
        navigate('/apply');
      }
    };

    if (user) {
      fetchDraftApplication();
    }
  }, [user, navigate]);

  const uploadPhoto = async (file) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${applicationId}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('application-photos')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      throw uploadError;
    }
    
    return data.path;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white p-8 rounded-lg mx-auto md:mt-2 lg:mt-5"
    >
      <h1 className="font-bold text-3xl mb-4">Apply as an Industry Pro</h1>
      <div className="mb-4">
        <label className="block mb-2">Role</label>
        <select
          name="role"
          className="w-full px-3 py-2 bg-[#432347] border md:border-white rounded"
          onChange={handleChange}
          required
        >
          <option value="">Choose one</option>
          <option value="Manager">Manager</option>
          <option value="Talent Buyer">Talent Buyer</option>
          <option value="Venue Buyer">Venue Buyer</option>
          <option value="Booking Agent">Booking Agent</option>
          <option value="Publicist">Publicist</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          name="name"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          name="email"
          type="email"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">School</label>
        <input
          name="school"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Professional Photo</label>
        <input
          name="photo"
          type="file"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleFileChange}
        />
        <p className="mt-2 text-sm text-gray-400">
          (preferably your LinkedIn profile photo)
        </p>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Top 3 favorite artists</label>
        <input
          name="favoriteArtists"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Note</label>
        <textarea
          name="note"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded mb-0"
          value={formData.note}
          onChange={handleChange}
          ref={noteRef}
          placeholder="Anything you would want people to know about you?"
        ></textarea>
        <p className="mt-2 text-sm text-gray-400">
          {formData.note.trim() ? formData.note.trim().split(/\s+/).length : 0}{" "}
          / 200 words
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default IndustryForm;
