import React from "react";
import { useNavigate } from "react-router-dom";

const ApplyForm = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        navigate(`/apply/${option}`);
    };

    return (
        <div className="flex justify-center">
            <div className="text-left mt-20">
                <h1 className="text-4xl text-white mb-8">I am a</h1>
                <div className="flex flex-col">
                    <button 
                        className="w-64 text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('solo-artist')}
                    >
                        Solo Artist
                    </button>
                    <button 
                        className="w-64 text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('band')}
                    >
                        Band
                    </button>
                    <button 
                        className="w-64 text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('dj')}
                    >
                        DJ
                    </button>
                    <button 
                        className="w-64 text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('producer')}
                    >
                        Producer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyForm;
