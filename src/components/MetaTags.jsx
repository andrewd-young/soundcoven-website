import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const MetaTags = ({ title, description, image, type = "website" }) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  // Default values
  const defaultTitle = "Coven";
  const defaultDescription =
    "Connect with artists, industry professionals, and instrumentalists";
  const defaultImage = `${window.location.origin}/og-image.jpeg`; // You'll need to add this image to your public folder

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default MetaTags;
