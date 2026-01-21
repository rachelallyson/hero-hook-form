# Hero Hook Form Documentation

**@rachelallyson/hero-hook-form** is a TypeScript library that provides typed form helpers combining React Hook Form with HeroUI components. It offers multiple APIs for form creation, from simple field helpers to advanced builders with dynamic sections, conditional fields, and field arrays.

## Quick Start

```bash
npm install @rachelallyson/hero-hook-form @heroui/react react-hook-form zod
```

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
});

export function MyForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.input("name", "Name"),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

## Documentation Structure

### Core Concepts

- [**Concepts**](./concepts.md) - Core mental models, form lifecycle, and data flow
- [**Quick Start**](./guides/quickstart.md) - 5-minute setup with real examples
- [**Dynamic Forms**](./guides/dynamic-forms.md) - Conditional fields, arrays, and dynamic sections
- [**Error Handling**](./guides/error-handling.md) - Validation patterns and error management
- [**Accessibility**](./guides/accessibility.md) - ARIA support, keyboard navigation, and screen reader testing
- [**Performance**](./guides/performance.md) - Memoization, debouncing, and optimization strategies
- [**Testing**](./guides/testing.md) - Component testing, integration testing, and test utilities
- [**Cypress Testing**](./guides/cypress-testing.md) - Comprehensive Cypress testing helpers and patterns
- [**Migration v2**](./guides/migration-v2.md) - Upgrade guide from v1.x to v2.0

### API Reference

- [**Configuration**](./reference/config.md) - All configuration options and defaults
- [**API Documentation**](./reference/api/README.md) - Complete API reference with examples

### Examples & Recipes

- [**Recipes**](./recipes/examples.md) - 6-10 copy-paste code snippets for common tasks
- [**Troubleshooting**](./troubleshooting.md) - Common issues and their solutions

## Key Features

### 🚀 Multiple Form APIs

- **Helper Functions**: Simple field creation with `FormFieldHelpers`
- **Advanced Builders**: Complex forms with `createAdvancedBuilder`
- **Type-Inferred Forms**: Automatic schema generation with `createTypeInferredBuilder`
- **Zod Integration**: Full Zod schema validation with `ZodForm`

### 🎨 Rich Field Types

- **Input Fields**: Text, email, password, number, tel, url
- **Selection Fields**: Select, radio groups, checkboxes, switches
- **Special Fields**: Date picker, file upload, slider, font picker
- **Layout Fields**: Textarea, conditional fields, field arrays

### ⚡ Performance & Developer Experience

- **TypeScript**: Full type safety with inference
- **Performance**: Memoized components and debounced validation
- **HeroUI Integration**: Native styling and behavior
- **Testing**: Comprehensive Cypress test suite

### 🔧 Advanced Features

- **Dynamic Forms**: Conditional rendering and field arrays
- **Cross-Field Validation**: Password confirmation, date ranges
- **Enhanced State**: Loading states, success feedback, error handling
- **Performance Monitoring**: Built-in performance utilities

## Package Exports

The package exports multiple modules:

```tsx
// Main exports
import { 
  ZodForm, 
  FormFieldHelpers,
  createAdvancedBuilder,
  useHeroForm 
} from "@rachelallyson/hero-hook-form";

// React-specific exports
import { InputField, CheckboxField } from "@rachelallyson/hero-hook-form";

// Cypress testing utilities
import { cy } from "@rachelallyson/hero-hook-form/cypress";
```

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/rachelallyson/hero-hook-form/issues)
- **Examples**: Check the `/example` directory for working demos
- **TypeScript**: All APIs are fully typed with IntelliSense support

## Version Compatibility

- **React**: >=18.2.0 <20
- **React Hook Form**: >=7 <8
- **HeroUI**: >=2 <3
- **Zod**: >=4
- **Node**: >=18.0.0

---

*For AI assistants: See [LLM Context](./llm-context.md) for quick reference.*
