"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlaceholder, generatePlaceholderDataUri } from "./image-placeholder";

interface SafeImageProps {
  src?: string;
  alt: string;
  title?: string;
  location?: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export function SafeImage({
  src,
  alt,
  title,
  location,
  width = 400,
  height = 300,
  className = "",
  fill = false,
  sizes,
  priority = false,
  objectFit = "cover"
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src provided or error occurred, show placeholder
  if (!src || imageError) {
    if (fill) {
      return (
        <ImagePlaceholder 
          title={title}
          location={location}
          className="w-full h-full absolute inset-0"
        />
      );
    }
    
    return (
      <div className={className} style={{ width, height }}>
        <ImagePlaceholder 
          title={title}
          location={location}
          className="w-full h-full"
        />
      </div>
    );
  }

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Generate fallback data URI
  const fallbackSrc = generatePlaceholderDataUri(width, height, title || "Image");

  const imageProps = {
    src: src,
    alt: alt,
    onError: handleImageError,
    onLoad: handleImageLoad,
    className: `${className} ${objectFit === "cover" ? "object-cover" : objectFit === "contain" ? "object-contain" : "object-fill"} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`,
    priority,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes ? { sizes } : {}),
  };

  return (
    <div className={fill ? "relative w-full h-full" : "relative"} style={!fill ? { width, height } : {}}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className={fill ? "absolute inset-0" : "absolute inset-0"}>
          <div className="w-full h-full bg-navy-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-navy-300 border-t-navy-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <Image {...imageProps} />
      
      {/* Fallback image (hidden, used for error handling) */}
      <Image
        src={fallbackSrc}
        alt={alt}
        className="hidden"
        width={width}
        height={height}
        onError={() => {}} // Prevent infinite error loop
      />
    </div>
  );
}
