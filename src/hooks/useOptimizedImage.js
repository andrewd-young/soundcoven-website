import { useMemo } from 'react';

// Create a cache outside the hook to persist across renders
const imageCache = new Map();

export const useOptimizedImage = (url, options = {}) => {
  const {
    width = 1200,
    quality = 75,
    format = 'jpeg'
  } = options;

  const optimizedUrl = useMemo(() => {
    if (!url) return url;
    
    // Create a cache key that includes the URL and options
    const cacheKey = `${url}-${width}-${quality}-${format}`;
    
    // Check if we already have this URL in cache
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }
    
    // Only transform Supabase storage URLs
    if (url.includes('storage.googleapis.com') || url.includes('supabase')) {
      const params = new URLSearchParams({
        width: width.toString(),
        quality: quality.toString(),
        format
      });
      const optimizedUrl = `${url}?${params.toString()}`;
      
      // Store in cache
      imageCache.set(cacheKey, optimizedUrl);
      return optimizedUrl;
    }
    
    // Store original URL in cache
    imageCache.set(cacheKey, url);
    return url;
  }, [url, width, quality, format]);

  return optimizedUrl;
}; 