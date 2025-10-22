"use client";

import { ReactNode } from "react";

interface MasonryGridProps {
  children: ReactNode[];
  className?: string;
}

export function MasonryGrid({ children, className = "" }: MasonryGridProps) {
  return (
    <div className={`masonry-grid ${className}`}>
      {children}
    </div>
  );
}

// CSS for masonry grid - we'll add this to globals.css
export const masonryGridCSS = `
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 10px; /* Base row height */
  gap: 20px;
  padding: 0;
}

/* Responsive breakpoints */
@media (min-width: 640px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

/* Card size variations */
.masonry-item-small {
  grid-row-end: span 20; /* ~200px height */
}

.masonry-item-medium {
  grid-row-end: span 30; /* ~300px height */
}

.masonry-item-large {
  grid-row-end: span 40; /* ~400px height */
}

.masonry-item-extra-large {
  grid-row-end: span 50; /* ~500px height */
}

/* Responsive card sizing */
@media (max-width: 639px) {
  .masonry-item-small {
    grid-row-end: span 18;
  }
  
  .masonry-item-medium {
    grid-row-end: span 25;
  }
  
  .masonry-item-large {
    grid-row-end: span 32;
  }
  
  .masonry-item-extra-large {
    grid-row-end: span 40;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .masonry-item-small {
    grid-row-end: span 22;
  }
  
  .masonry-item-medium {
    grid-row-end: span 28;
  }
  
  .masonry-item-large {
    grid-row-end: span 35;
  }
  
  .masonry-item-extra-large {
    grid-row-end: span 45;
  }
}

@media (min-width: 1024px) {
  .masonry-item-small {
    grid-row-end: span 20;
  }
  
  .masonry-item-medium {
    grid-row-end: span 30;
  }
  
  .masonry-item-large {
    grid-row-end: span 40;
  }
  
  .masonry-item-extra-large {
    grid-row-end: span 50;
  }
}
`;
