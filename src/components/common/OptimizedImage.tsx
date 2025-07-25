import React, { useState, useEffect } from "react";
import { useOptimizedImage } from "../../hooks/useOptimizedImage";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  quality?: number;
  imageWidth?: number;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  quality = 75,
  imageWidth = 1200,
  fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Found",
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);

  const optimizedUrl = useOptimizedImage(src, {
    width: imageWidth,
    quality,
    format: 'jpeg'
  });

  useEffect(() => {
    if (optimizedUrl) {
      setImageSrc(optimizedUrl);
    } else if (src) {
      setImageSrc(src);
    } else {
      setImageSrc(fallbackSrc);
    }
    setLoading(false);
  }, [optimizedUrl, src, fallbackSrc]);

  const handleImageError = () => {
    setImageSrc(fallbackSrc);
  };

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        objectFit,
      }}
      onError={handleImageError}
    />
  );
};

export default OptimizedImage;
