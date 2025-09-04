# Hero Hook Form

[![npm version](https://badge.fury.io/js/%40rachelallyson%2Fhero-hook-form.svg)](https://badge.fury.io/js/%40rachelallyson%2Fhero-hook-form)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![HeroUI](https://img.shields.io/badge/HeroUI-2.x-purple.svg)](https://heroui.com/)

> **Typed form helpers that combine React Hook Form and HeroUI components.**

Build beautiful, accessible forms with full TypeScript support, validation, and HeroUI's design system.

## ✨ Features

- 🎯 **Strongly-typed** field components for HeroUI + React Hook Form
- 🏗️ **Single codebase, dual entrypoints**:
  - Default entrypoint for individual HeroUI packages
  - `/react` entrypoint for the aggregate `@heroui/react`
- 📦 **Optional peers** so apps can install only what they need
- 🔧 **Global configuration** system for consistent styling
- ✅ **Zod integration** for schema-based validation
- 🎨 **Multiple layouts** (vertical, horizontal, grid)
- ♿ **Accessibility-first** with HeroUI's built-in features
- 🌳 **Tree-shakeable** for optimal bundle sizes

## 🚀 Quick Start

### Option 1: All-in-One HeroUI Package (Recommended for Development)

```bash
npm install @rachelallyson/hero-hook-form @heroui/react react-hook-form zod
```

### Option 2: Individual HeroUI Packages (Recommended for Production)

```bash
npm install @rachelallyson/hero-hook-form react-hook-form zod
npm install @heroui/button @heroui/input @heroui/select  # Only what you need
```

### Basic Usage

```tsx
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
});

const config = {
  schema,
  fields: [
    { name: "name", type: "input", label: "Name" },
    { name: "email", type: "input", label: "Email", inputProps: { type: "email" } },
  ],
};

export function ContactForm() {
  return <ZodForm config={config} onSubmit={console.log} />;
}
```

> 📚 **See [Installation Guide](./docs/installation.md) for detailed setup instructions and bundle optimization tips.**

## 📊 Why Hero Hook Form?

| Feature | Manual Setup | Hero Hook Form |
|---------|--------------|----------------|
| TypeScript | ❌ Manual types | ✅ Automatic inference |
| Validation | ❌ Complex setup | ✅ Built-in + Zod |
| Styling | ❌ Inconsistent | ✅ Global defaults |
| Accessibility | ❌ Manual work | ✅ HeroUI built-in |
| Bundle size | ❌ Large | ✅ Tree-shakeable |
| Development | ❌ Slow | ✅ Rapid prototyping |

## Requirements

- react: >=18.2 <20
- react-dom: >=18.2 <20
- react-hook-form: >=7 <8
- HeroUI: 2.x (either the aggregate or individual component packages)

## Installation

### Option A: Using individual HeroUI packages (default entrypoint)

Install the library, React Hook Form, and the HeroUI components you actually use. If you only use a subset, install just that subset.

```bash
# minimal set that covers all included fields
npm i @rachelallyson/hero-hook-form react-hook-form \
  @heroui/input @heroui/checkbox @heroui/radio @heroui/select \
  @heroui/switch @heroui/button @heroui/spinner
```

Then import from the package root:

```tsx
import { InputField, SelectField, CheckboxField, RadioGroupField, SwitchField, TextareaField, SubmitButton } from "@rachelallyson/hero-hook-form";
```

### Option B: Using the aggregate `@heroui/react` (react entrypoint)

Install the library, React Hook Form, and the aggregate package:

```bash
npm i @rachelallyson/hero-hook-form react-hook-form @heroui/react
```

Then import from the `/react` subpath:

```tsx
import { InputField, SelectField, CheckboxField, RadioGroupField, SwitchField, TextareaField, SubmitButton } from "@rachelallyson/hero-hook-form/react";
```

## Setup (recommended)

Most HeroUI apps wrap the app with the `HeroUIProvider` from `@heroui/system` and typically set up theming via `next-themes` or similar. Example (Next.js):

```tsx
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
```

## Global configuration (defaults)

Set global defaults for all fields with `HeroHookFormProvider`. You can set a `common` bucket (applies to all supported components) and/or per-component buckets. Per-instance props always win.

Import the provider from the entrypoint you use (root or `/react`):

```tsx
import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form"; // or "/react"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HeroHookFormProvider
      defaults={{
        // Common keys shared across text-like controls (Input, Textarea, Select)
        // and safely narrowed for toggles and the submit button.
        common: {
          color: "primary",
          size: "md",
          variant: "faded",
          radius: "sm",
          labelPlacement: "outside",
        },
        // Component-specific defaults override 'common' for that component
        input: { variant: "underlined" },
        select: { variant: "flat" },
        submitButton: { color: "secondary" },
      }}
    >
      {children}
    </HeroHookFormProvider>
  );
}
```

- Precedence (highest last):
  1) `defaults.common`
  2) `defaults.{component}` (e.g., `input`, `select`, `checkbox`, `radioGroup`, `switch`, `textarea`, `submitButton`)
  3) Per-instance props (e.g., `inputProps`, `selectProps`, `checkboxProps`, etc.)

- Supported `common` keys (strongly typed and intersected across text-like controls):
  - `color`, `size`, `variant`, `radius`, `labelPlacement`
  - For toggles (`checkbox`, `radioGroup`, `switch`) and `submitButton`, only `color` and `size` are applied.

- Example instance override:

```tsx
<InputField
  control={methods.control}
  label="Name"
  name="name"
  inputProps={{ color: "danger" }} // overrides global defaults for this field
/>
```

- Scoping defaults: you can nest providers to scope different defaults to specific sections of your app.

## Zod Integration (Optional)

For type-safe validation with Zod schemas, install the additional dependencies:

```bash
npm i zod @hookform/resolvers
```

Then use the `ZodForm` component with Zod schemas:

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

### Zod Features

- **Type Safety**: Full TypeScript support with automatic type inference
- **Runtime Validation**: Comprehensive validation with custom error messages
- **Schema Reusability**: Define schemas once and reuse across your app
- **Complex Validation**: Support for enums, numbers, custom refinements, and more
- **Optional Integration**: Only install Zod if you need it

### Zod vs Standard Validation

| Feature | Standard Form | Zod Form |
|---------|---------------|----------|
| Validation Rules | In field config | In schema |
| Type Safety | Manual types | Automatic inference |
| Error Messages | Inline | In schema |
| Reusability | Per field | Schema-wide |
| Runtime Safety | Basic | Comprehensive |

## Quick start

A small form wired with React Hook Form using our typed field components.

```tsx
import { useForm } from "react-hook-form";
import { Form } from "@rachelallyson/hero-hook-form"; // or "/react"
import { InputField, SelectField, CheckboxField, TextareaField, RadioGroupField, SwitchField, SubmitButton } from "@rachelallyson/hero-hook-form"; // or "/react"

type Values = {
  name: string;
  email: string;
  bio: string;
  plan: "free" | "pro" | "team";
  agree: boolean;
  enabled: boolean;
};

export function ExampleForm() {
  const methods = useForm<Values>({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      plan: "free",
      agree: false,
      enabled: false,
    },
    mode: "onBlur",
  });

  return (
    <Form
      className="flex flex-col gap-4"
      methods={methods}
      onSubmit={async (values) => {
        // submit values to your API
        await new Promise((r) => setTimeout(r, 300));
        console.log(values);
      }}
    >
      <InputField control={methods.control} label="Name" name="name" rules={{ required: "Enter your name" }} />
      <InputField control={methods.control} label="Email" name="email" inputProps={{ type: "email" }} rules={{ required: "Enter your email" }} />

      <TextareaField control={methods.control} label="Bio" name="bio" description="Tell us about yourself" />

      <SelectField
        control={methods.control}
        label="Plan"
        name="plan"
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Team", value: "team" },
        ]}
      />

      <RadioGroupField
        control={methods.control}
        label="Plan (radio)"
        name="plan"
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Team", value: "team" },
        ]}
      />

      <CheckboxField control={methods.control} label="I agree to the terms" name="agree" rules={{ required: "You must agree" }} />
      <SwitchField control={methods.control} label="Enable feature" name="enabled" />

      <div className="flex justify-end">
        <SubmitButton buttonProps={{ color: "primary" }}>Submit</SubmitButton>
      </div>
    </Form>
  );
}
```

## API

### Field components

All field components are strongly typed over your form values and expose a `...Props` prop for passing through component props in a type-safe way. We derive prop types via `React.ComponentProps<typeof Component>` to avoid tight coupling to HeroUI’s internal type names.

- `InputField<TFieldValues>`
  - `inputProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">`
  - `transform?: (value: string) => string` – modify the value before writing to the form state
- `TextareaField<TFieldValues>`
  - `textareaProps?: Omit<ComponentProps<typeof Textarea>, ...>`
- `SelectField<TFieldValues, TValue extends string | number = string>`
  - `options: readonly { label: string; value: TValue; description?: string; disabled?: boolean }[]`
  - `selectProps?: Omit<ComponentProps<typeof Select>, "selectedKeys" | "onSelectionChange" | ...>`
- `RadioGroupField<TFieldValues, TValue extends string | number = string>`
  - `options: readonly { label: string; value: TValue; description?: string; disabled?: boolean }[]`
  - `radioGroupProps?: Omit<ComponentProps<typeof RadioGroup>, "value" | "onValueChange" | "label">`
- `CheckboxField<TFieldValues>`
  - `checkboxProps?: Omit<ComponentProps<typeof Checkbox>, ...>`
- `SwitchField<TFieldValues>`
  - `switchProps?: Omit<ComponentProps<typeof Switch>, ...>`
- `SubmitButton`
  - `isLoading?: boolean` – if omitted, reflects RHF’s `formState.isSubmitting`
  - `buttonProps?: Omit<ComponentProps<typeof Button>, "type" | "isLoading">`

### Form provider

- `Form<TFieldValues>` – light wrapper around RHF’s `FormProvider` that renders a `<form>` and wires `handleSubmit` safely.

```tsx
import { Form } from "@rachelallyson/hero-hook-form"; // or "/react"

<Form methods={methods} onSubmit={onSubmit} className="space-y-4">
  {/* fields */}
</Form>
```

### Server error helper

- `applyServerErrors(form, serverErrors)` – map API validation errors into RHF field errors.

```ts
import { applyServerErrors } from "@rachelallyson/hero-hook-form"; // or "/react"

try {
  await api.save(values);
} catch (e) {
  applyServerErrors(methods, e.errors);
}
```

## Choosing an entrypoint

- Use the default entrypoint if your app installs individual HeroUI packages.
- Use `/react` if your app installs the aggregate `@heroui/react` and you prefer a single HeroUI dep.

Peers are marked optional. Install only the set required by your chosen entrypoint.

## Version compatibility

- HeroUI: `>=2 <3`
- React: `>=18.2.0 <20`
- react-hook-form: `>=7 <8`

## 📚 Documentation

For comprehensive documentation, examples, and guides, visit our [documentation](./docs/README.md).

### Quick Links

- [🚀 Getting Started](./docs/getting-started.md) - Installation, setup, and first form
- [🧩 Components](./docs/components.md) - All available field components
- [🏗️ Form Builder](./docs/form-builder.md) - ConfigurableForm component guide
- [⚙️ Configuration](./docs/configuration.md) - Global configuration and providers
- [✅ Validation](./docs/validation.md) - Form validation patterns
- [🔒 Zod Integration](./docs/zod-integration.md) - Schema-based validation with Zod
- [🎨 Layouts](./docs/layouts.md) - Form layout options
- [📖 API Reference](./docs/api-reference.md) - Complete API documentation

## 🎯 Examples

Check out our [comprehensive demo](../example/app/comprehensive-demo/page.tsx) to see Hero Hook Form in action with all field types and layouts!

## ❓ FAQ

<details>
<summary><strong>Do I need to wrap with HeroUIProvider?</strong></summary>

Recommended for proper styling and navigation integration. Most HeroUI apps already do this.

</details>

<details>
<summary><strong>Can I tree-shake?</strong></summary>

Yes! Both entrypoints are tree-shakeable. Individual packages make size more explicit, while the aggregate is convenient.

</details>

<details>
<summary><strong>Do I have to install all individual packages?</strong></summary>

No! Install only the components you actually render. If you don't use `RadioGroupField`, you can omit `@heroui/radio`.

</details>

<details>
<summary><strong>What's the difference between the two entrypoints?</strong></summary>

- **Default**: For apps using individual HeroUI packages (better tree-shaking)
- **/react**: For apps using the aggregate `@heroui/react` (convenient single dependency)

</details>

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Rachel Higley](https://github.com/rachelallyson)**

[Report Bug](https://github.com/rachelallyson/hero-hook-form/issues) · [Request Feature](https://github.com/rachelallyson/hero-hook-form/issues) · [View Examples](../example/app/comprehensive-demo/page.tsx)

</div>
