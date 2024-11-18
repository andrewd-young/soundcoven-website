import React from "react";
import Button from "./Button";

const HeroSection = () => {
  return (
    <section className="bg-covenPurple text-white flex justify-center items-center py-12 px-24">
      <div className="w-full text-center bg-gray-200 rounded-lg shadow-md p-6 h-96">
        <h2 className="text-4xl font-bold mb-4 text-black">FEATURED</h2>
        <div className="flex justify-end">
          <Button text="Apply" className="bg-red-700 hover:bg-red-800" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
