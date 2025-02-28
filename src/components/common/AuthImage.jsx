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
  fallbackSrc
}) => {
  const [isLoading, setIsLoading] = useState(() => !loadingCache.has(src));
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      setError(false);
      
      if (!src) {
        return;
      }

      try {
        // If it's a Supabase storage URL
        if (src.includes('supabase') || src.includes('storage')) {
          // Extract the path correctly - update to handle both old and new path formats
          const pathMatch = src.match(/application-photos\/(.+)/);
          if (!pathMatch) {
            throw new Error('Invalid storage path');
          }
          
          const path = pathMatch[1];
          
          // Get signed URL
          const { data: signedURL, error: signError } = await supabase.storage
            .from('application-photos')
            .createSignedUrl(path, 3600); // 1 hour expiry

          if (signError) {
            // Properly await the public URL call
            const { data: publicURL, error: publicUrlError } = await supabase.storage
              .from('application-photos')
              .getPublicUrl(path);
            
            if (publicUrlError) {
              throw publicUrlError;
            }

            if (publicURL?.publicUrl) {
              setImageSrc(publicURL.publicUrl);
              return;
            }

            throw new Error('Failed to get public URL');
          }
          
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
  }, [src]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=432347&color=fff&size=${width}`);
  };

  if (error || !imageSrc) {
    return (
      <div style={{ width: `${width}px`, height: `${height}px` }} className={className}>
        <img
          src={fallbackSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=432347&color=fff&size=${width}`}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full"
          style={{
            objectFit,
            borderRadius: '8px',
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`
          w-full h-full
          transition-opacity duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        style={{
          objectFit,
          borderRadius: '8px',
        }}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
