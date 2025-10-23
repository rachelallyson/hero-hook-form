# Hero Hook Form Documentation

Build beautiful, type-safe forms with React Hook Form and HeroUI components.
Featuring comprehensive validation, multiple layouts, and seamless integration.

## 📚 Documentation Index

### 🚀 Getting Started

- [Getting Started](./getting-started.md) - Installation, setup, and first form
- [Quick Start](./quick-start.md) - Fast track to your first form
- [Installation](./installation.md) - Detailed installation guide

### 🧩 Components & Fields

- [Components](./components.md) - All available field components
- [Input Types Guide](./input-types-guide.md) - Complete reference for all input types
- [Radio Buttons Guide](./radio-buttons-guide.md) - Complete radio button guide
- [Nested Fields Guide](./nested-fields-guide.md) - Working with nested fields

### ⚙️ Configuration & Setup

- [Configuration](./configuration.md) - Global configuration and providers
- [Form Builder](./form-builder.md) - ConfigurableForm component
- [Layouts](./layouts.md) - Form layout options

### ✅ Validation & Forms

- [Validation](./validation.md) - Form validation patterns
- [Zod Integration](./zod-integration.md) - Schema-based validation with Zod
- [Form Methods Guide](./form-methods-guide.md) - Advanced form methods
- [ZodForm Methods Quick Reference](./zodform-methods-quick-reference.md) - Quick reference

### 🎨 Advanced Features

- [Font Picker Guide](./font-picker-guide.md) - Optional font picker field
- [Font Picker Styling](./font-picker-styling.md) - HeroUI integration and styling
- [Enhanced Features](./enhanced-features.md) - Advanced features and patterns

### 📖 Reference

- [API Reference](./api-reference.md) - Complete API documentation

## 🎯 Key Features

### ✓ Type Safety

Full TypeScript support with automatic type inference from your form schemas.

### ✓ Multiple Field Types  

Input, Textarea, Select, Radio, Checkbox, Switch, Slider, Date, File, and more with HeroUI styling.

### ✓ Flexible Layouts

Vertical, horizontal, and grid layouts with responsive design.

### ✓ Built-in Validation

Comprehensive validation with React Hook Form integration and custom rules.

### ✓ Global Configuration

Set defaults across your entire application with the HeroHookFormProvider.

### ✓ ConfigurableForm

Rapid form development with declarative field configurations.

### ✓ Optional Dependencies

Install only what you need - font picker, validation libraries, and HeroUI components are all optional.

## Quick Example

```tsx
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

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
        message: "Invalid email address"
      }
    },
  },
  {
    name: "plan",
    type: "select",
    label: "Plan",
    options: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Team", value: "team" },
    ],
  },
];

<ConfigurableForm
  title="Contact Form"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  showResetButton={true}
/>
```

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

## 📋 Requirements

- **React**: >=18.2.0 <20
- **React DOM**: >=18.2.0 <20  
- **React Hook Form**: >=7 <8
- **HeroUI**: >=2 <3

## 🎯 Live Demo

Check out our [comprehensive demo](../example/app/comprehensive-demo/page.tsx) to see Hero Hook Form in action with all field types and layouts!

## 🤝 Support

- [GitHub Issues](https://github.com/rachelallyson/hero-hook-form/issues)
- [Examples](../example/) - Complete working examples
- [Documentation](./) - Comprehensive guides and references

## 📄 License

ISC License - see [LICENSE](../LICENSE) file for details.
