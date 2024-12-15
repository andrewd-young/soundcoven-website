import React, { useState, useRef, useEffect } from "react";

const InstrumentalistForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        instrument: "",
        school: "",
        favoriteGenres: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const adjustHeight = (ref) => {
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
    };

    useEffect(() => {
        adjustHeight(noteRef);
    }, [formData.note]);

    return (
        <form onSubmit={handleSubmit} className="text-white border border-white p-8 rounded-lg max-w-lg mx-auto mt-20">
            <h1 className="font-bold text-3xl mb-4">Apply as an Instrumentalist</h1>
            <p className="mb-4">
                Do you play one, two, or even three instruments (vocals included) and want to make your skills available to artists or producers who might need them in their music? &nbsp;
                <strong>You can fill out this form even if you&apos;ve already completed the Talent or Industry form!</strong>
            </p>
            <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input name="name" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input name="email" type="email" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Instrument</label>
                <input name="instrument" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">School</label>
                <input name="school" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Favorite genres to play</label>
                <input name="favoriteGenres" type="text" className="w-full px-3 py-2 bg-[#432347] border border-white rounded" onChange={handleChange} required />
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
                    {formData.note.trim() ? formData.note.trim().split(/\s+/).length : 0} / 200 words
                </p>
            </div>
            <button type="submit" className="w-full bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Submit</button>
        </form>
    );
};

export default InstrumentalistForm;