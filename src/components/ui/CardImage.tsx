import { useState } from 'react';
import { cn } from '../../lib/cn';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-subtle-gray text-muted-text text-caption',
          className
        )}
      >
        <span>No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}