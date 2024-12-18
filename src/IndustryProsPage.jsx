import React from "react";
import PropTypes from "prop-types";
import IndustryWideCard from "./components/IndustryWideCard";

const IndustryProsPage = ({ industryPros }) => {
  return (
    <section id="industry-pros" className="text-white py-8 px-24">
      <div className="flex flex-col gap-6">
        {industryPros.map((pro, index) => (
          <IndustryWideCard key={index} pro={pro} />
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
