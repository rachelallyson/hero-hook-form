# Hero Hook Form

**Typed form helpers that combine React Hook Form and HeroUI components.**

Hero Hook Form provides a comprehensive solution for building accessible, performant forms in React applications. It combines the power of React Hook Form with HeroUI's beautiful design system, offering type-safe form building with minimal boilerplate.

## 📚 Documentation

**Full documentation available at: [https://rachelallyson.github.io/hero-hook-form/](https://rachelallyson.github.io/hero-hook-form/)**

## Installation

```bash
npm install @rachelallyson/hero-hook-form
```

## Quick Start

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export function ContactForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.input("name", "Name"),
          FormFieldHelpers.input("email", "Email", "email"),
        ],
      }}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

## Key Features

- **🎯 Type Safety** - Full TypeScript support with automatic type inference
- **🎨 HeroUI Integration** - Beautiful, accessible components out of the box
- **⚡ Performance** - Optimized with React.memo and debounced validation
- **🔧 Flexible APIs** - Multiple form building patterns to suit your needs
- **📝 Zod Integration** - Seamless schema validation with Zod
- **🔄 Dynamic Forms** - Conditional fields, field arrays, and dynamic sections
- **🧪 Testing Ready** - Built-in testing utilities for Cypress
- **🚀 Next.js Server Actions** - Compatible with Next.js authentication patterns

## Form Building Patterns

### 1. Helper Functions (Recommended)

```tsx
const fields = [
  FormFieldHelpers.input("name", "Name"),
  FormFieldHelpers.textarea("message", "Message"),
  FormFieldHelpers.select("country", "Country", options),
];
```

### 2. Builder Pattern

```tsx
import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";

const fields = createBasicFormBuilder()
  .input("name", "Name")
  .textarea("message", "Message")
  .select("country", "Country", options)
  .build();
```

### 3. Type-Inferred Forms

```tsx
import { defineInferredForm, field } from "@rachelallyson/hero-hook-form";

const form = defineInferredForm({
  name: field.string("Name"),
  email: field.email("Email"),
  age: field.number("Age"),
});
```

### 4. Next.js Server Actions

```tsx
import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { signup } from "@/app/actions/auth";

<ServerActionForm
  action={signup}
  fields={[
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email", { type: "email" }),
  ]}
/>
```

## What's Included

- **Components**: `Form`, `FormField`, `ZodForm`, `ServerActionForm`, field components, `FormStatus`
- **Hooks**: `useFormHelper`, `useHeroForm`, `useEnhancedFormState`, `useDebouncedValidation`, `useInferredForm`
- **Builders**: `createBasicFormBuilder`, `createAdvancedBuilder`, `createTypeInferredBuilder`
- **Utils**: `applyServerErrors`, validation helpers, performance utilities, testing utilities
- **Zod Integration**: `ZodForm` component with automatic schema validation
- **Next.js Support**: `ServerActionForm` for Next.js Server Actions and authentication

## Setup

1. **Install the package**:

   ```bash
   npm install @rachelallyson/hero-hook-form
   ```

2. **Set up your provider**:

   ```tsx
   import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form";
   
   function App() {
     return (
       <HeroHookFormProvider>
         <YourForms />
       </HeroHookFormProvider>
     );
   }
   ```

3. **Create your first form**:

   ```tsx
   import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
   ```

## Documentation Links

- **Quick Start Guide**: [https://rachelallyson.github.io/hero-hook-form/guides/quickstart](https://rachelallyson.github.io/hero-hook-form/guides/quickstart)
- **API Reference**: [https://rachelallyson.github.io/hero-hook-form/api/README](https://rachelallyson.github.io/hero-hook-form/api/README)
- **Next.js Server Actions**: [Next.js Authentication Guide](./docs/guides/nextjs-server-actions.md) - Use with Next.js auth forms
- **Dynamic Forms**: [https://rachelallyson.github.io/hero-hook-form/guides/dynamic-forms](https://rachelallyson.github.io/hero-hook-form/guides/dynamic-forms)
- **Error Handling**: [https://rachelallyson.github.io/hero-hook-form/guides/error-handling](https://rachelallyson.github.io/hero-hook-form/guides/error-handling)
- **Testing Guide**: [https://rachelallyson.github.io/hero-hook-form/guides/testing-guide](https://rachelallyson.github.io/hero-hook-form/guides/testing-guide)
- **Live Demos**: [https://rachelallyson.github.io/hero-hook-form/demo](https://rachelallyson.github.io/hero-hook-form/demo)

## What's New in v2.0

- **Dynamic Form Sections** - Conditional fields and field arrays
- **Enhanced Performance** - Memoized components and debounced validation
- **Type-Inferred Forms** - Alternative API with automatic schema generation
- **Form State Management** - Enhanced state tracking and status components
- **Validation Patterns** - Cross-field validation and common patterns

## Requirements

- React >= 18.2.0
- React Hook Form >= 7
- Zod >= 4
- HeroUI components (peer dependencies)

## License

ISC License - see [LICENSE](LICENSE) for details.

## Community

- **GitHub**: [rachelallyson/hero-hook-form](https://github.com/rachelallyson/hero-hook-form)
- **Issues**: [Report bugs or request features](https://github.com/rachelallyson/hero-hook-form/issues)
- **Documentation**: [https://rachelallyson.github.io/hero-hook-form/](https://rachelallyson.github.io/hero-hook-form/)
