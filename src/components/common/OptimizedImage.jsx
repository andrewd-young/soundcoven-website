import React, { useState, useEffect } from "react";
import { useOptimizedImage } from "../../hooks/useOptimizedImage";
import supabase from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';

// Create a loading state cache to prevent multiple loading states for the same image
const loadingCache = new Map();

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  objectFit = "cover",
  quality,
  imageWidth,
  fallbackSrc = '/default-profile.jpg'
}) => {
  const optimizedSrc = useOptimizedImage(src, {
    width: imageWidth || width,
    quality: quality || 75,
  });

  const [isLoading, setIsLoading] = useState(() => {
    return !loadingCache.has(src);
  });
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (loadingCache.has(src)) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src || fallbackSrc;

    img.onload = () => {
      setIsLoading(false);
      loadingCache.set(src, true);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src, fallbackSrc]);

  useEffect(() => {
    const fetchImage = async () => {
      // Reset error state at start of each fetch
      setError(false);
      
      // Don't treat empty src as error - just skip validation
      if (!src || src === fallbackSrc) {
        return;
      }

      try {
        // Only validate actual URLs
        if (!src.startsWith('http')) {
          return;
        }

        // Try to fetch the image
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setError(true);
      }
    };

    fetchImage();
  }, [src, fallbackSrc]);

  const handleError = () => {
    setError(true);
  };

  if (error || !src) {
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
        src={src}
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
