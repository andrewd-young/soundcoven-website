import React from "react";
import PropTypes from "prop-types";
import IndustryCard from "./components/IndustryCard";

const IndustryProsPage = ({ industryPros }) => {
  return (
    <section id="industry-pros" className="text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {industryPros.map((pro, index) => (
          <IndustryCard key={index} pro={pro} />
        ))}
      </div>
    </section>
  );
};

IndustryProsPage.propTypes = {
  industryPros: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string,
      location: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      expertise: PropTypes.arrayOf(PropTypes.string),
      notableClients: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default IndustryProsPage;
