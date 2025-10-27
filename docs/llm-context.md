# LLM Context - Hero Hook Form

**Purpose**: Help AI assistants understand and work with @rachelallyson/hero-hook-form effectively.

## Start Here

- [docs/index.md](./index.md) - Main documentation entry point
- [docs/concepts.md](./concepts.md) - Core mental models and data flow
- [docs/reference/config.md](./reference/config.md) - Configuration options
- [docs/reference/api/README.md](./reference/api/README.md) - Complete API reference
- [src/index.ts](../src/index.ts) - Public exports and API surface

## Invariants

- **Form State**: All forms use React Hook Form under the hood; state is managed via `useForm` or `useFormContext`
- **HeroUI Integration**: All field components render HeroUI components with consistent styling
- **Type Safety**: All field names must be valid paths in the form data type
- **Validation**: Zod schemas are optional but recommended for type-safe validation
- **Performance**: Components are memoized; use `React.memo` for custom field components
- **Error Handling**: Field errors are displayed via HeroUI's `errorMessage` prop
- **Default Values**: Set via `defaultValues` prop on form or individual field `defaultValue`

## Public Surface

- **Core Components**: `ZodForm`, `FormField`, `FormStatus`
- **Field Components**: `InputField`, `CheckboxField`, `SelectField`, `TextareaField`, `SwitchField`, `RadioGroupField`, `SliderField`, `DateField`, `FileField`, `FontPickerField`
- **Dynamic Components**: `ConditionalField`, `FieldArrayField`, `DynamicSectionField`
- **Hooks**: `useHeroForm`, `useFormHelper`, `useEnhancedFormState`, `useDebouncedValidation`, `useInferredForm`
- **Builders**: `createAdvancedBuilder`, `createTypeInferredBuilder`, `createBasicFormBuilder`
- **Helpers**: `FormFieldHelpers`, `CommonFields`, `validationPatterns`
- **Utilities**: `applyServerErrors`, `crossFieldValidation`, performance utilities

## Common Tasks

- [Quick Start Guide](./guides/quickstart.md) - Basic form setup
- [Dynamic Forms Guide](./guides/dynamic-forms.md) - Conditional fields and arrays
- [Error Handling Guide](./guides/error-handling.md) - Validation and error patterns
- [Cypress Testing Guide](./guides/cypress-testing.md) - Comprehensive testing helpers
- [Recipes](./recipes/examples.md) - Copy-paste code examples

## Don'ts

- **Don't deep import**: Use public exports from `src/index.ts` only
- **Don't invent config**: Only use configuration options documented in `docs/reference/config.md`
- **Don't bypass validation**: Always use proper Zod schemas or React Hook Form rules
- **Don't ignore TypeScript**: All field names must be valid TypeScript paths
- **Don't forget memoization**: Custom field components should use `React.memo`
- **Don't mix APIs**: Stick to one form building approach per form (helpers vs builders vs Zod)

## Form Building Patterns

### 1. Helper Functions (Simplest)

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";

<ZodForm
  config={{
    schema: mySchema,
    fields: [
      FormFieldHelpers.input("name", "Name"),
      FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
    ],
    onSubmit: handleSubmit,
  }}
/>
```

### 2. Advanced Builder (Most Flexible)

```tsx
import { createAdvancedBuilder } from "@rachelallyson/hero-hook-form";

const builder = createAdvancedBuilder<MyFormData>()
  .addInput("name", "Name")
  .addCheckbox("newsletter", "Subscribe")
  .build();
```

### 3. Type-Inferred (Automatic)

```tsx
import { createTypeInferredBuilder } from "@rachelallyson/hero-hook-form";

const builder = createTypeInferredBuilder()
  .addInput("name", "Name")
  .addCheckbox("newsletter", "Subscribe")
  .build();
```

## Field Configuration

All fields support:

- `name`: Field path (string or Path<T>)
- `label`: Display label
- `description`: Help text
- `disabled`: Disable field
- `condition`: Show/hide based on form values
- `rules`: React Hook Form validation rules

## Error Patterns

- **Field Errors**: Displayed via HeroUI `errorMessage` prop
- **Form Errors**: Shown in `FormStatus` component or custom error display
- **Server Errors**: Use `applyServerErrors` utility
- **Cross-Field**: Use `crossFieldValidation` for password confirmation, etc.

## Performance Notes

- All field components are memoized with `React.memo`
- Use `useDebouncedValidation` for expensive validation
- Field arrays and conditional fields are optimized for minimal re-renders
- Performance monitoring available via `usePerformanceMonitor`
