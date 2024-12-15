import React, { useState } from "react";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="text-white border border-white p-8 rounded-lg max-w-lg mx-auto mt-20">
            <h1 className="text-2xl mb-4">Solo Artist, Band, DJ & Producer Form</h1>
            <div className="mb-4">
                <label className="block mb-2">Are you a Solo Artist, Band, DJ or Producer?</label>
                <select name="artistType" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required>
                    <option value="">Choose one</option>
                    <option value="Solo Artist">Solo Artist</option>
                    <option value="Band">Band</option>
                    <option value="DJ">DJ</option>
                    <option value="Producer">Producer</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Name(s)</label>
                <input name="name" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Email(s)</label>
                <input name="email" type="email" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">School</label>
                <input name="school" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Genre(s)</label>
                <input name="genres" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Links to streaming platforms</label>
                <input name="links" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Professional Photo</label>
                <input name="photo" type="file" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleFileChange} />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Are you currently in need of a manager, producer, publicist, etc.?</label>
                <input name="needs" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Upcoming live show</label>
                <input name="upcomingShow" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Influences on your music</label>
                <textarea name="influences" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange}></textarea>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Note (200 words max)</label>
                <textarea name="note" maxLength={200} className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="w-full bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Submit</button>
        </form>
    );
};

export default ArtistForm;