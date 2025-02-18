import React, { useState, useEffect } from "react";
import { useOptimizedImage } from "../../hooks/useOptimizedImage";
import supabase from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';

// Create a loading state cache to prevent multiple loading states for the same image
const loadingCache = new Map();

export const AuthImage = ({
  src,
  alt,
  width,
  height,
  className,
  objectFit = "cover",
  fallbackSrc = '/default-profile.jpg'
}) => {
  const [isLoading, setIsLoading] = useState(() => !loadingCache.has(src));
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      setError(false);
      
      if (!src || src === fallbackSrc) {
        return;
      }

      try {
        // If it's a Supabase storage URL
        if (src.includes('supabase') || src.includes('storage')) {
          // Extract the path correctly
          const pathMatch = src.match(/public\/application-photos\/(.*)/);
          if (!pathMatch) {
            throw new Error('Invalid storage path');
          }
          
          const path = pathMatch[1]; // This will get everything after "application-photos/"
          
          // Get signed URL
          const { data: signedURL, error: signError } = await supabase.storage
            .from('application-photos')
            .createSignedUrl(path, 3600); // 1 hour expiry

          if (signError) throw signError;
          
          setImageSrc(signedURL.signedUrl);
          loadingCache.set(src, signedURL.signedUrl);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loadingCache.has(src)) {
      fetchImage();
    } else {
      setImageSrc(loadingCache.get(src));
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error || !imageSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{
          objectFit,
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{
          objectFit,
          width: "100%",
          height: "100%",
        }}
        className={`
          transition-opacity duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
