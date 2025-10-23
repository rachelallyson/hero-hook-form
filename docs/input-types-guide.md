# Input Types Guide

This guide documents all the input types supported by the `@rachelallyson/hero-hook-form` package.

## Overview

The package supports all standard HTML input types through the `inputProps.type` property. Here's a complete reference of supported input types and their usage.

## Supported Input Types

### Text Inputs

#### `type="text"` (Default)

```tsx
{
  name: "firstName",
  type: "input",
  label: "First Name",
  inputProps: {
    type: "text",
    placeholder: "Enter your first name",
  },
}
```

#### `type="email"`

```tsx
{
  name: "email",
  type: "input", 
  label: "Email Address",
  inputProps: {
    type: "email",
    placeholder: "user@example.com",
  },
}
```

#### `type="password"`

```tsx
{
  name: "password",
  type: "input",
  label: "Password", 
  inputProps: {
    type: "password",
    placeholder: "Enter your password",
  },
}
```

#### `type="tel"`

```tsx
{
  name: "phone",
  type: "input",
  label: "Phone Number",
  inputProps: {
    type: "tel",
    placeholder: "+1 (555) 123-4567",
  },
}
```

#### `type="url"`

```tsx
{
  name: "website",
  type: "input",
  label: "Website",
  inputProps: {
    type: "url",
    placeholder: "https://example.com",
  },
}
```

### Numeric Inputs

#### `type="number"`

```tsx
{
  name: "age",
  type: "input",
  label: "Age",
  inputProps: {
    type: "number",
    min: 0,
    max: 120,
    step: 1,
  },
}
```

#### `type="range"`

```tsx
{
  name: "volume",
  type: "input",
  label: "Volume",
  inputProps: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
  },
}
```

### Date and Time Inputs

#### `type="date"`

```tsx
{
  name: "birthDate",
  type: "input",
  label: "Birth Date",
  inputProps: {
    type: "date",
  },
}
```

#### `type="time"`

```tsx
{
  name: "appointmentTime",
  type: "input",
  label: "Appointment Time",
  inputProps: {
    type: "time",
  },
}
```

#### `type="datetime-local"`

```tsx
{
  name: "eventDateTime",
  type: "input",
  label: "Event Date & Time",
  inputProps: {
    type: "datetime-local",
  },
}
```

#### `type="month"`

```tsx
{
  name: "graduationMonth",
  type: "input",
  label: "Graduation Month",
  inputProps: {
    type: "month",
  },
}
```

#### `type="week"`

```tsx
{
  name: "projectWeek",
  type: "input",
  label: "Project Week",
  inputProps: {
    type: "week",
  },
}
```

### File Inputs

#### `type="file"`

```tsx
{
  name: "avatar",
  type: "input",
  label: "Profile Picture",
  inputProps: {
    type: "file",
    accept: "image/*",
  },
}
```

### Color Inputs

#### `type="color"`

```tsx
{
  name: "themeColor",
  type: "input",
  label: "Theme Color",
  inputProps: {
    type: "color",
  },
}
```

### Hidden Inputs

#### `type="hidden"`

```tsx
{
  name: "userId",
  type: "input",
  inputProps: {
    type: "hidden",
  },
}
```

## Complete Example

Here's a comprehensive form using various input types:

```tsx
import React from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const userProfileSchema = z.object({
  // Text inputs
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional(),
  
  // Numeric inputs
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  volume: z.number().min(0).max(100),
  
  // Date inputs
  birthDate: z.string().optional(),
  appointmentTime: z.string().optional(),
  eventDateTime: z.string().optional(),
  graduationMonth: z.string().optional(),
  projectWeek: z.string().optional(),
  
  // File input
  avatar: z.string().optional(),
  
  // Color input
  themeColor: z.string().default("#3b82f6"),
  
  // Hidden input
  userId: z.string(),
});

const config = createZodFormConfig(userProfileSchema, [
  // Text inputs
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    inputProps: {
      type: "text",
      placeholder: "Enter your first name",
    },
  },
  {
    name: "lastName", 
    type: "input",
    label: "Last Name",
    inputProps: {
      type: "text",
      placeholder: "Enter your last name",
    },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: {
      type: "email",
      placeholder: "user@example.com",
    },
  },
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: {
      type: "password",
      placeholder: "Enter your password",
    },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: {
      type: "tel",
      placeholder: "+1 (555) 123-4567",
    },
  },
  {
    name: "website",
    type: "input",
    label: "Website",
    inputProps: {
      type: "url",
      placeholder: "https://example.com",
    },
  },
  
  // Numeric inputs
  {
    name: "age",
    type: "input",
    label: "Age",
    inputProps: {
      type: "number",
      min: 13,
      max: 120,
      step: 1,
    },
  },
  {
    name: "volume",
    type: "input",
    label: "Volume",
    inputProps: {
      type: "range",
      min: 0,
      max: 100,
      step: 1,
    },
  },
  
  // Date and time inputs
  {
    name: "birthDate",
    type: "input",
    label: "Birth Date",
    inputProps: {
      type: "date",
    },
  },
  {
    name: "appointmentTime",
    type: "input",
    label: "Appointment Time",
    inputProps: {
      type: "time",
    },
  },
  {
    name: "eventDateTime",
    type: "input",
    label: "Event Date & Time",
    inputProps: {
      type: "datetime-local",
    },
  },
  {
    name: "graduationMonth",
    type: "input",
    label: "Graduation Month",
    inputProps: {
      type: "month",
    },
  },
  {
    name: "projectWeek",
    type: "input",
    label: "Project Week",
    inputProps: {
      type: "week",
    },
  },
  
  // File input
  {
    name: "avatar",
    type: "input",
    label: "Profile Picture",
    inputProps: {
      type: "file",
      accept: "image/*",
    },
  },
  
  // Color input
  {
    name: "themeColor",
    type: "input",
    label: "Theme Color",
    inputProps: {
      type: "color",
    },
  },
  
  // Hidden input
  {
    name: "userId",
    type: "input",
    inputProps: {
      type: "hidden",
    },
  },
], {
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    age: 18,
    volume: 50,
    birthDate: "",
    appointmentTime: "",
    eventDateTime: "",
    graduationMonth: "",
    projectWeek: "",
    avatar: "",
    themeColor: "#3b82f6",
    userId: "user-123",
  },
});

export default function UserProfileForm() {
  const handleSubmit = (data) => {
    console.log("User profile:", data);
  };

  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      title="User Profile"
      subtitle="Complete your profile information"
      showResetButton={true}
      layout="grid"
      columns={2}
    />
  );
}
```

## Input Type Properties

### Common Properties

All input types support these common properties:

```tsx
inputProps: {
  type: "text",           // Input type
  placeholder: "Text",     // Placeholder text
  disabled: false,        // Disable the input
  readOnly: false,        // Make input read-only
  required: true,         // Mark as required
  autoComplete: "on",     // Browser autocomplete
  autoFocus: false,       // Auto-focus on mount
  className: "custom",    // Custom CSS class
  id: "unique-id",        // Unique identifier
}
```

### Type-Specific Properties

#### Number Inputs

```tsx
inputProps: {
  type: "number",
  min: 0,                 // Minimum value
  max: 100,               // Maximum value
  step: 1,                // Step increment
}
```

#### Range Inputs

```tsx
inputProps: {
  type: "range",
  min: 0,                 // Minimum value
  max: 100,               // Maximum value
  step: 1,                // Step increment
}
```

#### File Inputs

```tsx
inputProps: {
  type: "file",
  accept: "image/*",       // Accepted file types
  multiple: false,         // Allow multiple files
}
```

#### Date Inputs

```tsx
inputProps: {
  type: "date",
  min: "2024-01-01",      // Minimum date
  max: "2024-12-31",      // Maximum date
}
```

## Validation Examples

### Email Validation

```tsx
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const field = {
  name: "email",
  type: "input",
  label: "Email",
  inputProps: { type: "email" },
  rules: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email format",
    },
  },
};
```

### Number Validation

```tsx
const schema = z.object({
  age: z.number().min(13, "Must be at least 13").max(120, "Must be under 120"),
});

const field = {
  name: "age",
  type: "input",
  label: "Age",
  inputProps: { 
    type: "number",
    min: 13,
    max: 120,
  },
};
```

### URL Validation

```tsx
const schema = z.object({
  website: z.string().url("Please enter a valid URL").optional(),
});

const field = {
  name: "website",
  type: "input",
  label: "Website",
  inputProps: { type: "url" },
};
```

## Browser Support

All input types are supported in modern browsers:

- ✅ **Chrome/Edge**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Safari**: Full support
- ✅ **Mobile browsers**: Full support

## Best Practices

### 1. **Use Appropriate Types**

```tsx
// ✅ Good: Use specific types
inputProps: { type: "email" }
inputProps: { type: "tel" }
inputProps: { type: "url" }

// ❌ Avoid: Using generic text for specific data
inputProps: { type: "text" } // for email
```

### 2. **Provide Helpful Placeholders**

```tsx
inputProps: {
  type: "email",
  placeholder: "user@example.com",
}
```

### 3. **Set Appropriate Constraints**

```tsx
inputProps: {
  type: "number",
  min: 0,
  max: 100,
  step: 1,
}
```

### 4. **Use Validation Rules**

```tsx
rules: {
  required: "This field is required",
  min: { value: 0, message: "Must be positive" },
  max: { value: 100, message: "Must be under 100" },
}
```

## Troubleshooting

### Common Issues

1. **Number inputs not working?**
   - Make sure to use `type: "number"` in `inputProps`
   - Check that your schema expects a number type

2. **Date inputs not showing?**
   - Ensure you're using `type: "date"` in `inputProps`
   - Check browser support for date inputs

3. **File uploads not working?**
   - Use `type: "file"` in `inputProps`
   - Set appropriate `accept` attribute

4. **Color picker not showing?**
   - Use `type: "color"` in `inputProps`
   - Provide a default color value

### Browser Compatibility

Some input types may not be supported in older browsers:

- **Date/Time inputs**: Use polyfills for IE11
- **Color inputs**: Fallback to text input
- **Range inputs**: Use JavaScript fallbacks

## Summary

The `@rachelallyson/hero-hook-form` package supports all standard HTML input types through the `inputProps.type` property. This provides:

- ✅ **Full HTML5 input support**
- ✅ **Type safety with TypeScript**
- ✅ **Validation integration**
- ✅ **Consistent styling with HeroUI**
- ✅ **Accessibility features**

Choose the appropriate input type for your data to provide the best user experience and validation.
