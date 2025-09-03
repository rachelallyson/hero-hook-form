# Zod Integration

Leverage Zod schemas for type-safe form validation with Hero Hook Form.

## Overview

Hero Hook Form provides optional Zod integration for schema-based validation. This approach offers several advantages over traditional React Hook Form validation:

- **Type Safety**: Automatic TypeScript type inference from schemas
- **Runtime Validation**: Comprehensive validation with custom error messages
- **Schema Reusability**: Define schemas once and reuse across your app
- **Complex Validation**: Support for enums, numbers, custom refinements, and more
- **Optional Integration**: Only install Zod if you need it

## Installation

To use Zod integration, install the additional dependencies:

```bash
npm install zod @hookform/resolvers
```

## Basic Usage

### Simple Zod Form

```tsx
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

// Define your schema
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

// Create form configuration
const config = createZodFormConfig(contactSchema, [
  { name: "firstName", type: "input", label: "First Name" },
  { name: "email", type: "input", label: "Email", inputProps: { type: "email" } },
  { name: "message", type: "textarea", label: "Message" },
  { name: "terms", type: "checkbox", label: "I agree to the terms" },
]);

// Use in your component
<ZodForm
  config={config}
  onSubmit={handleSubmit}
  title="Contact Form"
  showResetButton={true}
/>
```

## Schema Definition

### Basic Schema Types

```tsx
const basicSchema = z.object({
  // String validation
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  
  // Number validation
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age"),
  
  // Boolean validation
  agree: z.boolean().refine((val) => val === true, "You must agree"),
  
  // Optional fields
  phone: z.string().optional(),
  
  // Default values
  newsletter: z.boolean().default(false),
});
```

### Complex Validation

```tsx
const complexSchema = z.object({
  // Enum validation
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.enum(["en", "es", "fr"]).default("en"),
  
  // Custom refinements
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), "Must contain uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must contain lowercase letter")
    .refine((val) => /\d/.test(val), "Must contain a number"),
  
  // Conditional validation
  companyName: z.string().optional()
    .refine((val, ctx) => {
      if (ctx.parent.hasCompany && !val) {
        return false;
      }
      return true;
    }, "Company name is required when you have a company"),
  
  // Array validation
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});
```

## Field Configuration

### Zod Form Field Configuration

When using Zod integration, you don't need to specify validation rules in the field configuration since they're handled by the schema:

```tsx
type ZodFormFieldConfig<TFieldValues extends FieldValues> =
  | Omit<StringFieldConfig<TFieldValues>, "rules">
  | Omit<BooleanFieldConfig<TFieldValues>, "rules">
  | Omit<RadioFieldConfig<TFieldValues>, "rules">
  | Omit<OtherFieldConfig<TFieldValues>, "rules">;
```

### Field Examples

```tsx
const fields = [
  // Input field
  {
    name: "firstName" as const,
    type: "input" as const,
    label: "First Name",
  },
  
  // Email input
  {
    name: "email" as const,
    type: "input" as const,
    label: "Email",
    inputProps: { type: "email" },
  },
  
  // Textarea
  {
    name: "message" as const,
    type: "textarea" as const,
    label: "Message",
    textareaProps: { placeholder: "Tell us about your project..." },
  },
  
  // Select dropdown
  {
    name: "country" as const,
    type: "select" as const,
    label: "Country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
    ],
  },
  
  // Radio group
  {
    name: "theme" as const,
    type: "radio" as const,
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
  },
  
  // Checkbox
  {
    name: "newsletter" as const,
    type: "checkbox" as const,
    label: "Subscribe to newsletter",
  },
  
  // Switch
  {
    name: "notifications" as const,
    type: "switch" as const,
    label: "Enable notifications",
  },
];
```

## ZodForm Component

### Props

```tsx
interface ZodFormProps<T extends FieldValues> {
  config: ZodFormConfig<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (error: FormValidationError) => void;
  onSuccess?: (data: T) => void;
  
  // Layout props
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3;
  spacing?: "sm" | "md" | "lg" | "xl";
  
  // UI props
  title?: string;
  subtitle?: string;
  className?: string;
  
  // Button props
  showResetButton?: boolean;
  resetButtonText?: string;
  submitButtonText?: string;
  submitButtonProps?: Partial<ComponentProps<typeof Button>>;
}
```

### Complete Example

```tsx
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

// Schema definition
const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  country: z.string().min(1, "Please select a country"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

// Field configuration
const userFields = [
  {
    name: "firstName" as const,
    type: "input" as const,
    label: "First Name",
  },
  {
    name: "lastName" as const,
    type: "input" as const,
    label: "Last Name",
  },
  {
    name: "email" as const,
    type: "input" as const,
    label: "Email",
    inputProps: { type: "email" },
  },
  {
    name: "phone" as const,
    type: "input" as const,
    label: "Phone",
    inputProps: { type: "tel" },
  },
  {
    name: "message" as const,
    type: "textarea" as const,
    label: "Message",
    textareaProps: { placeholder: "Tell us about your project..." },
  },
  {
    name: "country" as const,
    type: "select" as const,
    label: "Country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
    ],
  },
  {
    name: "theme" as const,
    type: "radio" as const,
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
  },
  {
    name: "newsletter" as const,
    type: "checkbox" as const,
    label: "Subscribe to newsletter",
  },
  {
    name: "terms" as const,
    type: "checkbox" as const,
    label: "I agree to the terms and conditions",
  },
];

// Component
export function UserForm() {
  const handleSubmit = async (data: z.infer<typeof userSchema>) => {
    console.log("Form submitted:", data);
    // Send to API
  };

  const handleError = (error: { message: string; field?: string }) => {
    console.error("Form error:", error);
  };

  const handleSuccess = (data: z.infer<typeof userSchema>) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <ZodForm
      config={createZodFormConfig(userSchema, userFields)}
      onSubmit={handleSubmit}
      onError={handleError}
      onSuccess={handleSuccess}
      title="User Registration"
      subtitle="Create your account"
      layout="grid"
      columns={2}
      spacing="lg"
      showResetButton={true}
      resetButtonText="Reset Form"
      submitButtonText="Create Account"
      submitButtonProps={{
        color: "primary",
        size: "lg",
      }}
    />
  );
}
```

## Advanced Features

### Conditional Validation

```tsx
const conditionalSchema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional(),
  companyEmail: z.string().email().optional(),
}).refine((data) => {
  if (data.hasCompany) {
    return data.companyName && data.companyEmail;
  }
  return true;
}, {
  message: "Company name and email are required when you have a company",
  path: ["companyName"], // Show error on companyName field
});
```

### Custom Error Messages

```tsx
const customErrorSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});
```

### Schema Composition

```tsx
// Base user schema
const baseUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

// Registration schema (extends base)
const registrationSchema = baseUserSchema.extend({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile update schema (extends base)
const profileSchema = baseUserSchema.extend({
  bio: z.string().optional(),
  phone: z.string().optional(),
});
```

## Utility Functions

### createZodFormConfig

Helper function to create Zod form configurations:

```tsx
function createZodFormConfig<TFieldValues extends FieldValues>(
  schema: ZodSchemaType,
  fields: ZodFormFieldConfig<TFieldValues>[],
  defaultValues?: Partial<TFieldValues>
): ZodFormConfig<TFieldValues>
```

### isZodAvailable

Check if Zod is available in the current environment:

```tsx
import { isZodAvailable } from "@rachelallyson/hero-hook-form";

if (isZodAvailable()) {
  // Use ZodForm
} else {
  // Fall back to ConfigurableForm
}
```

## Migration from Standard Forms

### Before (Standard Form)

```tsx
const fields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email",
    inputProps: { type: "email" },
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
];

<ConfigurableForm fields={fields} onSubmit={handleSubmit} />
```

### After (Zod Form)

```tsx
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
});

const fields = [
  {
    name: "firstName" as const,
    type: "input" as const,
    label: "First Name",
  },
  {
    name: "email" as const,
    type: "input" as const,
    label: "Email",
    inputProps: { type: "email" },
  },
];

<ZodForm config={createZodFormConfig(schema, fields)} onSubmit={handleSubmit} />
```

## Best Practices

### 1. Use Descriptive Schema Names

```tsx
// ✅ Good
const userRegistrationSchema = z.object({...});
const contactFormSchema = z.object({...});

// ❌ Avoid
const schema = z.object({...});
const formSchema = z.object({...});
```

### 2. Leverage Schema Composition

```tsx
// Base schemas for reusability
const baseUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

// Extend for specific use cases
const registrationSchema = baseUserSchema.extend({
  password: z.string().min(8),
});

const profileSchema = baseUserSchema.extend({
  bio: z.string().optional(),
});
```

### 3. Use Meaningful Error Messages

```tsx
const schema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters for security")
    .regex(/[A-Z]/, "Password must contain an uppercase letter for security")
    .regex(/[a-z]/, "Password must contain a lowercase letter for security")
    .regex(/\d/, "Password must contain a number for security"),
});
```

### 4. Handle Optional Fields Properly

```tsx
const schema = z.object({
  required: z.string().min(1, "This field is required"),
  optional: z.string().optional(), // No validation when undefined
  conditional: z.string().optional()
    .refine((val, ctx) => {
      if (ctx.parent.hasCondition && !val) {
        return false;
      }
      return true;
    }, "This field is required when condition is met"),
});
```

## Type Definitions

### ZodFormConfig

```tsx
interface ZodFormConfig<TFieldValues extends FieldValues> {
  schema: ZodSchemaType; // Will be z.ZodSchema when zod is available
  fields: ZodFormFieldConfig<TFieldValues>[];
  defaultValues?: Partial<TFieldValues>;
}
```

### ZodFormFieldConfig

```tsx
type ZodFormFieldConfig<TFieldValues extends FieldValues> =
  | Omit<StringFieldConfig<TFieldValues>, "rules">
  | Omit<BooleanFieldConfig<TFieldValues>, "rules">
  | Omit<RadioFieldConfig<TFieldValues>, "rules">
  | Omit<OtherFieldConfig<TFieldValues>, "rules">;
```

### ZodSchemaType

```tsx
type ZodSchemaType = typeof import("zod") extends { ZodSchema: infer T } ? T : any;
```

This conditional type resolves to `z.ZodSchema` when Zod is available, otherwise falls back to `any`.

## Comparison: Zod vs Standard Validation

| Feature | Standard Form | Zod Form |
|---------|---------------|----------|
| Validation Rules | In field config | In schema |
| Type Safety | Manual types | Automatic inference |
| Error Messages | Inline | In schema |
| Reusability | Per field | Schema-wide |
| Runtime Safety | Basic | Comprehensive |
| Schema Composition | Limited | Full support |
| Conditional Validation | Complex | Built-in |
| Default Values | Field-level | Schema-level |

## Examples

For complete working examples, see:

- [Zod Demo](../example/app/zod-demo/page.tsx) - Live Zod integration demo
- [Getting Started](./getting-started.md) - Basic usage examples
- [Form Builder](./form-builder.md) - ConfigurableForm examples

## Next Steps

- [Getting Started](./getting-started.md) - Installation and setup
- [Components](./components.md) - Field component documentation
- [Validation](./validation.md) - Standard validation patterns
- [Form Builder](./form-builder.md) - ConfigurableForm guide
