# TypeDoc Generator Improvements

This document outlines how to improve the generated API documentation by fixing the generator (TypeDoc configuration and source code JSDoc comments).

## Current State

- **Generator**: TypeDoc (`typedoc.json` config)
- **Output**: `docs/content/api/` (markdown files)
- **Issue**: Generated docs lack examples, detailed descriptions, and proper organization
- **Command**: `npm run docs:api` (runs `typedoc`)

## Fix Strategy

### 1. Improve TypeDoc Configuration

Update `typedoc.json` to produce better output:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs/content/api",
  "name": "Hero Hook Form API",
  "includeVersion": true,
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "excludeInternal": true,
  "excludeNotDocumented": false,
  "excludeTags": ["@internal"],
  "theme": "default",
  "readme": "docs/content/api/README.md", // Add readme
  "navigation": {
    "includeCategories": true,
    "includeGroups": true
  },
  "categorizeByGroup": true,
  "defaultCategory": "Other",
  "categoryOrder": [
    "Components",
    "Hooks",
    "Builders",
    "Utilities",
    "Types",
    "Other"
  ],
  "sort": ["source-order"],
  "plugin": ["typedoc-plugin-markdown"],
  "cleanOutputDir": true,
  "markdown": {
    "entryDocument": "README.md",
    "hideBreadcrumbs": false,
    "hidePageHeader": false,
    "hidePageTitle": false,
    "indexFormat": "table",
    "tableOfContents": true
  }
}
```

### 2. Add JSDoc Comments to Source Code

#### Template for Components

```typescript
/**
 * ZodForm component for building type-safe forms with Zod validation.
 * 
 * @description
 * This component provides a complete form solution with automatic validation,
 * error handling, and type safety. It integrates React Hook Form with Zod
 * schemas and HeroUI components.
 * 
 * @template T - The form data type inferred from the Zod schema
 * 
 * @param {ZodFormProps<T>} props - Component props
 * @param {ZodFormConfig<T>} props.config - Form configuration with schema and fields
 * @param {SubmitHandler<T>} props.onSubmit - Submit handler function
 * @param {string} [props.title] - Optional form title
 * @param {string} [props.subtitle] - Optional form subtitle
 * @param {"vertical"|"horizontal"|"grid"} [props.layout="vertical"] - Form layout
 * @param {1|2|3} [props.columns=1] - Number of columns for grid layout
 * 
 * @returns {JSX.Element} The rendered form component
 * 
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 * 
 * const schema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 * 
 * function ContactForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.input("name", "Name"),
 *           FormFieldHelpers.input("email", "Email", "email"),
 *         ],
 *       }}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   );
 * }
 * ```
 * 
 * @see {@link Form} for the base form component
 * @see {@link FormFieldHelpers} for field creation helpers
 * @category Components
 */
export function ZodForm<T extends FieldValues>({ ... }) { ... }
```

#### Template for Hooks

```typescript
/**
 * Hook for managing form state with enhanced features.
 * 
 * @description
 * Provides form state management with loading states, error handling,
 * and submission tracking. Automatically handles form validation and
 * provides callbacks for success and error cases.
 * 
 * @template T - The form data type
 * 
 * @param {UseFormHelperOptions<T>} options - Hook options
 * @param {Partial<T>} [options.defaultValues] - Default form values
 * @param {SubmitHandler<T>} options.onSubmit - Submit handler
 * @param {(errors: FieldErrors<T>) => void} [options.onError] - Error handler
 * @param {(data: T) => void} [options.onSuccess] - Success handler
 * 
 * @returns {UseFormHelperReturn<T>} Form helper with state and methods
 * 
 * @example
 * ```tsx
 * function MyForm() {
 *   const { form, handleSubmit, isSubmitting } = useFormHelper({
 *     defaultValues: { email: "" },
 *     onSubmit: async (data) => {
 *       await submitToServer(data);
 *     },
 *     onError: (errors) => {
 *       console.error("Validation errors:", errors);
 *     },
 *   });
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {/* form fields */}
 *     </form>
 *   );
 * }
 * ```
 * 
 * @see {@link useHeroForm} for alternative hook
 * @category Hooks
 */
export function useFormHelper<T extends FieldValues>({ ... }) { ... }
```

#### Template for Utility Functions

```typescript
/**
 * Applies server-side validation errors to a React Hook Form instance.
 * 
 * @description
 * Maps server-returned field errors to React Hook Form's error state.
 * Useful for displaying validation errors from API responses.
 * 
 * @template T - The form data type
 * 
 * @param {UseFormReturn<T>} form - React Hook Form instance
 * @param {Record<string, string>} errors - Field errors from server
 * 
 * @example
 * ```tsx
 * import { applyServerErrors } from "@rachelallyson/hero-hook-form";
 * 
 * async function handleSubmit(data) {
 *   try {
 *     await submitToServer(data);
 *   } catch (error) {
 *     if (error.fieldErrors) {
 *       applyServerErrors(form, error.fieldErrors);
 *     }
 *   }
 * }
 * ```
 * 
 * @see {@link FormValidationError} for error type definition
 * @category Utilities
 */
export function applyServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Record<string, string>
): void { ... }
```

#### Template for Builders

```typescript
/**
 * Creates a basic form builder for simple form construction.
 * 
 * @description
 * Provides a fluent API for building form field configurations.
 * Best for simple forms with standard field types.
 * 
 * @returns {BasicFormBuilder} Builder instance with chainable methods
 * 
 * @example
 * ```tsx
 * import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";
 * 
 * const fields = createBasicFormBuilder()
 *   .input("name", "Name")
 *   .input("email", "Email", "email")
 *   .textarea("message", "Message")
 *   .select("country", "Country", [
 *     { label: "US", value: "us" },
 *     { label: "CA", value: "ca" },
 *   ])
 *   .build();
 * ```
 * 
 * @see {@link createAdvancedBuilder} for more advanced features
 * @see {@link FormFieldHelpers} for helper function alternative
 * @category Builders
 */
export function createBasicFormBuilder(): BasicFormBuilder { ... }
```

### 3. Priority Files for JSDoc Addition

**High Priority (Most Used APIs):**

1. `src/components/ZodForm.tsx` - Main form component
2. `src/components/Form.tsx` - Base form component
3. `src/builders/index.ts` - Builder exports
4. `src/builders/BasicFormBuilder.ts` - Basic builder
5. `src/hooks/useFormHelper.ts` - Form helper hook
6. `src/utils/applyServerErrors.ts` - Server error utility
7. `src/index.ts` - Main entry point (add module-level docs)

**Medium Priority:**
8. `src/hooks/useHeroForm.ts`
9. `src/hooks/useEnhancedFormState.ts`
10. `src/hooks/useDebouncedValidation.ts`
11. `src/hooks/useInferredForm.ts`
12. `src/fields/*.tsx` - All field components
13. `src/utils/validation.ts` - Validation helpers

**Lower Priority:**
14. `src/components/FormStatus.tsx`
15. `src/components/ServerActionForm.tsx`
16. `src/utils/testing.ts`
17. `src/utils/performance.ts`

### 4. Module-Level Documentation

Add to `src/index.ts`:

```typescript
/**
 * @module @rachelallyson/hero-hook-form
 * 
 * # Hero Hook Form
 * 
 * Typed form helpers that combine React Hook Form and HeroUI components.
 * 
 * ## Quick Start
 * 
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 * 
 * const schema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 * 
 * function ContactForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.input("name", "Name"),
 *           FormFieldHelpers.input("email", "Email", "email"),
 *         ],
 *       }}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   );
 * }
 * ```
 * 
 * ## Key Features
 * 
 * - **Type Safety** - Full TypeScript support with automatic type inference
 * - **HeroUI Integration** - Beautiful, accessible components out of the box
 * - **Performance** - Optimized with React.memo and debounced validation
 * - **Flexible APIs** - Multiple form building patterns
 * - **Zod Integration** - Seamless schema validation
 * 
 * @packageDocumentation
 */
```

### 5. Category Tags

Use `@category` tags to organize exports:

- `@category Components` - React components
- `@category Hooks` - React hooks
- `@category Builders` - Builder classes and functions
- `@category Utilities` - Utility functions
- `@category Types` - Type definitions
- `@category Fields` - Field components

### 6. Cross-References

Use `@see` tags to link related APIs:

```typescript
/**
 * @see {@link ZodForm} for the Zod-integrated form component
 * @see {@link FormFieldHelpers} for field creation helpers
 * @see {@link createBasicFormBuilder} for builder pattern alternative
 */
```

### 7. Type Documentation

Document complex types:

```typescript
/**
 * Configuration for a Zod-based form.
 * 
 * @template T - The form data type inferred from the Zod schema
 * 
 * @property {ZodSchema<T>} schema - Zod schema for validation
 * @property {ZodFormFieldConfig<T>[]} fields - Array of field configurations
 * @property {Partial<T>} [defaultValues] - Optional default form values
 * @property {(errors: FieldErrors<T>) => void} [onError] - Error callback
 * 
 * @example
 * ```tsx
 * const config: ZodFormConfig<ContactForm> = {
 *   schema: contactSchema,
 *   fields: [
 *     FormFieldHelpers.input("name", "Name"),
 *     FormFieldHelpers.input("email", "Email", "email"),
 *   ],
 *   defaultValues: { name: "", email: "" },
 * };
 * ```
 */
export interface ZodFormConfig<T extends FieldValues> { ... }
```

## Implementation Steps

1. **Update `typedoc.json`** with improved configuration
2. **Add JSDoc to `src/index.ts`** (module-level documentation)
3. **Add JSDoc to high-priority files** (components, hooks, builders)
4. **Regenerate API docs**: `npm run docs:api`
5. **Review generated output** in `docs/content/api/`
6. **Iterate** - add more JSDoc as needed
7. **Add to CI** - ensure API docs are regenerated on source changes

## Testing the Generator

After adding JSDoc:

1. Run `npm run docs:api`
2. Check `docs/content/api/README.md` for main index
3. Verify examples appear in generated docs
4. Check categorization is working
5. Verify cross-references (`@see` tags) work
6. Test locally: `npm run docs:dev`

## Best Practices

1. **Always include examples** - Every public API should have `@example`
2. **Use TypeScript types** - TypeDoc will extract types automatically
3. **Link related APIs** - Use `@see` tags liberally
4. **Categorize everything** - Use `@category` tags
5. **Keep descriptions concise** - Brief summary, detailed in `@description`
6. **Document all parameters** - Use `@param` for every parameter
7. **Document return values** - Use `@returns` for functions
8. **Update when APIs change** - Keep JSDoc in sync with code

## Resources

- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [TypeDoc Plugin Markdown](https://github.com/tgreyuk/typedoc-plugin-markdown)
