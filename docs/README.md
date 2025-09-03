# Hero Hook Form Documentation

Build beautiful, type-safe forms with React Hook Form and HeroUI components.
Featuring comprehensive validation, multiple layouts, and seamless integration.

## Quick Navigation

- [🚀 Getting Started](./getting-started.md) - Installation, setup, and first form
- [🧩 Components](./components.md) - All available field components
- [⚙️ Configuration](./configuration.md) - Global configuration and providers
- [📝 Form Builder](./form-builder.md) - ConfigurableForm component
- [✅ Validation](./validation.md) - Form validation patterns
- [🔮 Zod Integration](./zod-integration.md) - Schema-based validation with Zod
- [🎨 Layouts](./layouts.md) - Form layout options
- [🔧 API Reference](./api-reference.md) - Complete API documentation

## Key Features

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

## Installation

### Option A: Individual HeroUI Packages

```bash
npm install @rachelallyson/hero-hook-form react-hook-form \
  @heroui/input @heroui/checkbox @heroui/radio \
  @heroui/select @heroui/switch @heroui/button \
  @heroui/spinner
```

### Option B: Aggregate HeroUI Package

```bash
npm install @rachelallyson/hero-hook-form react-hook-form @heroui/react
```

## Requirements

- React: >=18.2.0 <20
- React DOM: >=18.2.0 <20
- React Hook Form: >=7 <8
- HeroUI: >=2 <3

## Live Demo

Check out our [comprehensive demo](../example/app/comprehensive-demo/page.tsx) to see Hero Hook Form in action!

## Support

- [GitHub Issues](https://github.com/your-repo/hero-hook-form/issues)
- [Discussions](https://github.com/your-repo/hero-hook-form/discussions)
- [Examples](../example/) - Complete working examples

## License

ISC
