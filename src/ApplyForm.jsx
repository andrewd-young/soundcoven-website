import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";

const ApplyForm = () => {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    navigate(`/apply/${option}`);
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="text-left mt-20">
        <h1 className="text-4xl text-white mb-8">I am a</h1>
        <div className="flex flex-col">
          <Button
            text="Solo Artist, Band, DJ, Producer"
            onClick={() => handleOptionClick("artist")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Manager, Talent Buyer, Venue Buyer, Booking Agent, Publicist"
            onClick={() => handleOptionClick("industry")}
            className="px-4 py-3 mb-4"
          />
          <Button
            text="Instrumentalist"
            onClick={() => handleOptionClick("instrumentalist")}
            className="px-4 py-3 mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;