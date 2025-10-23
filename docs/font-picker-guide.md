# Font Picker Guide

This guide explains how to use the optional font picker field in the `@rachelallyson/hero-hook-form` package.

## Overview

The font picker field provides a rich interface for selecting fonts with Google Fonts integration. It's an **optional feature** that requires the `@rachelallyson/heroui-font-picker` package.

## Installation

### Option 1: With Font Picker (Recommended for Typography-Heavy Apps)

Install the font picker package for advanced font selection:

```bash
npm install @rachelallyson/hero-hook-form @rachelallyson/heroui-font-picker
```

### Option 2: Without Font Picker (Default)

The font picker field will show a helpful fallback message if the package is not installed:

```bash
npm install @rachelallyson/hero-hook-form
# FontPickerField will show fallback UI
```

## How It Works

The font picker field automatically detects if the `@rachelallyson/heroui-font-picker` package is available using dynamic imports:

- **✅ With Package**: Full font picker functionality with Google Fonts integration
- **⏳ Loading**: Shows loading state while the package is being imported
- **⚠️ Without Package**: Shows helpful fallback message explaining the requirement

The FontPickerField uses modern dynamic imports to load the font picker package at runtime, ensuring compatibility with all modern bundlers and ESM environments.

This provides:

- ✅ **Native HeroUI Autocomplete** - Built-in search, filtering, and keyboard navigation
- ✅ **Complete Google Fonts Data** - 1,785+ Google Fonts from react-fontpicker, no API key required
- ✅ **No External Dependencies** - Built entirely with HeroUI components
- ✅ **Perfect Integration** - Native HeroUI styling and theming
- ✅ **Optimal Performance** - Static JSON data, instant loading, works offline
- ✅ **Intelligent Font Loading** - 4-variant optimization reduces font file size by ~60%
- ✅ **Font Loading Detection** - Callbacks to detect when fonts are fully loaded
- ✅ **Instant Previews** - Font previews using CSS font-display technique, no loading required
- ✅ **Full Control** - Complete customization with HeroUI design tokens
- ✅ **Accessibility** - Built-in ARIA support and keyboard navigation
- ✅ **Sections Support** - Organized font categories with AutocompleteSection

## Complete Font Data from react-fontpicker

The font picker now uses the **complete font data from react-fontpicker** (1,785+ Google Fonts), providing:

- **🚀 Instant Loading** - No network requests, fonts load immediately
- **📱 Offline Support** - Works without internet connection
- **🔒 No API Key Required** - No need for Google Fonts API key
- **⚡ Better Performance** - No API rate limits or network delays
- **📦 Self-Contained** - All font data bundled with the component
- **🎯 Complete Library** - Full Google Fonts collection from react-fontpicker
- **✅ Proven Data** - Uses the same font data as the popular react-fontpicker library

## Font Loading Optimization

The font picker implements **intelligent 4-variant loading** based on react-fontpicker best practices:

- **Regular** (~400 weight) - Primary font weight
- **Bold** (~700 weight) - Bold variant
- **Italic** (~400 weight italic) - Italic variant  
- **Bold Italic** (~700 weight italic) - Bold italic variant

This reduces font file size by approximately **60%** while maintaining excellent typography quality.

## Font Preview System

The font picker uses the **actual sprite system from react-fontpicker** ([font-preview directory](https://github.com/ae9is/react-fontpicker/tree/main/packages/fontpicker/font-preview)) that provides instant font previews using pre-rendered sprites:

- **🎨 Sprite System**: Uses pre-rendered SVG sprites for instant font previews
- **📦 Complete Assets**: Includes all 9 sprite files (`sprite.1.svg` through `sprite.9.svg`) and `font-previews.css` from react-fontpicker
- **⚡ Zero Loading Time**: Previews display instantly without any font downloads
- **🎯 Smart Preview Text**: Different preview text based on font category:
  - **Display fonts**: "DISPLAY FONT"
  - **Serif fonts**: "Serif Typography"
  - **Monospace fonts**: "monospace"
  - **Sans Serif fonts**: "Sans Serif"
- **🔧 CSS Classes**: Uses `font-preview-{font-name}` classes for sprite positioning
- **📱 Responsive**: Optimized sprite system with `background-size: 30em auto`
- **Only Load Selected**: Actual Google Fonts are only loaded when a font is selected, not for previews

## HeroUI Autocomplete Features

The font picker leverages the powerful [HeroUI Autocomplete component](https://www.heroui.com/docs/components/autocomplete) which provides:

### **🔍 Built-in Search & Filtering**

- **Real-time Search**: Type to filter fonts instantly
- **Smart Filtering**: Built-in filtering with customizable options
- **Keyboard Navigation**: Full keyboard support for accessibility

### **📱 Responsive Design**

- **Mobile Optimized**: Touch-friendly interface
- **Adaptive Layout**: Works on all screen sizes
- **Smooth Animations**: Native HeroUI animations and transitions

### **♿ Accessibility Features**

- **ARIA Support**: Full screen reader compatibility
- **Keyboard Navigation**: Arrow keys, Enter, Escape support
- **Focus Management**: Proper focus handling and indicators

### **🎨 Customization Options**

- **Sections**: Organized font categories with `AutocompleteSection`
- **Custom Items**: Font previews with `startContent` and `endContent`
- **Styling**: Full HeroUI design token integration
- **Theming**: Automatic light/dark mode support

## Basic Usage

### Simple Font Picker

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const schema = z.object({
  headingFont: z.string().default("Inter"),
  bodyFont: z.string().default("Roboto"),
});

const config = createZodFormConfig(schema, [
  {
    name: "headingFont",
    type: "fontPicker",
    label: "Heading Font",
    fontPickerProps: {
      showFontPreview: true,
      googleFontsApiKey: "YOUR_GOOGLE_FONTS_API_KEY", // Optional: Add your Google Fonts API key
      maxFontsPerCategory: 50,
      fallbackToLocalFonts: true
    },
  },
  {
    name: "bodyFont",
    type: "fontPicker", 
    label: "Body Font",
    fontPickerProps: {
      showFontPreview: true,
      googleFontsApiKey: "YOUR_GOOGLE_FONTS_API_KEY", // Optional: Add your Google Fonts API key
      maxFontsPerCategory: 30,
      fallbackToLocalFonts: true
    },
  },
], {
  defaultValues: {
    headingFont: "Inter",
    bodyFont: "Roboto",
  },
});

export default function FontSettingsForm() {
  const handleSubmit = (data) => {
    console.log("Font settings:", data);
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="Font Settings"
      showResetButton={true}
    />
  );
}
```

## Advanced Configuration

### Custom Font Collections

```tsx
const config = createZodFormConfig(schema, [
  {
    name: "primaryFont",
    type: "fontPicker",
    label: "Primary Font",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["sans-serif", "serif"],
      maxFonts: 50,
      searchPlaceholder: "Search fonts...",
    },
  },
]);
```

### Font Picker Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showFontPreview` | `boolean` | `true` | Show font preview in the picker |
| `showFontVariants` | `boolean` | `true` | Show font weight variants |
| `fontCategories` | `string[]` | `[]` | Filter by font categories |
| `maxFonts` | `number` | `100` | Maximum number of fonts to load |
| `searchPlaceholder` | `string` | `"Search fonts..."` | Placeholder text for search |
| `apiKey` | `string` | - | Google Fonts API key (optional) |

## Complete Example

Here's a comprehensive example with multiple font pickers:

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const typographySchema = z.object({
  fonts: z.object({
    heading: z.string().default("Inter"),
    body: z.string().default("Roboto"),
    code: z.string().default("Fira Code"),
  }),
  layout: z.object({
    fontSize: z.enum(["small", "medium", "large"]).default("medium"),
    lineHeight: z.enum(["tight", "normal", "relaxed"]).default("normal"),
  }),
});

const config = createZodFormConfig(typographySchema, [
  // Font selections
  {
    name: "fonts.heading",
    type: "fontPicker",
    label: "Heading Font",
    description: "Font for headings and titles",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["sans-serif", "serif"],
      maxFonts: 30,
    },
  },
  {
    name: "fonts.body",
    type: "fontPicker",
    label: "Body Font", 
    description: "Font for body text and paragraphs",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["sans-serif"],
      maxFonts: 50,
    },
  },
  {
    name: "fonts.code",
    type: "fontPicker",
    label: "Code Font",
    description: "Monospace font for code blocks",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: false,
      fontCategories: ["monospace"],
      maxFonts: 20,
    },
  },
  
  // Layout settings
  {
    name: "layout.fontSize",
    type: "radio",
    label: "Font Size",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    name: "layout.lineHeight",
    type: "radio",
    label: "Line Height",
    radioOptions: [
      { label: "Tight", value: "tight" },
      { label: "Normal", value: "normal" },
      { label: "Relaxed", value: "relaxed" },
    ],
  },
], {
  defaultValues: {
    fonts: {
      heading: "Inter",
      body: "Roboto", 
      code: "Fira Code",
    },
    layout: {
      fontSize: "medium",
      lineHeight: "normal",
    },
  },
});

export default function TypographyForm() {
  const handleSubmit = (data) => {
    console.log("Typography settings:", data);
    // Data structure:
    // {
    //   fonts: {
    //     heading: "Inter",
    //     body: "Roboto",
    //     code: "Fira Code"
    //   },
    //   layout: {
    //     fontSize: "medium",
    //     lineHeight: "normal"
    //   }
    // }
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="Typography Settings"
      subtitle="Customize your font choices and layout"
      showResetButton={true}
      layout="grid"
      columns={2}
    />
  );
}
```

## Fallback Behavior

If `react-fontpicker-ts` is not installed, the font picker field will display a fallback message:

```tsx
// When react-fontpicker-ts is not installed
<div className="p-4 border border-gray-300 rounded-md bg-gray-50">
  <p className="text-sm text-gray-600">
    Font picker not available. Install react-fontpicker-ts to use this feature.
  </p>
</div>
```

## HeroUI Integration

The font picker is designed to integrate seamlessly with HeroUI's design system. It automatically uses HeroUI's design tokens, theme system, and component styling patterns.

### Automatic Styling

The font picker automatically applies HeroUI-compatible styling:

```tsx
// No additional styling needed - automatically matches HeroUI theme
{
  name: "font",
  type: "fontPicker",
  label: "Font",
  fontPickerProps: {
    showFontPreview: true,
    showFontVariants: true,
  },
}
```

### Theme Support

The font picker automatically adapts to:

- ✅ **Light Theme** - Clean, bright appearance
- ✅ **Dark Theme** - Dark mode optimized  
- ✅ **System Theme** - Follows user's system preference
- ✅ **Custom Themes** - Supports HeroUI's custom theme system

### Custom Styling

For advanced customization, see the [Font Picker Styling Guide](./font-picker-styling.md) which covers:

- HeroUI design token integration
- Theme system compatibility
- Component variant support
- Responsive design
- Accessibility features

## Integration with Design Systems

### Theme Integration

```tsx
const config = createZodFormConfig(schema, [
  {
    name: "themeFonts",
    type: "fontPicker",
    label: "Theme Fonts",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["sans-serif"],
      maxFonts: 25,
    },
  },
]);
```

### Brand Font Selection

```tsx
const brandSchema = z.object({
  brandFont: z.string().default("Poppins"),
  accentFont: z.string().default("Playfair Display"),
});

const config = createZodFormConfig(brandSchema, [
  {
    name: "brandFont",
    type: "fontPicker",
    label: "Brand Font",
    description: "Primary font for your brand",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["sans-serif"],
    },
  },
  {
    name: "accentFont",
    type: "fontPicker",
    label: "Accent Font",
    description: "Font for special headings and accents",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      fontCategories: ["serif", "display"],
    },
  },
]);
```

## Validation

### Required Font Selection

```tsx
const schema = z.object({
  primaryFont: z.string().min(1, "Please select a primary font"),
  secondaryFont: z.string().min(1, "Please select a secondary font"),
});

const fields = [
  {
    name: "primaryFont",
    type: "fontPicker",
    label: "Primary Font",
    rules: {
      required: "Primary font is required",
    },
  },
  {
    name: "secondaryFont",
    type: "fontPicker",
    label: "Secondary Font", 
    rules: {
      required: "Secondary font is required",
    },
  },
];
```

### Font Pair Validation

```tsx
const schema = z.object({
  headingFont: z.string(),
  bodyFont: z.string(),
}).refine((data) => data.headingFont !== data.bodyFont, {
  message: "Heading and body fonts must be different",
  path: ["bodyFont"],
});
```

## Best Practices

### 1. **Font Categories**

```tsx
// Use appropriate font categories
fontPickerProps: {
  fontCategories: ["sans-serif"], // For body text
  fontCategories: ["serif"], // For headings
  fontCategories: ["monospace"], // For code
}
```

### 2. **Performance Optimization**

```tsx
// Limit the number of fonts for better performance
fontPickerProps: {
  maxFonts: 30, // Don't load too many fonts
}
```

### 3. **User Experience**

```tsx
// Provide helpful descriptions
{
  name: "headingFont",
  type: "fontPicker",
  label: "Heading Font",
  description: "Choose a font that represents your brand",
}
```

### 4. **Default Values**

```tsx
// Provide sensible defaults
defaultValues: {
  headingFont: "Inter",
  bodyFont: "Roboto",
  codeFont: "Fira Code",
}
```

## Troubleshooting

### Common Issues

1. **Font picker not showing?**
   - Ensure `react-fontpicker-ts` is installed
   - Check that the package is properly imported

2. **Fonts not loading?**
   - Check your internet connection
   - Verify Google Fonts API is accessible
   - Consider using a custom font collection

3. **Styling issues?**
   - Import the required CSS files
   - Check for CSS conflicts
   - Use custom CSS classes

### Debug Mode

```tsx
fontPickerProps: {
  showFontPreview: true,
  showFontVariants: true,
  debug: true, // Enable debug mode
}
```

## Migration from Custom Font Pickers

### Before (Custom Implementation)

```tsx
// Custom font picker implementation
<select value={font} onChange={setFont}>
  <option value="Inter">Inter</option>
  <option value="Roboto">Roboto</option>
</select>
```

### After (Hero Hook Form)

```tsx
// Using the font picker field
{
  name: "font",
  type: "fontPicker",
  label: "Font",
  fontPickerProps: {
    showFontPreview: true,
  },
}
```

## Summary

The font picker field provides:

- ✅ **Rich font selection** with Google Fonts integration
- ✅ **Font preview** and variant selection
- ✅ **Optional dependency** - works without installation
- ✅ **Type safety** with TypeScript support
- ✅ **Validation integration** with form validation
- ✅ **Custom styling** support
- ✅ **Performance optimization** with font limits

This makes it easy to create professional font selection interfaces in your forms!
