import { MapPin, Image as ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  title?: string;
  location?: string;
  className?: string;
}

export function ImagePlaceholder({ 
  title = "Destination", 
  location = "Unknown location",
  className = "w-full h-64"
}: ImagePlaceholderProps) {
  return (
    <div className={`${className} bg-gradient-to-br from-navy-100 to-navy-200 flex flex-col items-center justify-center text-text-muted relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-text-muted" />
        <h3 className="font-medium text-text-secondary text-sm mb-1 line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 w-6 h-6 border-2 border-gray-300 rounded-full opacity-30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-gray-300 rounded-full opacity-20" />
    </div>
  );
}

// SVG placeholder that can be used as a data URI
export function generatePlaceholderDataUri(width = 400, height = 300, text = "No Image") {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
