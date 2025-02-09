import React, { useRef, useEffect } from "react";
import useApplicationForm from "../../hooks/useApplicationForm";
import { DEFAULT_PROFILE_IMAGE } from "../../constants/images";
import ImageUpload from "../ImageUpload";

const IndustryForm = () => {
  const initialFormData = {
    role: "",
    name: "",
    email: "",
    school: "",
    location: "",
    company: "",
    phone: "",
    bio: "",
    photo: null,
    favoriteArtists: "",
    note: "",
    socialLinks: "",
  };

  const { loading, formData, handleChange, handleFileChange, handleSubmit } =
    useApplicationForm("industry", initialFormData);

  const noteRef = useRef(null);

  const transformData = (formData, photoUrl) => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    location: formData.location,
    company: formData.company,
    phone: formData.phone,
    bio: formData.bio,
    industry_role: formData.role,
    photo_url: photoUrl,
    favorite_artists: formData.favoriteArtists,
    note: formData.note,
    social_links: formData.socialLinks,
  });

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length >= 10) {
      return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    handleChange({
      ...e,
      target: {
        ...e.target,
        value: formattedNumber,
        name: 'phone'
      }
    });
  };

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
        <label className="block mb-2">Location</label>
        <input
          name="location"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="City, State"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Company</label>
        <input
          name="company"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Phone</label>
        <input
          name="phone"
          type="tel"
          className={`w-full px-3 py-2 bg-[#432347] border border-white rounded ${
            formData.phone && !validatePhoneNumber(formData.phone) 
              ? 'border-red-500' 
              : 'border-white'
          }`}
          onChange={handlePhoneChange}
          value={formData.phone}
          placeholder="(123) 456-7890"
          pattern="\(\d{3}\)\s\d{3}-\d{4}"
          required
        />
        {formData.phone && !validatePhoneNumber(formData.phone) && (
          <p className="text-red-500 text-sm mt-1">
            Please enter a valid phone number: (XXX) XXX-XXXX
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Bio</label>
        <textarea
          name="bio"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Tell us about your experience and what you're looking for"
          rows="4"
          required
        ></textarea>
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
        <label className="block mb-2">Social Media Links</label>
        <input
          name="socialLinks"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Instagram, Twitter, TikTok, etc. (separate with commas)"
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
