# Getting Started

Learn how to install, configure, and create your first form with Hero Hook Form.

## Installation

Hero Hook Form requires React Hook Form and HeroUI components. Choose your preferred installation method:

### Option A: Individual HeroUI Packages

Install only the HeroUI components you need for better tree-shaking.

```bash
npm install @rachelallyson/hero-hook-form react-hook-form \
  @heroui/input @heroui/checkbox @heroui/radio \
  @heroui/select @heroui/switch @heroui/button \
  @heroui/spinner
```

Import from the package root:

```tsx
import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form";
```

### Option B: Aggregate HeroUI Package

Use the aggregate package for convenience and simpler dependency management.

```bash
npm install @rachelallyson/hero-hook-form react-hook-form @heroui/react
```

Import from the `/react` subpath:

```tsx
import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form/react";
```

## Setup

Configure your app with the necessary providers for optimal functionality.

### App Configuration

Wrap your app with the necessary providers. This example shows a typical Next.js setup:

```tsx
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";
import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <HeroHookFormProvider
          defaults={{
            common: {
              color: "primary",
              size: "md",
              variant: "faded",
              radius: "sm",
              labelPlacement: "outside",
            },
            input: { variant: "underlined" },
            select: { variant: "flat" },
            submitButton: { color: "secondary" },
          }}
        >
          {children}
        </HeroHookFormProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
```

## Quick Start

Create your first form using the ConfigurableForm component for rapid development.

### Simple Contact Form

This example demonstrates a basic contact form with validation:

```tsx
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  newsletter: boolean;
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
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rules: { required: "Message is required" },
  },
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to newsletter",
  },
];

export function ContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Send data to your API
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

## Manual Form Setup

For more control, you can manually wire up individual field components with React Hook Form.

### Using Individual Components

This approach gives you maximum flexibility and control:

```tsx
import { useForm } from "react-hook-form";
import { 
  InputField, 
  TextareaField, 
  SelectField, 
  CheckboxField,
  SubmitButton 
} from "@rachelallyson/hero-hook-form";

interface FormData {
  name: string;
  email: string;
  plan: string;
  agree: boolean;
}

export function ManualForm() {
  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      plan: "free",
      agree: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        control={methods.control}
        name="name"
        label="Name"
        rules={{ required: "Name is required" }}
      />
      
      <InputField
        control={methods.control}
        name="email"
        label="Email"
        inputProps={{ type: "email" }}
        rules={{ required: "Email is required" }}
      />
      
      <SelectField
        control={methods.control}
        name="plan"
        label="Plan"
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Team", value: "team" },
        ]}
      />
      
      <CheckboxField
        control={methods.control}
        name="agree"
        label="I agree to the terms"
        rules={{ required: "You must agree" }}
      />
      
      <SubmitButton>Submit</SubmitButton>
    </form>
  );
}
```

## Next Steps

- [Explore Components](./components.md) - Learn about all available field components
- [Configuration Guide](./configuration.md) - Set up global defaults and providers
- [Form Builder](./form-builder.md) - Master the ConfigurableForm component
- [Validation Patterns](./validation.md) - Implement comprehensive form validation
- [Layout Options](./layouts.md) - Design beautiful form layouts

## Examples

Check out our [comprehensive demo](../example/app/comprehensive-demo/page.tsx) to see Hero Hook Form in action with all field types and layouts!
