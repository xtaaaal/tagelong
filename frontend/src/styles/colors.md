# Tagelong Color Palette

This document outlines the color system used in the Tagelong application.

## Primary Brand Colors (Tagelong Orange #F69E20)

The main brand colors are defined in `tailwind.config.ts` under the `brand` key:

```css
/* Light to Dark Orange Scale - Based on Tagelong Brand Orange */
brand-50   → #fef9e7  /* Very light orange - backgrounds */
brand-100  → #fef3c7  /* Light orange - subtle highlights */
brand-200  → #fde68a  /* Light orange - borders */
brand-300  → #fcd34d  /* Medium-light orange - disabled states */
brand-400  → #f9b84c  /* Medium orange - secondary actions */
brand-500  → #F69E20  /* Main brand orange - Tagelong primary color */
brand-600  → #d97917  /* Dark orange - hover states */
brand-700  → #b45309  /* Darker orange - active states */
brand-800  → #92400e  /* Very dark orange - text on light backgrounds */
brand-900  → #78350f  /* Darkest orange - headings, strong emphasis */
```

## Secondary Navy Colors (#232939)

The secondary brand colors are defined under the `navy` key:

```css
/* Light to Dark Navy Scale - Based on Tagelong Secondary Navy */
navy-50    → #f8f9fb  /* Very light navy - subtle backgrounds */
navy-100   → #f1f3f7  /* Light navy - card backgrounds */
navy-200   → #e4e8ef  /* Light navy - borders, dividers */
navy-300   → #d1d7e3  /* Medium-light navy - disabled states */
navy-400   → #9ca5b8  /* Medium navy - secondary text */
navy-500   → #232939  /* Main navy - Tagelong secondary color */
navy-600   → #1e2330  /* Dark navy - hover states */
navy-700   → #191d27  /* Darker navy - active states */
navy-800   → #14171e  /* Very dark navy - strong emphasis */
navy-900   → #0f1115  /* Darkest navy - deep backgrounds */
```

## Text Colors

Custom text colors are defined under the `text` key:

```css
/* Text Color System */
text-primary   → #1D1D1D  /* Main text color - high contrast */
text-secondary → #6b7280  /* Secondary text - medium contrast */
text-muted     → #9ca3af  /* Muted text - low contrast */
text-inverse   → #ffffff  /* White text for dark backgrounds */
```

## Accent Colors

Additional brand colors defined under the `tagelong` key:

```css
tagelong-pink    → #ec4899  /* Pink accent - gradients, highlights */
tagelong-purple  → #8b5cf6  /* Purple accent - secondary elements */
tagelong-blue    → #3b82f6  /* Blue accent - links, info */
tagelong-green   → #10b981  /* Green accent - success states */
tagelong-yellow  → #f59e0b  /* Yellow accent - warnings */
```

## Usage Examples

### Instead of using default Tailwind orange:
```jsx
// ❌ Old way (default Tailwind)
<button className="bg-orange-500 hover:bg-orange-600">

// ✅ New way (custom brand colors)
<button className="bg-brand-500 hover:bg-brand-600">
```

### Using accent colors:
```jsx
// Gradient backgrounds
<div className="bg-gradient-to-r from-brand-500 to-tagelong-pink">

// Success states
<div className="text-tagelong-green bg-tagelong-green/10">

// Warning states  
<div className="text-tagelong-yellow bg-tagelong-yellow/10">
```

### Text colors:
```jsx
// Main text with custom text color
<h1 className="text-text-primary">Main Heading</h1>
<p className="text-text-primary">Primary body text</p>

// Secondary and muted text
<p className="text-text-secondary">Secondary information</p>
<span className="text-text-muted">Helper text or captions</span>

// Brand color text
<h1 className="text-brand-900">Brand colored heading</h1>
<p className="text-brand-700">Brand colored text</p>

// Navy color text
<h2 className="text-navy-800">Navy colored heading</h2>
<p className="text-navy-600">Navy colored text</p>

// Links
<a className="text-tagelong-blue hover:text-tagelong-purple">Interactive link</a>
```

### Backgrounds and borders:
```jsx
// Brand card backgrounds
<div className="bg-brand-50 border border-brand-200">
<div className="bg-brand-100 text-text-primary p-4">

// Navy card backgrounds  
<div className="bg-navy-50 border border-navy-200">
<div className="bg-navy-100 text-text-primary p-4">

// Button variants
<button className="bg-brand-500 hover:bg-brand-600 text-text-inverse">Primary</button>
<button className="bg-navy-500 hover:bg-navy-600 text-text-inverse">Secondary</button>
<button className="bg-tagelong-pink hover:bg-tagelong-purple text-text-inverse">Accent</button>

// Outline buttons
<button className="border border-brand-500 text-brand-600 hover:bg-brand-50">Brand Outline</button>
<button className="border border-navy-500 text-navy-600 hover:bg-navy-50">Navy Outline</button>
```

## ShadCN/UI Colors

The existing ShadCN/UI color system is preserved for components that use CSS custom properties:

- `background`, `foreground`
- `card`, `popover`
- `primary`, `secondary`
- `muted`, `accent`
- `destructive`
- `border`, `input`, `ring`

These work with the dark/light theme system and are defined in `globals.css`.

## Migration Guide

To update existing components to use the new color system:

1. **Replace orange classes with brand colors:**
   - `bg-orange-500` → `bg-brand-500`
   - `text-orange-600` → `text-brand-600`
   - `border-orange-200` → `border-brand-200`

2. **Replace gray text with custom text colors:**
   - `text-gray-900` → `text-text-primary` (for main content)
   - `text-gray-600` → `text-text-secondary` (for secondary content)
   - `text-gray-400` → `text-text-muted` (for muted content)

3. **Use navy for secondary brand elements:**
   - `bg-gray-800` → `bg-navy-800` (for headers, footers)
   - `bg-gray-100` → `bg-navy-100` (for subtle backgrounds)
   - `text-gray-700` → `text-navy-700` (for secondary emphasis)

4. **Use accent colors for interactive elements:**
   - `text-pink-500` → `text-tagelong-pink`
   - `bg-blue-500` → `bg-tagelong-blue`
   - `text-green-600` → `text-tagelong-green`

5. **Keep ShadCN colors for UI components:**
   - Keep `bg-primary`, `text-foreground`, etc. for UI components
   - Use `brand-*`, `navy-*`, and `text-*` colors for application-specific elements

## Color Accessibility

### Text Contrast Guidelines:
- **text-primary (#1D1D1D)**: High contrast for main content (AAA compliance)
- **text-secondary**: Medium contrast for secondary content (AA compliance)  
- **text-muted**: Low contrast for helper text (use sparingly)

### Brand Colors:
- **brand-900/800**: Use for text on light backgrounds
- **brand-50/100**: Use for backgrounds with dark text
- **brand-500**: Primary brand color, ensure proper contrast with text

### Navy Colors:
- **navy-900/800**: Use for text on light backgrounds
- **navy-50/100**: Use for backgrounds with dark text  
- **navy-500**: Secondary brand color, test contrast with white text

### Best Practices:
- Always test color combinations for WCAG accessibility compliance
- Use `text-text-primary` for main content instead of pure black
- Pair light navy backgrounds (navy-50/100) with `text-text-primary`
- Use `text-text-inverse` (white) on dark brand/navy backgrounds

## Development Tips

1. **Restart development server** after changing `tailwind.config.ts`
2. **Use CSS variables** in `globals.css` for dynamic theme switching
3. **Test in both light and dark modes** if applicable
4. **Use opacity modifiers** like `bg-brand-500/20` for subtle effects
