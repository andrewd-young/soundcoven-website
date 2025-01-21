import React, { useRef, useEffect } from "react";
import useApplicationForm from "../../hooks/useApplicationForm";

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

  const {
    loading,
    formData,
    handleChange,
    handleFileChange,
    handleSubmit
  } = useApplicationForm('industry', initialFormData);

  const noteRef = useRef(null);

  const transformData = (formData, photoUrl) => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    industry_role: formData.role,
    photo_url: photoUrl,
    favorite_artists: formData.favoriteArtists,
    note: formData.note
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
