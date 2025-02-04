import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const MetaTags = ({ title, description, image, type = "website" }) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  // Default values
  const defaultTitle = "Coven";
  const defaultDescription = "Connect with artists, industry professionals, and instrumentalists in the music industry";
  const defaultImage = `${window.location.origin}/og-image.jpg`;

  // Ensure we have valid values
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Coven" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Additional tags for better SEO */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default MetaTags;
