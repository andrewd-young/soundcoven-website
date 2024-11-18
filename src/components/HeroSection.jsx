import React from "react";
import Button from "./Button";
import Card from "./Card";

const HeroSection = () => {
  return (
    <section className="bg-covenPurple text-white flex justify-center items-center py-12">
      <Card className="w-2/3 text-center bg-gray-200">
        <h2 className="text-4xl font-bold mb-4 text-black">FEATURED</h2>
        <div className="flex justify-end">
          <Button text="Apply" className="bg-red-700 hover:bg-red-800" />
        </div>
      </Card>
    </section>
  );
};

export default HeroSection;
