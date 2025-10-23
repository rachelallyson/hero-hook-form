# Font Picker Styling Guide

This guide explains how to properly style the font picker field to match HeroUI's design system and theme system.

## Overview

The font picker field is designed to integrate seamlessly with HeroUI's design tokens, theme system, and component styling patterns. This ensures consistency with the rest of your application.

## HeroUI Design System Integration

### Design Tokens

The font picker uses HeroUI's CSS custom properties and design tokens:

```css
/* HeroUI Design Tokens Used */
--heroui-content1          /* Background colors */
--heroui-foreground        /* Text colors */
--heroui-default-200       /* Border colors */
--heroui-primary           /* Primary accent colors */
--heroui-radius           /* Border radius values */
```

### Theme Support

The font picker automatically adapts to HeroUI's theme system:

- ✅ **Light Theme** - Clean, bright appearance
- ✅ **Dark Theme** - Dark mode optimized
- ✅ **System Theme** - Follows user's system preference
- ✅ **Custom Themes** - Supports HeroUI's custom theme system

## Styling Architecture

### Base Classes

The font picker uses a structured class system that mirrors HeroUI's approach:

```css
.fontpicker {
  /* Base input styling using HeroUI tokens */
  @apply w-full min-h-[2.5rem] px-3 py-2 bg-content1 border border-default-200 rounded-medium;
  @apply text-foreground placeholder:text-default-500;
  @apply transition-colors duration-200;
  @apply focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}
```

### Component Variants

The font picker supports HeroUI's component variants:

#### Size Variants

```css
.fontpicker--sm { @apply min-h-[2rem] px-2 py-1 text-sm; }
.fontpicker--md { @apply min-h-[2.5rem] px-3 py-2 text-sm; }
.fontpicker--lg { @apply min-h-[3rem] px-4 py-3 text-base; }
```

#### Color Variants

```css
.fontpicker--default { @apply border-default-200; }
.fontpicker--primary { @apply border-primary; }
.fontpicker--secondary { @apply border-secondary; }
.fontpicker--success { @apply border-success; }
.fontpicker--warning { @apply border-warning; }
.fontpicker--danger { @apply border-danger; }
```

#### Style Variants

```css
.fontpicker--flat { @apply border-none bg-default-100; }
.fontpicker--bordered { @apply border-default-200 bg-transparent; }
.fontpicker--faded { @apply border-default-200 bg-default-50; }
.fontpicker--underlined { @apply border-none border-b-2 border-default-200 bg-transparent rounded-none; }
```

## Usage Examples

### Basic Styling

```tsx
{
  name: "font",
  type: "fontPicker",
  label: "Font",
  fontPickerProps: {
    // HeroUI classes are automatically applied
    showFontPreview: true,
    showFontVariants: true,
  },
}
```

### Custom Styling

```tsx
{
  name: "font",
  type: "fontPicker",
  label: "Font",
  className: "fontpicker--lg fontpicker--primary",
  fontPickerProps: {
    showFontPreview: true,
    showFontVariants: true,
  },
}
```

### Theme-Aware Styling

```tsx
// The font picker automatically adapts to the current theme
const config = createZodFormConfig(schema, [
  {
    name: "headingFont",
    type: "fontPicker",
    label: "Heading Font",
    fontPickerProps: {
      showFontPreview: true,
      showFontVariants: true,
      // Styling automatically matches HeroUI theme
    },
  },
]);
```

## Advanced Customization

### Custom CSS Variables

You can override HeroUI's design tokens for the font picker:

```css
/* Override specific design tokens */
.fontpicker {
  --heroui-primary: 210 100% 50%;
  --heroui-content1: 0 0% 100%;
  --heroui-foreground: 0 0% 9%;
}
```

### Component-Specific Overrides

```css
/* Override specific font picker elements */
.fontpicker__popout {
  @apply shadow-2xl; /* Custom shadow */
  @apply border-2;   /* Custom border */
}

.fontpicker__option {
  @apply py-3;       /* Custom padding */
  @apply text-base;  /* Custom font size */
}
```

### Theme-Specific Customizations

```css
/* Light theme customizations */
.light .fontpicker {
  @apply border-2 border-primary/20;
}

.light .fontpicker__popout {
  @apply shadow-xl;
}

/* Dark theme customizations */
.dark .fontpicker {
  @apply border-2 border-primary/30;
}

.dark .fontpicker__popout {
  @apply shadow-2xl;
}
```

## Integration with HeroUI Components

### Provider Configuration

The font picker respects HeroUI's provider configuration:

```tsx
<HeroHookFormProvider
  defaults={{
    common: {
      color: "primary",
      size: "md",
      variant: "bordered",
      radius: "md",
    },
    fontPicker: {
      color: "primary",
      size: "lg",
      variant: "faded",
    },
  }}
>
  {children}
</HeroHookFormProvider>
```

### Theme Provider Integration

```tsx
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <HeroHookFormProvider
          defaults={{
            common: {
              color: "primary",
              size: "md",
              variant: "bordered",
            },
          }}
        >
          {children}
        </HeroHookFormProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
```

## Responsive Design

The font picker includes responsive design considerations:

```css
/* Mobile optimizations */
@media (max-width: 640px) {
  .fontpicker__popout {
    @apply max-h-48;
  }
  
  .fontpicker__option {
    @apply px-2 py-1.5 text-xs;
  }
}
```

## Accessibility Features

### Focus Management

```css
.fontpicker__option:focus {
  @apply outline-none ring-2 ring-primary/50;
}
```

### High Contrast Support

```css
@media (prefers-contrast: high) {
  .fontpicker {
    @apply border-2;
  }
  
  .fontpicker__option {
    @apply border-b-2;
  }
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .fontpicker,
  .fontpicker__option {
    @apply transition-none;
  }
}
```

## Browser Support

### Webkit Browsers (Chrome, Safari, Edge)

```css
.fontpicker__popout::-webkit-scrollbar {
  @apply w-2;
}

.fontpicker__popout::-webkit-scrollbar-track {
  @apply bg-default-100 rounded-full;
}

.fontpicker__popout::-webkit-scrollbar-thumb {
  @apply bg-default-300 rounded-full;
}
```

### Firefox

```css
.fontpicker__popout {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--heroui-default-300)) hsl(var(--heroui-default-100));
}
```

## Troubleshooting

### Common Styling Issues

1. **Font picker not matching theme?**
   - Ensure HeroUI provider is properly configured
   - Check that CSS is imported correctly
   - Verify theme classes are applied to the root element

2. **Colors not updating?**
   - Check HeroUI's CSS custom properties
   - Verify theme provider is working
   - Ensure no conflicting CSS rules

3. **Responsive issues?**
   - Check mobile breakpoints
   - Verify viewport meta tag
   - Test on actual devices

### Debug Mode

```tsx
// Enable debug mode to see applied classes
{
  name: "font",
  type: "fontPicker",
  fontPickerProps: {
    debug: true,
    showFontPreview: true,
  },
}
```

## Best Practices

### 1. **Use HeroUI's Design Tokens**

```css
/* ✅ Good - Uses HeroUI tokens */
.fontpicker {
  @apply bg-content1 text-foreground border-default-200;
}

/* ❌ Avoid - Hard-coded values */
.fontpicker {
  background: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}
```

### 2. **Leverage Theme System**

```tsx
// ✅ Good - Respects theme system
.light .fontpicker { @apply border-default-200; }
.dark .fontpicker { @apply border-default-700; }

// ❌ Avoid - Theme-specific hard-coding
.fontpicker { border: 1px solid #e5e7eb; }
```

### 3. **Use Semantic Classes**

```css
/* ✅ Good - Semantic naming */
.fontpicker__option:hover { @apply bg-default-100; }
.fontpicker__option.selected { @apply bg-primary text-primary-foreground; }

/* ❌ Avoid - Non-semantic naming */
.option-hover { background: #f3f4f6; }
.option-selected { background: #3b82f6; }
```

## Migration from Custom Styles

### Before (Custom CSS)

```css
.fontpicker {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #000000;
  border-radius: 6px;
}
```

### After (HeroUI Integration)

```css
.fontpicker {
  @apply border-default-200 bg-content1 text-foreground rounded-medium;
}
```

## Summary

The HeroUI-aligned font picker styling provides:

- ✅ **Seamless Integration** with HeroUI's design system
- ✅ **Theme Support** for light, dark, and custom themes
- ✅ **Responsive Design** for all screen sizes
- ✅ **Accessibility Features** for better user experience
- ✅ **Browser Compatibility** across modern browsers
- ✅ **Customization Options** for specific needs

This ensures the font picker feels like a native HeroUI component while providing powerful font selection capabilities.
