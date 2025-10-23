# Hero Hook Form

[![npm version](https://badge.fury.io/js/%40rachelallyson%2Fhero-hook-form.svg)](https://badge.fury.io/js/%40rachelallyson%2Fhero-hook-form)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![HeroUI](https://img.shields.io/badge/HeroUI-2.x-purple.svg)](https://heroui.com/)

> **Type-safe form components that combine React Hook Form with HeroUI's design system.**

Build beautiful, accessible forms with full TypeScript support, comprehensive validation, and HeroUI's modern design system. Perfect for React applications that need robust form handling with excellent developer experience.

## ✨ Features

- 🎯 **Strongly-typed** field components with automatic TypeScript inference
- 🏗️ **Dual entrypoints** for maximum flexibility:
  - Default entrypoint for individual HeroUI packages (better tree-shaking)
  - `/react` entrypoint for the aggregate `@heroui/react` (convenient single dependency)
- 📦 **Optional dependencies** - install only what you need
- 🔧 **Global configuration** system for consistent styling across your app
- ✅ **Zod integration** for schema-based validation with type safety
- 🎨 **Multiple layouts** (vertical, horizontal, grid) with responsive design
- ♿ **Accessibility-first** with HeroUI's built-in ARIA support
- 🌳 **Tree-shakeable** for optimal bundle sizes
- 🚀 **Rapid prototyping** with ConfigurableForm component
- 🎨 **Optional font picker** with Google Fonts integration

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

### Option 3: With Optional Font Picker

For advanced font selection with Google Fonts integration:

```bash
npm install @rachelallyson/hero-hook-form @rachelallyson/heroui-font-picker
```

The `FontPickerField` will automatically use the font picker package if available, with a helpful fallback message if not installed.

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

- **React**: >=18.2 <20
- **React DOM**: >=18.2 <20  
- **React Hook Form**: >=7 <8
- **HeroUI**: >=2 <3 (either individual packages or `@heroui/react`)

## Installation Options

### Option A: Individual HeroUI Packages (Recommended for Production)

Install only the HeroUI components you actually use for optimal bundle size:

```bash
# Minimal set that covers all included fields
npm i @rachelallyson/hero-hook-form react-hook-form \
  @heroui/input @heroui/checkbox @heroui/radio @heroui/select \
  @heroui/switch @heroui/button @heroui/spinner
```

Import from the package root:

```tsx
import { InputField, SelectField, CheckboxField, RadioGroupField, SwitchField, TextareaField, SubmitButton } from "@rachelallyson/hero-hook-form";
```

### Option B: Aggregate HeroUI Package (Recommended for Development)

Install the all-in-one HeroUI package for convenience:

```bash
npm i @rachelallyson/hero-hook-form react-hook-form @heroui/react
```

Import from the `/react` subpath:

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

### Nested Fields and Radio Buttons

For nested field names and radio buttons:

```tsx
const settingsSchema = z.object({
  fonts: z.object({
    scale: z.enum(["small", "medium", "large"]).default("medium"),
  }),
  layout: z.object({
    sidebarPosition: z.enum(["left", "right", "hidden"]).default("left"),
  }),
  style: z.object({
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
  }),
});

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
    name: "style.theme",
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
    layout: { sidebarPosition: "right" },
    style: { theme: "auto" },
  },
});
```

### Zod Features

- **Type Safety**: Full TypeScript support with automatic type inference
- **Nested Fields**: Support for nested field names like "fonts.scale"
- **Default Values**: Proper handling of default values with nested structure
- **Radio Buttons**: Easy configuration with `radioOptions`

## 🎯 Examples

Check out our [comprehensive demo](../example/app/comprehensive-demo/page.tsx) to see Hero Hook Form in action with all field types and layouts!

## 📚 Documentation

For comprehensive guides and examples, visit our [documentation](./docs/README.md):

- [🚀 Getting Started](./docs/getting-started.md) - Installation, setup, and first form
- [🧩 Components](./docs/components.md) - All available field components  
- [⚙️ Configuration](./docs/configuration.md) - Global configuration and providers
- [📝 Form Builder](./docs/form-builder.md) - ConfigurableForm component
- [✅ Validation](./docs/validation.md) - Form validation patterns
- [🔮 Zod Integration](./docs/zod-integration.md) - Schema-based validation with Zod
- [🎨 Layouts](./docs/layouts.md) - Form layout options
- [📖 API Reference](./docs/api-reference.md) - Complete API documentation

## 🔧 API Overview

### Field Components

All field components are strongly typed and expose component-specific props:

- **`InputField`** - Text inputs with validation
- **`TextareaField`** - Multi-line text inputs  
- **`SelectField`** - Dropdown selections
- **`RadioGroupField`** - Radio button groups
- **`CheckboxField`** - Single checkboxes
- **`SwitchField`** - Toggle switches
- **`SliderField`** - Range slider inputs
- **`DateField`** - Date picker inputs
- **`FileField`** - File upload inputs
- **`FontPickerField`** - Optional font selection (requires `@rachelallyson/heroui-font-picker`)

### Form Components

- **`Form`** - Light wrapper around React Hook Form's FormProvider
- **`FormField`** - Generic field wrapper component
- **`ZodForm`** - Schema-based forms with Zod validation
- **`ConfigurableForm`** - Rapid form development with declarative config

### Utilities & Hooks

- **`applyServerErrors`** - Map API validation errors to form fields
- **`HeroHookFormProvider`** - Global configuration for consistent styling
- **`useHeroForm`** - Enhanced form hook with additional utilities
- **`useFormHelper`** - Form helper utilities

For complete API documentation, see [API Reference](./docs/api-reference.md).

## 🎯 Entrypoint Selection

- **Default entrypoint**: For apps using individual HeroUI packages (better tree-shaking)
- **`/react` entrypoint**: For apps using `@heroui/react` (convenient single dependency)

Both entrypoints are fully tree-shakeable and support all features.

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
