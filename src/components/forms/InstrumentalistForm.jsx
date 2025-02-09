import React, { useRef, useEffect } from "react";
import useApplicationForm from "../../hooks/useApplicationForm";
import ImageUpload from "../ImageUpload";

const InstrumentalistForm = () => {
  const initialFormData = {
    name: "",
    email: "",
    instrument: "",
    school: "",
    location: "",
    bio: "",
    favoriteGenres: "",
    favoriteArtists: "",
    note: "",
    photo: null,
    socialLinks: "",
  };

  const { loading, formData, handleChange, handleSubmit, handleFileChange } =
    useApplicationForm("instrumentalist", initialFormData);

  const noteRef = useRef(null);

  const transformData = (formData, photoUrl) => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    location: formData.location,
    bio: formData.bio,
    instrument: formData.instrument,
    favorite_genres: formData.favoriteGenres,
    favorite_artists: formData.favoriteArtists,
    profile_image_url: photoUrl,
    note: formData.note,
    social_links: formData.socialLinks,
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
      <h1 className="font-bold text-3xl mb-4">Apply as an Instrumentalist</h1>
      <p className="mb-4">
        Do you play one, two, or even three instruments (vocals included) and
        want to make your skills available to artists or producers who might
        need them in their music? &nbsp;
        <strong>
          You can fill out this form even if you&apos;ve already completed the
          Talent or Industry form!
        </strong>
      </p>
      <ImageUpload
        onImageChange={handleFileChange}
        label="Professional Photo of you with your instrument(s) (PDF, Document or Image)"
      />
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
        <label className="block mb-2">Instrument</label>
        <input
          name="instrument"
          type="text"
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
        <label className="block mb-2">Bio</label>
        <textarea
          name="bio"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Tell us about your musical background and experience"
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
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Favorite genres to play</label>
        <input
          name="favoriteGenres"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
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
        <label className="block mb-2">Note</label>
        <textarea
          name="note"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          value={formData.note}
          onChange={handleChange}
          ref={noteRef}
          placeholder="Anything you would want people to know about you?"
        ></textarea>
        <p className="text-sm text-gray-400">
          {formData.note.trim() ? formData.note.trim().split(/\s+/).length : 0}{" "}
          / 200 words
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default InstrumentalistForm;
