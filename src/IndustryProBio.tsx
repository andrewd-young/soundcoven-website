import React from "react";
import { useParams, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIndustryPros } from "./hooks/useIndustryPros";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faBriefcase,
  faGraduationCap,
  faLink,
  faBuilding,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { AuthImage } from "./components/common/AuthImage";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Profile+Image";

const IndustryProBio = () => {
  const { proId } = useParams();
  const { industryPros, loading, error } = useIndustryPros();

  if (loading)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-covenPurple text-white p-8">
        Error: {error}
      </div>
    );

  const pro = industryPros.find((p) => p.id === parseInt(proId));

  if (!pro) {
    return <Navigate to="/industry-pros" replace />;
  }

  // Convert arrays or strings to arrays
  const favoriteArtistsList = Array.isArray(pro.favorite_artists)
    ? pro.favorite_artists
    : pro.favorite_artists
    ? pro.favorite_artists.split(",").map((artist) => artist.trim())
    : [];

  const expertiseAreas = Array.isArray(pro.expertise_areas)
    ? pro.expertise_areas
    : pro.expertise_areas
    ? pro.expertise_areas.split(",").map((area) => area.trim())
    : [];

  const socialLinks = Array.isArray(pro.social_links)
    ? pro.social_links
    : pro.social_links
    ? pro.social_links.split(",").map((link) => link.trim())
    : [];

  return (
    <section id="pro-bio" className="text-white py-8 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h2 className="text-5xl font-bold mb-6">{pro.name}</h2>

          {/* Role and Company */}
          <div className="mb-4">
            <p className="text-xl font-medium">
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
              {pro.industry_role || pro.role || "Role not specified"}
            </p>
            {pro.company && (
              <p className="text-lg">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                {pro.company}
              </p>
            )}
            {pro.years_experience && (
              <p className="text-lg">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {pro.years_experience} years of experience
              </p>
            )}
          </div>

          {/* Bio */}
          <p className="text-lg mb-6 text-white">
            {pro.bio || "No bio available."}
          </p>

          {/* Contact Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            {pro.location && (
              <span className="tag bg-blue-200 text-blue-800 px-3 py-1 rounded">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {pro.location}
              </span>
            )}
            {pro.email && (
              <span className="tag bg-green-200 text-green-800 px-3 py-1 rounded">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                {pro.email}
              </span>
            )}
            {pro.phone && (
              <span className="tag bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                {pro.phone}
              </span>
            )}
          </div>

          {/* Education */}
          {pro.school && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Education</h3>
              <span className="tag bg-orange-200 text-orange-800 px-3 py-1 rounded">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                {pro.school}
              </span>
            </div>
          )}

          {/* Expertise Areas */}
          {expertiseAreas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((area, index) => (
                  <span
                    key={index}
                    className="tag bg-purple-200 text-purple-800 px-3 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Artists */}
          {favoriteArtistsList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Favorite Artists</h3>
              <div className="flex flex-wrap gap-2">
                {favoriteArtistsList.map((artist, index) => (
                  <span
                    key={index}
                    className="tag bg-teal-200 text-teal-800 px-3 py-1 rounded"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Connect</h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.startsWith("http") ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag bg-pink-200 text-pink-800 px-3 py-1 rounded hover:bg-pink-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    {
                      new URL(
                        link.startsWith("http") ? link : `https://${link}`
                      ).hostname
                    }
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="relative z-10">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
            <AuthImage
              src={pro.profile_image_url || DEFAULT_IMAGE}
              alt={pro.name}
              width={600}
              height={600}
              className="w-full h-full"
              objectFit="cover"
              fallbackSrc={DEFAULT_IMAGE}
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
      industry_role: PropTypes.string,
      company: PropTypes.string,
      location: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      school: PropTypes.string,
      favorite_artists: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      expertise_areas: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      social_links: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      years_experience: PropTypes.number,
      bio: PropTypes.string,
      profile_image_url: PropTypes.string,
    })
  ).isRequired,
};

export default IndustryProBio;
