import React, { useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useApplicationForm from "../../hooks/useApplicationForm";
import ImageUpload from "../ImageUpload";

const ArtistForm = () => {
  const { user } = useAuth();

  const initialFormData = {
    name: "",
    email: "",
    artistType: "",
    school: "",
    location: "",
    bio: "",
    age: "",
    yearsActive: "",
    phone: "",
    genres: "",
    links: "",
    socialLinks: "",
    photo: null,
    needs: "",
    upcomingShow: "",
    influences: "",
    note: "",
  };

  const { loading, formData, handleChange, handleFileChange, handleSubmit } =
    useApplicationForm("artist", initialFormData);

  const influencesRef = useRef(null);
  const noteRef = useRef(null);

  const transformData = (formData, photoUrl) => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    location: formData.location,
    bio: formData.bio,
    age: parseInt(formData.age),
    years_active: parseInt(formData.yearsActive),
    contact_phone: formData.phone,
    genres: formData.genres.split(',').map(g => g.trim()),
    streaming_links: formData.links.split(',').map(l => l.trim()),
    social_links: formData.socialLinks,
    photo_url: photoUrl,
    current_needs: formData.needs.split(',').map(n => n.trim()),
    upcoming_shows: formData.upcomingShow.split(',').map(s => s.trim()),
    influences: formData.influences,
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
    adjustHeight(influencesRef);
    adjustHeight(noteRef);
  }, [formData.influences, formData.note]);

  return (
    <form
      onSubmit={onSubmit}
      className="text-white p-8 rounded-lg mx-auto md:mt-2 lg:mt-5"
    >
      <h1 className="font-bold text-3xl mb-4">Apply as an Artist</h1>
      <ImageUpload
        onImageChange={handleFileChange}
        label="Professional Photo (best photo) of you/your band (PDF, Document or Image)"
      />
      <div className="mb-4">
        <label className="block mb-2">
          Are you a Solo Artist, Band, DJ or Producer?
        </label>
        <select
          name="artistType"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        >
          <option value="">Choose one</option>
          <option value="Solo Artist">Solo Artist</option>
          <option value="Band">Band</option>
          <option value="DJ">DJ</option>
          <option value="Producer">Producer</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Name(s)</label>
        <input
          name="name"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email(s)</label>
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
        <label className="block mb-2">Bio</label>
        <textarea
          name="bio"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Tell us about yourself and your music"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Age</label>
        <input
          name="age"
          type="number"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Years Active</label>
        <input
          name="yearsActive"
          type="number"
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
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="(123) 456-7890"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Genre(s)</label>
        <input
          name="genres"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Links to streaming platforms</label>
        <input
          name="links"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="Must provide at least one link to streamable music"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Are you currently in need of a manager, producer, publicist, etc.?
        </label>
        <input
          name="needs"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="N/A if not applicable"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Upcoming live show</label>
        <input
          name="upcomingShow"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="N/A if not applicable"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Influences on your music</label>
        <textarea
          name="influences"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          ref={influencesRef}
          placeholder="Artists, producers, creatives, etc."
        ></textarea>
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

export default ArtistForm;
