import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../utils/supabase";
import { User } from "@supabase/supabase-js";

interface AuthImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  fallbackSrc?: string;
  maxRetries?: number;
}

const AuthImage: React.FC<AuthImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Found",
  maxRetries = 3,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const { user } = useAuth() as { user: User | null };

  useEffect(() => {
    const loadImage = async () => {
      if (!src || !user) {
        setImageSrc(fallbackSrc);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Check if it's a Supabase storage URL
        if (src.includes("supabase.co") && src.includes("/storage/")) {
          // Extract bucket and path from the URL
          const urlParts = src.split("/storage/v1/object/public/");
          if (urlParts.length === 2) {
            const [bucket, path] = urlParts[1].split("/", 2);
            
            // Get signed URL
            const { data: signedURL, error: signError } = await Promise.race<{ data: { signedUrl: string }; error: Error | null }>([
              supabase.storage.from(bucket).createSignedUrl(path, 3600) as unknown as Promise<{ data: { signedUrl: string }; error: Error | null }>,
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 5000)
              )
            ]);

            if (signError) {
              // Try to get public URL as fallback
              const { data: publicURL, error: publicUrlError } = await (supabase.storage.from(bucket)
                .getPublicUrl(path) as unknown as Promise<{ data: { publicUrl: string }; error: Error | null }>);

              if (publicUrlError) {
                throw new Error("Failed to get image URL");
              }

              setImageSrc(publicURL.publicUrl);
            } else {
              setImageSrc(signedURL.signedUrl);
            }
          } else {
            setImageSrc(src);
          }
        } else {
          setImageSrc(src);
        }
      } catch (err) {
        console.error("Error loading image:", err);
        
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            setImageSrc(src); // Retry with original src
          }, 1000 * (retryCount + 1));
        } else {
          setImageSrc(fallbackSrc);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [src, user, retryCount, maxRetries, fallbackSrc]);

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setImageSrc(src); // Retry with original src
      }, 1000 * (retryCount + 1));
    } else {
      setImageSrc(fallbackSrc);
    }
  };

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 ${className}`}
        style={{ 
          width: width || 'auto', 
          height: height || 'auto' 
        }}
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

export default AuthImage;
