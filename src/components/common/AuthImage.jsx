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
  fallbackSrc,
  maxRetries = 2,
}) => {
  const [isLoading, setIsLoading] = useState(() => !loadingCache.has(src));
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImage = async (retryAttempt = 0) => {
      setError(false);
      
      if (!src) {
        return;
      }

      try {
        // If it's a Supabase storage URL
        if (src.includes('supabase') || src.includes('storage')) {
          const pathMatch = src.match(/application-photos\/(.+)/);
          if (!pathMatch) {
            throw new Error('Invalid storage path');
          }
          
          const path = pathMatch[1];
          
          // Get signed URL with timeout
          const signedUrlPromise = supabase.storage
            .from('application-photos')
            .createSignedUrl(path, 3600);
          
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
          });

          // Race between the fetch and timeout
          const { data: signedURL, error: signError } = await Promise.race([
            signedUrlPromise,
            timeoutPromise
          ]);

          if (signError) {
            // Try public URL as fallback
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
        
        // Retry logic
        if (retryAttempt < maxRetries) {
          console.log(`Retrying image load, attempt ${retryAttempt + 1} of ${maxRetries}`);
          setRetryCount(retryAttempt + 1);
          // Exponential backoff: 1s, 2s, 4s, etc.
          setTimeout(() => fetchImage(retryAttempt + 1), Math.pow(2, retryAttempt) * 1000);
          return;
        }
        
        setError(true);
      } finally {
        if (retryAttempt === maxRetries || !error) {
          setIsLoading(false);
        }
      }
    };

    if (!loadingCache.has(src)) {
      fetchImage();
    } else {
      setImageSrc(loadingCache.get(src));
      setIsLoading(false);
    }
  }, [src, maxRetries]);

  const handleError = () => {
    // Only set error if we've exhausted all retries
    if (retryCount >= maxRetries) {
      setError(true);
      setIsLoading(false);
      setImageSrc(fallbackSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=432347&color=fff&size=${width}`);
    }
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
