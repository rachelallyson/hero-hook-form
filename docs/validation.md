# Validation

Master form validation with built-in rules and custom validators.

## Overview

Hero Hook Form leverages React Hook Form's powerful validation system, providing comprehensive validation capabilities with excellent TypeScript support. All validation rules are applied through the `rules` prop on field configurations.

## Basic Validation

### Required Fields

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
    rules: { required: "Email address is required" },
  },
];
```

### Pattern Validation

```tsx
const fields = [
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: { type: "tel" },
    rules: {
      pattern: {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: "Please enter a valid phone number",
      },
    },
  },
];
```

### Length Validation

```tsx
const fields = [
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters long",
      },
      maxLength: {
        value: 128,
        message: "Password must be less than 128 characters",
      },
    },
  },
  {
    name: "bio",
    type: "textarea",
    label: "Biography",
    rules: {
      maxLength: {
        value: 500,
        message: "Biography must be less than 500 characters",
      },
    },
  },
];
```

## Advanced Validation

### Custom Validation Functions

```tsx
const fields = [
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: {
      required: "Password is required",
      validate: {
        hasUpperCase: (value) =>
          /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
        hasLowerCase: (value) =>
          /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
        hasNumber: (value) =>
          /\d/.test(value) || "Password must contain at least one number",
        hasSpecialChar: (value) =>
          /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
      },
    },
  },
];
```

### Cross-Field Validation

```tsx
const fields = [
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

### Conditional Validation

```tsx
const fields = [
  {
    name: "hasCompany",
    type: "checkbox",
    label: "I have a company",
  },
  {
    name: "companyName",
    type: "input",
    label: "Company Name",
    rules: {
      required: (value, formValues) =>
        formValues.hasCompany ? "Company name is required" : false,
    },
  },
  {
    name: "companyEmail",
    type: "input",
    label: "Company Email",
    inputProps: { type: "email" },
    rules: {
      required: (value, formValues) =>
        formValues.hasCompany ? "Company email is required" : false,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
  },
];
```

## Validation Patterns

### Email Validation

```tsx
const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address",
  },
};

// Usage
{
  name: "email",
  type: "input",
  label: "Email Address",
  inputProps: { type: "email" },
  rules: emailValidation,
}
```

### Password Validation

```tsx
const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
  validate: {
    hasUpperCase: (value) =>
      /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
    hasLowerCase: (value) =>
      /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
    hasNumber: (value) =>
      /\d/.test(value) || "Password must contain at least one number",
    hasSpecialChar: (value) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
  },
};
```

### URL Validation

```tsx
const urlValidation = {
  pattern: {
    value: /^https?:\/\/.+/,
    message: "Please enter a valid URL starting with http:// or https://",
  },
};

// Usage
{
  name: "website",
  type: "input",
  label: "Website",
  inputProps: { type: "url" },
  rules: urlValidation,
}
```

### Phone Number Validation

```tsx
const phoneValidation = {
  pattern: {
    value: /^[\+]?[1-9][\d]{0,15}$/,
    message: "Please enter a valid phone number",
  },
};

// Usage
{
  name: "phone",
  type: "input",
  label: "Phone Number",
  inputProps: { type: "tel" },
  rules: phoneValidation,
}
```

### Credit Card Validation

```tsx
const creditCardValidation = {
  required: "Credit card number is required",
  pattern: {
    value: /^[0-9]{13,19}$/,
    message: "Please enter a valid credit card number",
  },
  validate: {
    luhnCheck: (value) => {
      if (!value) return true;
      
      // Remove spaces and dashes
      const cleanValue = value.replace(/\s+/g, '').replace(/-/g, '');
      
      // Luhn algorithm
      let sum = 0;
      let isEven = false;
      
      for (let i = cleanValue.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanValue.charAt(i));
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0 || "Invalid credit card number";
    },
  },
};
```

## Validation Modes

### On Blur Validation

```tsx
// In your form setup
const methods = useForm({
  mode: "onBlur", // Validate on blur
  defaultValues: {
    email: "",
    password: "",
  },
});

// Or in ConfigurableForm
<ConfigurableForm
  fields={fields}
  onSubmit={handleSubmit}
  mode="onBlur"
/>
```

### On Change Validation

```tsx
const methods = useForm({
  mode: "onChange", // Validate on every change
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### On Submit Validation (Default)

```tsx
const methods = useForm({
  mode: "onSubmit", // Validate only on submit
  defaultValues: {
    email: "",
    password: "",
  },
});
```

## Error Handling

### Custom Error Messages

```tsx
const fields = [
  {
    name: "username",
    type: "input",
    label: "Username",
    rules: {
      required: "Username is required to create your account",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters long",
      },
      maxLength: {
        value: 20,
        message: "Username must be less than 20 characters",
      },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "Username can only contain letters, numbers, and underscores",
      },
    },
  },
];
```

### Server-Side Validation

```tsx
import { applyServerErrors } from "@rachelallyson/hero-hook-form";

const handleSubmit = async (data: FormData) => {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Apply server validation errors to form
      applyServerErrors(methods, errorData.errors);
      return;
    }
    
    // Handle success
    console.log('Form submitted successfully');
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

### Error Display

Errors are automatically displayed below each field when validation fails. You can customize the error display through the global configuration:

```tsx
<HeroHookFormProvider
  defaults={{
    common: {
      color: "danger", // Error color
    },
  }}
>
  {children}
</HeroHookFormProvider>
```

## Validation Best Practices

### 1. Use Descriptive Error Messages

```tsx
// ✅ Good - descriptive and helpful
{
  name: "password",
  rules: {
    required: "Password is required to secure your account",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long for security",
    },
  },
}

// ❌ Avoid - generic messages
{
  name: "password",
  rules: {
    required: "Required",
    minLength: {
      value: 8,
      message: "Too short",
    },
  },
}
```

### 2. Group Related Validations

```tsx
const passwordValidations = {
  required: "Password is required",
  minLength: { value: 8, message: "Must be at least 8 characters" },
  validate: {
    hasUpperCase: (value) => /[A-Z]/.test(value) || "Must contain uppercase letter",
    hasNumber: (value) => /\d/.test(value) || "Must contain a number",
  },
};

const fields = [
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: passwordValidations,
  },
];
```

### 3. Use Appropriate Validation Modes

```tsx
// For real-time feedback
const methods = useForm({ mode: "onBlur" });

// For performance with large forms
const methods = useForm({ mode: "onSubmit" });

// For immediate feedback
const methods = useForm({ mode: "onChange" });
```

### 4. Validate Cross-Field Dependencies

```tsx
const fields = [
  {
    name: "startDate",
    type: "input",
    label: "Start Date",
    inputProps: { type: "date" },
    rules: { required: "Start date is required" },
  },
  {
    name: "endDate",
    type: "input",
    label: "End Date",
    inputProps: { type: "date" },
    rules: {
      required: "End date is required",
      validate: (value, formValues) => {
        if (!value || !formValues.startDate) return true;
        return new Date(value) > new Date(formValues.startDate) || 
               "End date must be after start date";
      },
    },
  },
];
```

### 5. Handle Async Validation

```tsx
const fields = [
  {
    name: "username",
    type: "input",
    label: "Username",
    rules: {
      required: "Username is required",
      validate: {
        uniqueUsername: async (value) => {
          if (!value) return true;
          
          const response = await fetch(`/api/check-username?username=${value}`);
          const { available } = await response.json();
          
          return available || "Username is already taken";
        },
      },
    },
  },
];
```

## Common Validation Patterns

### Registration Form

```tsx
const registrationFields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: {
      required: "First name is required",
      minLength: { value: 2, message: "First name must be at least 2 characters" },
    },
  },
  {
    name: "lastName",
    type: "input",
    label: "Last Name",
    rules: {
      required: "Last name is required",
      minLength: { value: 2, message: "Last name must be at least 2 characters" },
    },
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
        message: "Please enter a valid email address",
      },
    },
  },
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: {
      required: "Password is required",
      minLength: { value: 8, message: "Password must be at least 8 characters" },
      validate: {
        hasUpperCase: (value) => /[A-Z]/.test(value) || "Must contain uppercase letter",
        hasNumber: (value) => /\d/.test(value) || "Must contain a number",
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
  {
    name: "agreeToTerms",
    type: "checkbox",
    label: "I agree to the Terms of Service",
    rules: {
      required: "You must agree to the terms to continue",
      validate: (value) => value === true || "You must agree to the terms",
    },
  },
];
```

## Examples

For complete validation examples, see:

- [Getting Started](./getting-started.md) - Basic validation patterns
- [Form Builder](./form-builder.md) - ConfigurableForm validation
- [Components](./components.md) - Field-specific validation

## Next Steps

- [Components](./components.md) - Learn about field components
- [Form Builder](./form-builder.md) - Master the ConfigurableForm component
- [Configuration](./configuration.md) - Set up global defaults
- [Layouts](./layouts.md) - Design form layouts
