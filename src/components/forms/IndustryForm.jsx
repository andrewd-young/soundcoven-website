import React, { useRef, useEffect, useState } from "react";
import useApplicationForm from "../../hooks/useApplicationForm";
import { DEFAULT_PROFILE_IMAGE } from "../../constants/images";
import ImageUpload from "../ImageUpload";

const IndustryForm = () => {
  const initialFormData = {
    role: "",
    name: "",
    email: "",
    school: "",
    photo: null,
    favoriteArtists: "",
    note: "",
  };

  const { loading, formData, handleChange, handleFileChange, handleSubmit } =
    useApplicationForm("industry", initialFormData);

  const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_IMAGE);
  const noteRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(e);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const transformData = (formData, photoUrl) => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    industry_role: formData.role,
    photo_url: photoUrl,
    favorite_artists: formData.favoriteArtists,
    note: formData.note,
  });

  const onSubmit = (e) => handleSubmit(e, transformData);

  const adjustHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight(noteRef);
  }, [formData.note]);

  return (
    <form
      onSubmit={onSubmit}
      className="text-white p-8 rounded-lg mx-auto md:mt-2 lg:mt-5"
    >
      <h1 className="font-bold text-3xl mb-4">Apply as an Industry Pro</h1>

      <ImageUpload
        onImageChange={handleFileChange}
        label="Professional Headshot or Photo (PDF, Document or Image)"
      />

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
        <label className="block mb-2">Favorite Artists</label>
        <input
          name="favoriteArtists"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Separate artists with commas"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Additional Notes (max 200 words)</label>
        <textarea
          ref={noteRef}
          name="note"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded resize-none"
          onChange={handleChange}
          rows="4"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-white text-purple-900 py-2 rounded font-semibold hover:bg-gray-100 transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default IndustryForm;
