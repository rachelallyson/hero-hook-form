# Form Builder

Master the ConfigurableForm component for rapid form development.

## Overview

The `ConfigurableForm` component is a high-level form builder that allows you to create complex forms by simply defining field configurations. It eliminates the need to manually wire up each field component while providing full flexibility and customization.

## Basic Usage

### Simple Form

```tsx
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const fields = [
  {
    name: "name",
    type: "input",
    label: "Full Name",
    rules: { required: "Name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rules: { required: "Message is required" },
  },
];

export function ContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <ConfigurableForm
      title="Contact Us"
      subtitle="We'd love to hear from you"
      fields={fields}
      onSubmit={handleSubmit}
      layout="vertical"
      showResetButton={true}
    />
  );
}
```

## Field Configuration

### Field Types

The `ConfigurableForm` supports all field types available in Hero Hook Form:

```tsx
type FieldType = "input" | "textarea" | "select" | "checkbox" | "radio" | "switch" | "slider" | "date" | "file";
```

### Field Configuration Interface

The field configuration uses a discriminated union type for type safety:

```tsx
type FormFieldConfig<TFieldValues extends FieldValues> =
  | StringFieldConfig<TFieldValues>     // "input" | "textarea" | "select"
  | BooleanFieldConfig<TFieldValues>    // "checkbox" | "switch"
  | RadioFieldConfig<TFieldValues>      // "radio"
  | OtherFieldConfig<TFieldValues>;     // "slider" | "date" | "file"

interface BaseFormFieldConfig<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  condition?: (values: Partial<TFieldValues>) => boolean;
  group?: string;
}
```

### Input Fields

```tsx
const inputFields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    description: "Enter your first name",
    inputProps: {
      placeholder: "John",
      startContent: <UserIcon />,
      variant: "bordered",
    },
    rules: { required: "First name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    description: "We'll never share your email",
    inputProps: {
      type: "email",
      placeholder: "john@example.com",
      startContent: <MailIcon />,
    },
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: {
      type: "tel",
      placeholder: "+1 (555) 123-4567",
      startContent: <PhoneIcon />,
    },
  },
];
```

### Textarea Fields

```tsx
const textareaFields = [
  {
    name: "bio",
    type: "textarea",
    label: "Biography",
    description: "Tell us about yourself",
    textareaProps: {
      placeholder: "Share your story...",
      minRows: 3,
      maxRows: 6,
      variant: "bordered",
    },
    rules: { required: "Biography is required" },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    textareaProps: {
      placeholder: "Your message here...",
      minRows: 4,
      maxRows: 8,
    },
    rules: { required: "Message is required" },
  },
];
```

### Select Fields

```tsx
const selectFields = [
  {
    name: "country",
    type: "select",
    label: "Country",
    description: "Select your country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Australia", value: "au" },
    ],
    selectProps: {
      placeholder: "Choose your country",
      variant: "bordered",
    },
    rules: { required: "Country is required" },
  },
  {
    name: "plan",
    type: "select",
    label: "Subscription Plan",
    options: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Team", value: "team" },
      { label: "Enterprise", value: "enterprise" },
    ],
    defaultValue: "free",
  },
];
```

### Radio Group Fields

```tsx
const radioFields = [
  {
    name: "theme",
    type: "radio",
    label: "Theme Preference",
    description: "Choose your preferred theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
    defaultValue: "system",
  },
  {
    name: "priority",
    type: "radio",
    label: "Priority Level",
    radioOptions: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
      { label: "Urgent", value: "urgent" },
    ],
    rules: { required: "Priority is required" },
  },
];
```

### Checkbox Fields

```tsx
const checkboxFields = [
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to Newsletter",
    description: "Receive updates about new features",
    defaultValue: false,
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms of Service",
    description: "You must agree to continue",
    checkboxProps: {
      color: "primary",
    },
    rules: {
      required: "You must agree to the terms",
      validate: (value) => value === true || "You must agree to the terms",
    },
  },
];
```

### Switch Fields

```tsx
const switchFields = [
  {
    name: "notifications",
    type: "switch",
    label: "Enable Notifications",
    description: "Receive push notifications",
    defaultValue: true,
  },
  {
    name: "autoSave",
    type: "switch",
    label: "Auto-save Changes",
    description: "Automatically save your work",
    defaultValue: false,
  },
];
```

### Slider Fields

```tsx
const sliderFields = [
  {
    name: "volume",
    type: "slider",
    label: "Volume Level",
    description: "Adjust the volume",
    sliderProps: {
      minValue: 0,
      maxValue: 100,
      step: 1,
      color: "primary",
    },
    defaultValue: 50,
  },
  {
    name: "brightness",
    type: "slider",
    label: "Brightness",
    sliderProps: {
      minValue: 0,
      maxValue: 100,
      step: 5,
      color: "secondary",
    },
    defaultValue: 75,
  },
];
```

### Date Fields

```tsx
const dateFields = [
  {
    name: "birthDate",
    type: "date",
    label: "Date of Birth",
    description: "Select your birth date",
    dateProps: {
      placeholder: "Select a date",
      variant: "bordered",
    },
    rules: { required: "Date of birth is required" },
  },
  {
    name: "appointmentDate",
    type: "date",
    label: "Appointment Date",
    dateProps: {
      placeholder: "Choose appointment date",
      minValue: new Date(),
    },
  },
];
```

### File Fields

```tsx
const fileFields = [
  {
    name: "avatar",
    type: "file",
    label: "Profile Picture",
    description: "Upload your profile picture",
    fileProps: {
      accept: "image/*",
      multiple: false,
      variant: "bordered",
    },
    rules: { required: "Profile picture is required" },
  },
  {
    name: "documents",
    type: "file",
    label: "Documents",
    description: "Upload supporting documents",
    fileProps: {
      accept: ".pdf,.doc,.docx",
      multiple: true,
      variant: "flat",
    },
  },
];
```

## Form Layouts

### Vertical Layout (Default)

```tsx
<ConfigurableForm
  title="Contact Form"
  fields={fields}
  onSubmit={handleSubmit}
  layout="vertical"
  spacing="md"
/>
```

### Horizontal Layout

```tsx
<ConfigurableForm
  title="Registration Form"
  fields={fields}
  onSubmit={handleSubmit}
  layout="horizontal"
  spacing="md"
/>
```

### Grid Layout

```tsx
<ConfigurableForm
  title="User Profile"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  spacing="md"
/>
```

### Three-Column Grid

```tsx
<ConfigurableForm
  title="Advanced Settings"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={3}
  spacing="lg"
/>
```

## Form Configuration

### Complete Form Example

```tsx
interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
  plan: string;
  theme: string;
  newsletter: boolean;
  notifications: boolean;
  terms: boolean;
}

const userProfileFields: FormFieldConfig<UserProfileData>[] = [
  // Personal Information
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "lastName",
    type: "input",
    label: "Last Name",
    rules: { required: "Last name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: { type: "tel" },
  },
  {
    name: "bio",
    type: "textarea",
    label: "Biography",
    description: "Tell us about yourself",
    textareaProps: {
      placeholder: "Share your story...",
      minRows: 3,
      maxRows: 6,
    },
  },
  
  // Preferences
  {
    name: "country",
    type: "select",
    label: "Country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
    ],
    rules: { required: "Country is required" },
  },
  {
    name: "plan",
    type: "select",
    label: "Subscription Plan",
    options: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Team", value: "team" },
    ],
    defaultValue: "free",
  },
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
    defaultValue: "system",
  },
  
  // Settings
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to Newsletter",
    description: "Receive updates about new features",
  },
  {
    name: "notifications",
    type: "switch",
    label: "Enable Notifications",
    description: "Receive push notifications",
    defaultValue: true,
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms of Service",
    rules: { required: "You must agree to the terms" },
  },
];

export function UserProfileForm() {
  const handleSubmit = async (data: UserProfileData) => {
    console.log("Profile updated:", data);
    // Send to API
  };

  const handleError = (error: { message: string; field?: string }) => {
    console.error("Form error:", error);
  };

  const handleSuccess = (data: UserProfileData) => {
    console.log("Profile saved successfully:", data);
  };

  return (
    <ConfigurableForm
      title="User Profile"
      subtitle="Update your personal information and preferences"
      fields={userProfileFields}
      onSubmit={handleSubmit}
      onError={handleError}
      onSuccess={handleSuccess}
      layout="grid"
      columns={2}
      spacing="lg"
      showResetButton={true}
      resetButtonText="Reset Form"
      submitButtonText="Save Changes"
      submitButtonProps={{
        color: "primary",
        size: "lg",
      }}
    />
  );
}
```

## Advanced Features

### Conditional Fields

You can conditionally show/hide fields based on form state:

```tsx
const conditionalFields = [
  {
    name: "hasCompany",
    type: "checkbox",
    label: "I have a company",
  },
  {
    name: "companyName",
    type: "input",
    label: "Company Name",
    rules: { required: "Company name is required" },
    // This field will be conditionally rendered based on hasCompany value
    isDisabled: (values) => !values.hasCompany,
  },
];
```

### Custom Validation

```tsx
const fieldsWithCustomValidation = [
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      validate: {
        hasUpperCase: (value) =>
          /[A-Z]/.test(value) || "Password must contain uppercase letter",
        hasNumber: (value) =>
          /\d/.test(value) || "Password must contain a number",
      },
    },
  },
  {
    name: "confirmPassword",
    type: "input",
    label: "Confirm Password",
    inputProps: { type: "password" },
    rules: {
      required: "Please confirm your password",
      validate: (value, formValues) =>
        value === formValues.password || "Passwords do not match",
    },
  },
];
```

### Default Values

```tsx
const fieldsWithDefaults = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    defaultValue: "John",
  },
  {
    name: "plan",
    type: "select",
    label: "Plan",
    options: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
    ],
    defaultValue: "free",
  },
  {
    name: "notifications",
    type: "switch",
    label: "Notifications",
    defaultValue: true,
  },
];
```

## Best Practices

### 1. Organize Fields Logically

Group related fields together and use appropriate layouts:

```tsx
// Personal Information
const personalFields = [/* name, email, phone */];

// Preferences
const preferenceFields = [/* country, plan, theme */];

// Settings
const settingFields = [/* newsletter, notifications */];

const allFields = [...personalFields, ...preferenceFields, ...settingFields];
```

### 2. Use Descriptive Labels and Descriptions

```tsx
{
  name: "email",
  type: "input",
  label: "Email Address",
  description: "We'll use this to send you important updates",
  inputProps: { type: "email" },
}
```

### 3. Provide Meaningful Validation Messages

```tsx
{
  name: "password",
  type: "input",
  label: "Password",
  rules: {
    required: "Password is required to secure your account",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  },
}
```

### 4. Use Appropriate Field Types

```tsx
// ✅ Good - uses select for predefined options
{
  name: "country",
  type: "select",
  options: [/* country options */],
}

// ❌ Avoid - uses input for predefined options
{
  name: "country",
  type: "input",
  inputProps: { placeholder: "Enter country" },
}
```

## Examples

For complete working examples, see:

- [Getting Started](./getting-started.md) - Basic ConfigurableForm usage
- [Components](./components.md) - Individual field components
- [Validation](./validation.md) - Validation patterns
- [Layouts](./layouts.md) - Layout configurations

## Next Steps

- [Components](./components.md) - Learn about individual field components
- [Configuration](./configuration.md) - Set up global defaults
- [Validation](./validation.md) - Implement comprehensive validation
- [Layouts](./layouts.md) - Design beautiful form layouts
