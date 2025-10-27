# Quick Start Guide

Get up and running with Hero Hook Form in 5 minutes.

## Installation

```bash
npm install @rachelallyson/hero-hook-form @heroui/react react-hook-form zod
```

## Basic Setup

### 1. Install Dependencies

```bash
# Core dependencies
npm install @rachelallyson/hero-hook-form @heroui/react react-hook-form zod

# Optional: Additional HeroUI components you'll use
npm install @heroui/button @heroui/input @heroui/select @heroui/checkbox
```

### 2. Create Your First Form

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

// Define your form schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  newsletter: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: [
          FormFieldHelpers.input("name", "Full Name"),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
          FormFieldHelpers.textarea("message", "Message", { 
            placeholder: "Tell us what's on your mind..." 
          }),
          FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
        ],
        onSubmit: handleSubmit,
        title: "Contact Us",
        subtitle: "We'd love to hear from you!",
      }}
    />
  );
}
```

### 3. Expected Output

The form will render with:

- ✅ HeroUI-styled input fields
- ✅ Real-time validation
- ✅ Error messages
- ✅ Loading states
- ✅ Success feedback

## Alternative APIs

### Method 1: Helper Functions (Recommended for beginners)

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";

<ZodForm
  config={{
    schema: mySchema,
    fields: [
      FormFieldHelpers.input("name", "Name"),
      FormFieldHelpers.select("country", "Country", {
        options: [
          { label: "United States", value: "US" },
          { label: "Canada", value: "CA" },
        ],
      }),
    ],
    onSubmit: handleSubmit,
  }}
/>
```

### Method 2: Advanced Builder (Most flexible)

```tsx
import { createAdvancedBuilder } from "@rachelallyson/hero-hook-form";

const builder = createAdvancedBuilder<MyFormData>()
  .addInput("name", "Name")
  .addSelect("country", "Country", {
    options: [
      { label: "United States", value: "US" },
      { label: "Canada", value: "CA" },
    ],
  })
  .addCheckbox("newsletter", "Subscribe to newsletter")
  .build();

<ZodForm config={builder} onSubmit={handleSubmit} />
```

### Method 3: Type-Inferred (Automatic schema generation)

```tsx
import { createTypeInferredBuilder } from "@rachelallyson/hero-hook-form";

const builder = createTypeInferredBuilder()
  .addInput("name", "Name")
  .addEmail("email", "Email")
  .addCheckbox("newsletter", "Subscribe")
  .build();

// Schema is automatically generated from field definitions
<ZodForm config={builder} onSubmit={handleSubmit} />
```

## Field Types

### Basic Input Fields

```tsx
// Text input
FormFieldHelpers.input("name", "Name")

// Email input
FormFieldHelpers.input("email", "Email", { type: "email" })

// Password input
FormFieldHelpers.input("password", "Password", { type: "password" })

// Number input
FormFieldHelpers.input("age", "Age", { type: "number" })

// Textarea
FormFieldHelpers.textarea("message", "Message", { rows: 4 })
```

### Selection Fields

```tsx
// Select dropdown
FormFieldHelpers.select("country", "Country", {
  options: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
  ],
})

// Radio group
FormFieldHelpers.radio("gender", "Gender", {
  options: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ],
})

// Checkbox
FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter")

// Switch
FormFieldHelpers.switch("notifications", "Enable notifications")
```

### Special Fields

```tsx
// Date picker
FormFieldHelpers.date("birthDate", "Birth Date")

// File upload
FormFieldHelpers.file("avatar", "Profile Picture", {
  accept: "image/*",
})

// Slider
FormFieldHelpers.slider("rating", "Rating", {
  min: 1,
  max: 5,
  step: 1,
})

// Font picker (requires @rachelallyson/heroui-font-picker)
FormFieldHelpers.fontPicker("font", "Choose Font")
```

## Validation Patterns

### Basic Validation

```tsx
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
  website: z.string().url("Invalid URL").optional(),
});
```

### Cross-Field Validation

```tsx
const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Conditional Validation

```tsx
const schema = z.object({
  hasPhone: z.boolean(),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.hasPhone && !data.phone) {
    return false;
  }
  return true;
}, {
  message: "Phone number is required",
  path: ["phone"],
});
```

## Form Configuration

### Basic Configuration

```tsx
<ZodForm
  config={{
    schema: mySchema,
    fields: myFields,
    onSubmit: handleSubmit,
    title: "Form Title",
    subtitle: "Form description",
    submitButtonText: "Submit",
    showResetButton: true,
    resetButtonText: "Reset",
  }}
/>
```

### Layout Options

```tsx
<ZodForm
  config={{
    // ... other config
    layout: "grid",        // "vertical" | "horizontal" | "grid"
    columns: 2,            // 1 | 2 | 3 (for grid layout)
    spacing: "4",          // "2" | "4" | "6" | "8" | "lg"
  }}
/>
```

### Custom Styling

```tsx
<ZodForm
  config={{
    // ... other config
    className: "my-custom-form",
    submitButtonProps: {
      color: "primary",
      size: "lg",
    },
  }}
/>
```

## Error Handling

### Form-Level Errors

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await submitToAPI(data);
    // Success handled automatically
  } catch (error) {
    // Error displayed in form
    console.error("Submission failed:", error);
  }
};
```

### Field-Level Errors

```tsx
// Errors are automatically displayed based on Zod schema validation
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

### Server Errors

```tsx
import { applyServerErrors } from "@rachelallyson/hero-hook-form";

const handleSubmit = async (data: FormData) => {
  try {
    await submitToAPI(data);
  } catch (error) {
    if (error.status === 422) {
      // Apply server validation errors to form fields
      applyServerErrors(form, error.errors);
    }
  }
};
```

## Next Steps

- **Dynamic Forms**: Learn about [conditional fields and field arrays](./dynamic-forms.md)
- **Advanced Patterns**: Explore [error handling strategies](./error-handling.md)
- **Examples**: Check out [copy-paste recipes](../recipes/examples.md)
- **API Reference**: Browse the [complete API documentation](../reference/api/README.md)

## Common Issues

### TypeScript Errors

```tsx
// ❌ Wrong: Field name not in form data type
FormFieldHelpers.input("invalidField", "Label")

// ✅ Correct: Field name matches form data
FormFieldHelpers.input("name", "Name")
```

### Missing Dependencies

```bash
# Make sure all peer dependencies are installed
npm install @heroui/react react-hook-form zod
```

### Styling Issues

```tsx
// Make sure HeroUI is properly configured in your app
import { HeroUIProvider } from "@heroui/react";
import { ConfigProvider } from "@rachelallyson/hero-hook-form";

function App() {
  return (
    <HeroUIProvider>
      <ConfigProvider>
        <MyForm />
      </ConfigProvider>
    </HeroUIProvider>
  );
}
```
