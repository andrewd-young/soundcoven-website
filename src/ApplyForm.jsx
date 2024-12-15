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
                        className="text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('artist')}
                    >
                        Solo Artist, Band, DJ, Producer
                    </button>
                    <button 
                        className="text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('industry')}
                    >
                        Manager, Talent Buyer, Venue Buyer, Booking Agent, Publicist
                    </button>
                    <button 
                        className="text-white border border-white rounded-lg px-4 py-3 mb-4 hover:bg-white hover:text-gray-800 transition"
                        onClick={() => handleOptionClick('instrumentalist')}
                    >
                        Instrumentalist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyForm;
