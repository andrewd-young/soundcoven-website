import React, { useRef, useEffect } from "react";
import useApplicationForm from "../../hooks/useApplicationForm";
import ImageUpload from "../ImageUpload";
import type { FormProps } from "../../types/Application";

interface ArtistFormData extends Record<string, unknown> {
  name: string;
  email: string;
  school: string;
  artist_type?: string;
  genres: string;
  streaming_links: string;
  upcoming_show?: string;
  influences: string;
  current_needs?: string;
  bio?: string;
  instagram_link?: string;
  location?: string;
  phone_number?: string;
  photo_url?: string;
  socialLinks?: string;
  note: string;
}

interface TransformedArtistData {
  name: string;
  email: string;
  school: string;
  location: string;
  bio: string;
  artist_type: string;
  genres: string;
  streaming_links: string;
  social_links: { links: string } | null;
  photo_url: string | null;
  current_needs: string;
  upcoming_show: string;
  influences: string;
  industry_role: string;
  note: string;
  phone_number: string;
}

const ArtistForm: React.FC<FormProps> = () => {
  const initialFormData: ArtistFormData = {
    name: "",
    email: "",
    artist_type: "",
    school: "",
    location: "",
    bio: "",
    phone_number: "",
    genres: "",
    streaming_links: "",
    socialLinks: "",
    photo_url: "",
    current_needs: "",
    upcoming_show: "",
    influences: "",
    note: "",
    instagram_link: "",
  };

  const { loading, formData, handleChange, handleFileChange, handleSubmit } =
    useApplicationForm<ArtistFormData>("artist", initialFormData);

  // Custom handleChange to convert comma-separated strings to arrays for certain fields
  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "genres" || name === "streaming_links" || name === "influences") {
      handleChange({
        ...e,
        target: {
          ...e.target,
          value,
          name,
        },
      });
    } else {
      handleChange(e);
    }
  };

  const influencesRef = useRef<HTMLTextAreaElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const transformData = (formData: ArtistFormData, photoUrl: string | null): TransformedArtistData => ({
    name: formData.name,
    email: formData.email,
    school: formData.school,
    location: formData.location || "",
    bio: formData.bio || "",
    artist_type: formData.artist_type || "",
    genres: formData.genres || "",
    streaming_links: formData.streaming_links || "",
    social_links: formData.socialLinks ? { links: String(formData.socialLinks) } : null,
    photo_url: photoUrl,
    current_needs: formData.current_needs || "",
    upcoming_show: formData.upcoming_show || "",
    influences: formData.influences || "",
    industry_role: "",
    note: formData.note ? String(formData.note) : "",
    phone_number: formData.phone_number || "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, (fd, photoUrl) => transformData(fd, photoUrl) as unknown as Record<string, unknown>);

  const handleImageChange = (file: File | null) => {
    // Create a mock event that the handleFileChange expects
    const mockEvent = {
      target: {
        files: file ? [file] : null
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(mockEvent);
  };

  const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
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
        onImageChange={handleImageChange}
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
          rows={4}
          required
        ></textarea>
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
          onChange={customHandleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Links to streaming platforms</label>
        <input
          name="streaming_links"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={customHandleChange}
          placeholder="Must provide at least one link to streamable music"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Upcoming live show</label>
        <input
          name="upcoming_show"
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
          onChange={customHandleChange}
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
        <label className="block mb-2">Are you looking for any specific connections?</label>
        <input
          name="specificConnections"
          type="text"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleChange}
          placeholder="e.g., producer, manager, guitar player"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Note</label>
        <textarea
          name="note"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          value={formData.note ?? ''}
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
