import React, { useState, useEffect, useRef } from "react";

const ArtistForm = () => {
  const [formData, setFormData] = useState({
    artistType: "",
    name: "",
    email: "",
    school: "",
    genres: "",
    links: "",
    photo: null,
    needs: "",
    upcomingShow: "",
    influences: "",
    note: "",
  });

  const influencesRef = useRef(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const adjustHeight = (ref) => {
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  };

  useEffect(() => {
    adjustHeight(influencesRef);
    adjustHeight(noteRef);
  }, [formData.influences, formData.note]);

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white border border-white p-8 rounded-lg max-w-lg mx-auto mt-20"
    >
      <h1 className="font-bold text-3xl mb-4">Apply as an Artist</h1>
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
        <label className="block mb-2">Professional Photo</label>
        <input
          name="photo"
          type="file"
          className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          onChange={handleFileChange}
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
        className="w-full bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        Submit
      </button>
    </form>
  );
};

export default ArtistForm;
