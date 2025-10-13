# Assets Directory

This directory contains all static assets for the application.

## Images Directory (`/assets/images/`)

### Logo Files

Place your logo files here with the following naming convention:

- **`logo.png`** or **`logo.svg`** - Main logo for light theme
- **`logo-white.png`** or **`logo-white.svg`** - Logo for dark theme (optional)

### Supported Formats

- PNG (recommended for photos/complex graphics)
- SVG (recommended for logos/icons)
- JPG/JPEG
- WebP

### Logo Requirements

- **Recommended size**: 100x100px to 200x200px
- **Format**: PNG or SVG preferred
- **Background**: Transparent preferred for PNG files
- **Style**: Simple, scalable design works best

### File Structure
```
public/
├── assets/
│   ├── images/
│   │   ├── logo.svg          (main logo)
│   │   ├── logo-white.png    (dark theme logo)
│   │   └── other-images...
│   └── README.md
└── other-static-files...
```

### Usage in Components

The Logo component automatically:
- Selects the appropriate logo based on theme (dark/light)
- Provides fallback if image fails to load
- Supports customizable dimensions
- Uses Next.js Image optimization

### Adding Your Own Logo

1. Replace the placeholder files with your actual logo:
   - `logo.svg` or `logo.png` - Your main logo
   - `logo-white.png` or `logo-white.svg` - Version for dark backgrounds (optional)

2. The Logo component will automatically use your files!

### Logo Component Props

```tsx
<Logo 
  text="Your Brand"      // Brand text (default: "Tagelong")
  dark={false}           // Use dark theme logo (default: false)
  width={32}             // Logo width in pixels (default: 32)
  height={32}            // Logo height in pixels (default: 32)  
  showText={true}        // Show text alongside logo (default: true)
/>
```
