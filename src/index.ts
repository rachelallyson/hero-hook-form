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
 * - **Flexible APIs** - Multiple form building patterns (helpers, builders, type-inferred)
 * - **Zod Integration** - Seamless schema validation with Zod
 * - **Dynamic Forms** - Conditional fields, field arrays, and dynamic sections
 * - **Testing Ready** - Built-in testing utilities for Cypress
 *
 * ## Form Building Patterns
 *
 * ### Helper Functions (Recommended)
 * ```tsx
 * const fields = [
 *   FormFieldHelpers.input("name", "Name"),
 *   FormFieldHelpers.textarea("message", "Message"),
 *   FormFieldHelpers.select("country", "Country", options),
 * ];
 * ```
 *
 * ### Builder Pattern
 * ```tsx
 * import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";
 *
 * const fields = createBasicFormBuilder()
 *   .input("name", "Name")
 *   .textarea("message", "Message")
 *   .select("country", "Country", options)
 *   .build();
 * ```
 *
 * ### Type-Inferred Forms
 * ```tsx
 * import { defineInferredForm, field } from "@rachelallyson/hero-hook-form";
 *
 * const form = defineInferredForm({
 *   name: field.string("Name"),
 *   email: field.email("Email"),
 *   age: field.number("Age"),
 * });
 * ```
 *
 * @packageDocumentation
 */

export * from "./components/Form.js";
export * from "./components/FormField.js";
export * from "./components/ServerActionForm.js";
export * from "./fields/AutocompleteField.js";
export * from "./fields/CheckboxField.js";
export * from "./fields/DateField.js";
export * from "./fields/FileField.js";
export * from "./fields/FontPickerField.js";
export * from "./fields/InputField.js";
export * from "./fields/RadioGroupField.js";
export * from "./fields/SelectField.js";
export * from "./fields/SliderField.js";
export * from "./fields/SwitchField.js";
export * from "./fields/TextareaField.js";
export * from "./hooks/useFormHelper.js";
export * from "./hooks/useHeroForm.js";
export * from "./providers/ConfigProvider.js";
export * from "./providers/FormProvider.js";
export * from "./submit/SubmitButton.js";
export * from "./types.js";
export * from "./utils/applyServerErrors.js";
export * from "./utils/testing.js";
export * from "./utils/validation.js";

// Re-export React Hook Form's useFormContext and UseFormReturn for convenient access
export { useFormContext, type UseFormReturn } from "react-hook-form";

// Zod integration (optional - requires zod and @hookform/resolvers to be installed)
export * from "./components/ZodForm.js";
export * from "./zod-integration.js";

// Form builders for easier form creation
export * from "./builders/index.js";

// Enhanced form state and hooks
export * from "./hooks/useEnhancedFormState.js";
export * from "./hooks/useDebouncedValidation.js";
export * from "./hooks/useInferredForm.js";

// Dynamic form components
export * from "./fields/ConditionalField.js";
export * from "./fields/ContentField.js";
export * from "./fields/FieldArrayField.js";
export * from "./fields/DynamicSectionField.js";

// Enhanced form components
export * from "./components/FormStatus.js";

// Performance utilities
export * from "./utils/performance.js";

// Enhanced validation patterns
export * from "./builders/validation-helpers.js";
export {
  createEmailSchema,
  createMinLengthSchema,
  createMaxLengthSchema,
  createRequiredSchema,
  createUrlSchema,
  createPhoneSchema,
  createPasswordSchema,
  createNumberRangeSchema,
  createPastDateSchema,
  createRequiredCheckboxSchema,
  crossFieldValidation,
} from "./utils/validation.js";
