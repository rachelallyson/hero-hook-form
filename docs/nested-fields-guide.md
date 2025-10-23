# Nested Fields Guide

This guide explains how to work with nested field names like `"fonts.scale"` and `"layout.sidebarPosition"` in the `@rachelallyson/hero-hook-form` package.

## Overview

Nested field names allow you to organize form data into logical groups while maintaining type safety and proper validation.

## Schema Definition

### ✅ **Correct: Nested Object Structure**

```tsx
import { z } from "zod";

const settingsSchema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
    family: z.string().default("Arial"),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]).default("left"),
    contentWidth: z.enum(["narrow", "standard", "wide"]).default("standard"),
    spacing: z.enum(["tight", "comfortable", "spacious"]).default("comfortable"),
  }),
  style: z.object({
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
    borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  }),
});
```

### ❌ **Wrong: Flat Structure**

```tsx
// This won't work with nested field names
const wrongSchema = z.object({
  "fonts.scale": z.enum(["small", "medium", "large"]),
  "layout.sidebarPosition": z.enum(["left", "right", "hidden"]),
});
```

## Field Configuration

### Using Dot Notation

```tsx
const fields = [
  {
    name: "fonts.scale",
    type: "radio",
    label: "Font Scale",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    name: "layout.sidebarPosition",
    type: "radio",
    label: "Sidebar Position",
    radioOptions: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    name: "style.theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
];
```

## Default Values

### Nested Structure

```tsx
const defaultValues = {
  fonts: {
    scale: "large",
    family: "Helvetica",
  },
  layout: {
    sidebarPosition: "right",
    contentWidth: "wide",
    spacing: "comfortable",
  },
  style: {
    theme: "auto",
    borderRadius: "medium",
  },
};
```

### Complete Configuration

```tsx
import { createZodFormConfig } from "@rachelallyson/hero-hook-form";

const config = createZodFormConfig(
  settingsSchema,
  fields,
  defaultValues // This is the third parameter
);
```

## Complete Example

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { createZodFormConfig } from "@rachelallyson/hero-hook-form";

const userPreferencesSchema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
    family: z.string().default("Arial"),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]).default("left"),
    contentWidth: z.enum(["narrow", "standard", "wide"]).default("standard"),
  }),
  style: z.object({
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
    borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  }),
});

type UserPreferences = z.infer<typeof userPreferencesSchema>;

const config = createZodFormConfig(userPreferencesSchema, [
  // Font settings
  {
    name: "fonts.scale",
    type: "radio",
    label: "Font Scale",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    name: "fonts.family",
    type: "input",
    label: "Font Family",
    inputProps: { placeholder: "Enter font family name" },
  },
  
  // Layout settings
  {
    name: "layout.sidebarPosition",
    type: "radio",
    label: "Sidebar Position",
    radioOptions: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
      { label: "Hidden", value: "hidden" },
    ],
  },
  {
    name: "layout.contentWidth",
    type: "radio",
    label: "Content Width",
    radioOptions: [
      { label: "Narrow", value: "narrow" },
      { label: "Standard", value: "standard" },
      { label: "Wide", value: "wide" },
    ],
  },
  
  // Style settings
  {
    name: "style.theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
  {
    name: "style.borderRadius",
    type: "radio",
    label: "Border Radius",
    radioOptions: [
      { label: "None", value: "none" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
], {
  defaultValues: {
    fonts: {
      scale: "large",
      family: "Helvetica",
    },
    layout: {
      sidebarPosition: "right",
      contentWidth: "wide",
    },
    style: {
      theme: "auto",
      borderRadius: "medium",
    },
  },
});

export default function UserPreferencesForm() {
  const handleSubmit = (data: UserPreferences) => {
    console.log("User preferences saved:", data);
    // The data will have the nested structure:
    // {
    //   fonts: { scale: "large", family: "Helvetica" },
    //   layout: { sidebarPosition: "right", contentWidth: "wide" },
    //   style: { theme: "auto", borderRadius: "medium" }
    // }
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="User Preferences"
      subtitle="Customize your application settings"
      showResetButton={true}
      layout="grid"
      columns={2}
    />
  );
}
```

## Data Structure

When the form is submitted, you'll receive data in the nested structure:

```tsx
// Form submission data structure
{
  fonts: {
    scale: "large",
    family: "Helvetica",
  },
  layout: {
    sidebarPosition: "right",
    contentWidth: "wide",
  },
  style: {
    theme: "auto",
    borderRadius: "medium",
  },
}
```

## Best Practices

### 1. **Consistent Naming**

```tsx
// Good: Consistent grouping
const schema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]),
    family: z.string(),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]),
    contentWidth: z.enum(["narrow", "standard", "wide"]),
  }),
});
```

### 2. **Default Values**

```tsx
// Provide sensible defaults
const defaultValues = {
  fonts: { scale: "medium", family: "Arial" },
  layout: { sidebarPosition: "left", contentWidth: "standard" },
  style: { theme: "auto", borderRadius: "medium" },
};
```

### 3. **Type Safety**

```tsx
// Use proper TypeScript typing
type UserPreferences = z.infer<typeof userPreferencesSchema>;

const handleSubmit = (data: UserPreferences) => {
  // data.fonts.scale is properly typed
  // data.layout.sidebarPosition is properly typed
};
```

## Troubleshooting

### Common Issues

1. **Schema mismatch**: Ensure your schema has nested objects that match your field names
2. **Default values**: Make sure default values have the same nested structure as your schema
3. **Type errors**: Use `as const` for field names and types

### Debugging Tips

```tsx
// Add logging to see the actual data structure
const handleSubmit = (data: UserPreferences) => {
  console.log("Form data:", JSON.stringify(data, null, 2));
};
```

## Migration from Flat Structure

If you're migrating from a flat structure:

### Before (Flat)

```tsx
const flatSchema = z.object({
  fontScale: z.enum(["small", "medium", "large"]),
  sidebarPosition: z.enum(["left", "right", "hidden"]),
  theme: z.enum(["light", "dark", "auto"]),
});
```

### After (Nested)

```tsx
const nestedSchema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]),
  }),
  style: z.object({
    theme: z.enum(["light", "dark", "auto"]),
  }),
});
```

This approach provides better organization, type safety, and maintainability.
