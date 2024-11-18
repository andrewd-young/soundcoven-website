import React from "react";

const Footer = () => {
  return (
    <footer className="bg-covenPurple text-white py-6 mt-auto">
      <div className="container mx-auto flex justify-between text-sm">
        <div>© 2024 SoundCoven</div>
        <div className="flex space-x-4">
          <a href="#facebook" className="hover:text-red-500">Facebook</a>
          <a href="#twitter" className="hover:text-red-500">Twitter</a>
          <a href="#instagram" className="hover:text-red-500">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
