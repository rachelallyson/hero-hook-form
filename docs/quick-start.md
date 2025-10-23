# Quick Start Guide

Get up and running with Hero Hook Form in minutes! This guide covers the essentials for building beautiful, type-safe forms.

## 🚀 Installation

### Option A: Individual HeroUI Packages (Recommended for Production)

```bash
npm install @rachelallyson/hero-hook-form react-hook-form \
  @heroui/input @heroui/checkbox @heroui/radio \
  @heroui/select @heroui/switch @heroui/button \
  @heroui/spinner
```

### Option B: Aggregate HeroUI Package (Recommended for Development)

```bash
npm install @rachelallyson/hero-hook-form react-hook-form @heroui/react
```

### For Zod Integration (Recommended)

```bash
npm install zod @hookform/resolvers
```

## 🎯 Basic Usage

### 1. Simple Form with Radio Buttons

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const schema = z.object({
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
});

const config = createZodFormConfig(schema, [
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
  {
    name: "fontSize",
    type: "radio",
    label: "Font Size",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
]);

export default function MyForm() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="Settings"
      showResetButton={true}
    />
  );
}
```

### 2. Nested Fields Example

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const settingsSchema = z.object({
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

const config = createZodFormConfig(settingsSchema, [
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
    inputProps: { placeholder: "Enter font family" },
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

export default function SettingsForm() {
  const handleSubmit = (data) => {
    console.log("Settings saved:", data);
    // Data structure:
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
      title="Application Settings"
      subtitle="Configure your preferences"
      showResetButton={true}
      layout="grid"
      columns={2}
    />
  );
}
```

## Common Patterns

### Radio Button Groups

```tsx
// For multiple radio button groups
const fields = [
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
  {
    name: "fontSize",
    type: "radio",
    label: "Font Size",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
];
```

### Mixed Field Types

```tsx
const fields = [
  // Text input
  {
    name: "name",
    type: "input",
    label: "Name",
    inputProps: { placeholder: "Enter your name" },
  },
  
  // Radio buttons
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
  
  // Checkbox
  {
    name: "notifications",
    type: "checkbox",
    label: "Enable Notifications",
  },
  
  // Textarea
  {
    name: "bio",
    type: "textarea",
    label: "Bio",
    textareaProps: { placeholder: "Tell us about yourself" },
  },
];
```

## Important Notes

### ✅ **Correct Radio Button Configuration**

```tsx
{
  name: "theme",
  type: "radio",
  label: "Theme",
  radioOptions: [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ],
}
```

### ❌ **Wrong Configuration**

```tsx
// Don't use inputProps.options for radio buttons
{
  name: "theme",
  type: "radio",
  inputProps: {
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
}
```

### ✅ **Correct Nested Field Names**

```tsx
// Schema with nested objects
const schema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]),
  }),
});

// Fields with dot notation
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
];
```

## Troubleshooting

### Radio buttons not showing up?

- ✅ Use `radioOptions` instead of `inputProps.options`
- ✅ Make sure `type: "radio"` is set
- ✅ Check that your schema matches the field names

### Default values not working?

- ✅ Use `createZodFormConfig` with the third parameter
- ✅ Provide nested structure for default values
- ✅ Ensure schema has `.default()` values

### TypeScript errors?

- ✅ Use `as const` for field names and types
- ✅ Define proper schema with nested objects
- ✅ Use proper typing for the form data

## Next Steps

1. **Read the detailed guides**:
   - [Radio Buttons Guide](./radio-buttons-guide.md)
   - [Nested Fields Guide](./nested-fields-guide.md)
   - [Fixes Summary](./fixes-summary.md)

2. **Explore examples**:
   - Check the `example-settings-form.tsx` file
   - Look at the `example-nested-fields.tsx` file

3. **Advanced usage**:
   - Custom validation rules
   - Conditional field rendering
   - Form state management
