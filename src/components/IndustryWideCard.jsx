import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEnvelope,
  faCalendarAlt,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const IndustryWideCard = ({ pro }) => {
  if (!pro) {
    return null; // or return some fallback UI
  }

  return (
    <div className="h-80 rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center bg-covenLightPurple">
      <img
        src={pro.image}
        alt={pro.name}
        className="mb-4 md:mb-0 md:w-1/4 h-full object-cover rounded-md"
      />
      <div className="flex flex-col w-full md:w-3/4 px-4">
        <h3 className="text-3xl font-bold mb-3">{pro.name}</h3>
        <p className="text-sm mb-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {pro.location}
        </p>
        <p className="text-sm mb-2">
          <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
          Role: {pro.role}
        </p>
        <p className="text-sm mb-2">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Contact: {pro.email || pro.phone}
        </p>
        <p className="text-sm mb-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          Availability: {pro.availability || "Not specified"}
        </p>
        <div className="flex gap-4 mt-4">
          <Button
            text="View Profile"
            link={`/industry-pros/${pro.name}`}
            className="bg-blue-500 text-white rounded-lg shadow-md border-0"
          />
          <Button
            text="Book Now"
            className="bg-green-500 text-white rounded-lg shadow-md border-0"
            onClick={() => {
              /* Add your booking logic here */
            }}
          />
        </div>
      </div>
    </div>
  );
};

IndustryWideCard.propTypes = {
  pro: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string,
    role: PropTypes.string,
    listeners: PropTypes.number,
    email: PropTypes.string,
    phone: PropTypes.string,
    availability: PropTypes.string,
  }).isRequired,
};

export default IndustryWideCard;
