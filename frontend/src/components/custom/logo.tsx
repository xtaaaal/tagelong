"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  text?: string;
  dark?: boolean;
  width?: number;
  height?: number;
  showText?: boolean;
}

export function Logo({
  text = "Tagelong",
  dark = false,
  width = 132.5,
  height = 32,
  showText = false,
}: Readonly<LogoProps>) {
  // Use different logo based on dark/light theme
  // Try multiple formats - PNG first, then SVG, then fallback
  const logoSrc = dark 
    ? "/assets/images/logo-white.png" 
    : "/assets/images/logo.png";

  return (
    <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
      <div className="relative">
        <Image
          src={logoSrc}
          alt={`${text} Logo`}
          width={width}
          height={height}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
          priority
          // Fallback to text if image fails to load
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // Show fallback text
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        {/* Fallback text logo - hidden by default */}
        <div 
          className="hidden bg-gradient-to-r from-brand-500 to-tagelong-pink text-white font-bold rounded px-2 py-1 text-sm"
          style={{ display: 'none' }}
        >
          {text.charAt(0)}
        </div>
      </div>
      {showText && (
        <span
          className={`text-lg font-semibold ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          {text}
        </span>
      )}
    </Link>
  );
}