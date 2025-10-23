# Radio Buttons Guide

This guide explains how to properly configure radio buttons with the `@rachelallyson/hero-hook-form` package, including nested field names and default values.

## Quick Start

```tsx
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { createZodFormConfig } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

// Define your schema
const schema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
  }),
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
});

// Create form configuration
const config = createZodFormConfig(schema, [
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
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
], {
  defaultValues: {
    fonts: { scale: "large" },
    theme: "auto",
  },
});

// Use in your component
<ZodForm config={config} onSubmit={handleSubmit} />
```

## Common Issues and Solutions

### ❌ **Wrong: Using `inputProps.options`**

```tsx
// This will NOT work for radio buttons
{
  name: "theme",
  type: "radio",
  label: "Theme",
  inputProps: {
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
}
```

### ✅ **Correct: Using `radioOptions`**

```tsx
// This is the correct way
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

## Nested Field Names

For nested field names like `"fonts.scale"` or `"layout.sidebarPosition"`, you need to:

1. **Define nested schema structure**
2. **Use dot notation in field names**
3. **Provide nested default values**

### Schema Definition

```tsx
const schema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
    family: z.string().default("Arial"),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]).default("left"),
    contentWidth: z.enum(["narrow", "standard", "wide"]).default("standard"),
  }),
});
```

### Field Configuration

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
];
```

### Default Values

```tsx
const defaultValues = {
  fonts: {
    scale: "large",
    family: "Helvetica",
  },
  layout: {
    sidebarPosition: "right",
    contentWidth: "wide",
  },
};
```

## Complete Example

Here's a complete working example with multiple radio button groups:

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { createZodFormConfig } from "@rachelallyson/hero-hook-form";

const settingsSchema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
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

type SettingsData = z.infer<typeof settingsSchema>;

const config = createZodFormConfig(settingsSchema, [
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
    name: "layout.contentWidth",
    type: "radio",
    label: "Content Width",
    radioOptions: [
      { label: "Narrow", value: "narrow" },
      { label: "Standard", value: "standard" },
      { label: "Wide", value: "wide" },
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
    fonts: { scale: "large" },
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
  const handleSubmit = (data: SettingsData) => {
    console.log("Settings saved:", data);
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="Application Settings"
      showResetButton={true}
      layout="grid"
      columns={2}
    />
  );
}
```

## Field Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ | Field name (supports nested paths like "fonts.scale") |
| `type` | `"radio"` | ✅ | Must be "radio" for radio button fields |
| `label` | `string` | ❌ | Display label for the field |
| `radioOptions` | `Array<{label: string, value: string}>` | ✅ | Array of radio button options |
| `defaultValue` | `string` | ❌ | Default value for this specific field |
| `description` | `string` | ❌ | Help text for the field |
| `isDisabled` | `boolean` | ❌ | Whether the field is disabled |

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

## Migration from Standard Forms

If you're migrating from standard React Hook Form usage:

### Before (Standard Form)

```tsx
<RadioGroupField
  control={control}
  name="theme"
  label="Theme"
  options={[
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ]}
/>
```

### After (ZodForm)

```tsx
const config = createZodFormConfig(schema, [
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
]);
```

This approach provides better type safety, validation, and configuration management.
