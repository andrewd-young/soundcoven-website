import React from "react";
import { useParams, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIndustryPros } from './hooks/useIndustryPros';
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Profile+Image';

const IndustryProBio = () => {
  const { proId } = useParams();
  const { industryPros, loading, error } = useIndustryPros();
  
  if (loading) return <div className="min-h-screen bg-covenPurple text-white p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-covenPurple text-white p-8">Error: {error}</div>;
  
  const pro = industryPros.find((p) => p.id === parseInt(proId));
  
  if (!pro) {
    return <Navigate to="/industry-pros" replace />;
  }

  return (
    <section id="pro-bio" className="text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h2 className="text-5xl font-bold mb-6">{pro.name}</h2>
          <p className="text-xl font-medium mb-2">
            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            {pro.role} at {pro.company}
          </p>
          <p className="text-lg mb-4 text-white">{pro.bio || "No bio available."}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="tag bg-blue-200 text-blue-800 px-3 py-1 rounded">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              {pro.location}
            </span>
            <span className="tag bg-green-200 text-green-800 px-3 py-1 rounded">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              {pro.email}
            </span>
            <span className="tag bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              {pro.phone}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold mb-2">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {pro.expertise && pro.expertise.map((area, index) => (
                <span key={index} className="tag bg-purple-200 text-purple-800 px-3 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
          {pro.favoriteArtists && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Favorite Artists</h3>
              <div className="flex flex-wrap gap-2">
                {pro.favoriteArtists.map((artist, index) => (
                  <span key={index} className="tag bg-teal-200 text-teal-800 px-3 py-1 rounded">
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* {pro.notableClients && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Notable Clients</h3>
              <div className="flex flex-wrap gap-2">
                {pro.notableClients.map((client, index) => (
                  <span key={index} className="tag bg-red-200 text-red-800 px-3 py-1 rounded">
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pro.notableVenues && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Notable Venues</h3>
              <div className="flex flex-wrap gap-2">
                {pro.notableVenues.map((venue, index) => (
                  <span key={index} className="tag bg-teal-200 text-teal-800 px-3 py-1 rounded">
                    {venue}
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </div>
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
            <img
              src={pro.image || DEFAULT_IMAGE}
              alt={pro.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

IndustryProBio.propTypes = {
  industryPros: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      expertise: PropTypes.arrayOf(PropTypes.string),
      favoriteArtists: PropTypes.arrayOf(PropTypes.string),
      notableClients: PropTypes.arrayOf(PropTypes.string),
      notableVenues: PropTypes.arrayOf(PropTypes.string),
      bio: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default IndustryProBio;
