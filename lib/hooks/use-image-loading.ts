import { useState, useEffect } from 'react';

export function useImageLoading(src: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setError(null);
    };
    img.onerror = () => {
      setIsLoading(false);
      setError('Failed to load image');
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoading, error };
}



