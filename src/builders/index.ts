/**
 * @module Builders
 *
 * Form builders for creating form field configurations.
 *
 * This module provides multiple patterns for building forms:
 * - **Helper Functions** (`FormFieldHelpers`) - Simple, recommended approach
 * - **Basic Builder** (`createBasicFormBuilder`) - Fluent API for simple forms
 * - **Advanced Builder** (`createAdvancedBuilder`) - More features and flexibility
 * - **Type-Inferred Builder** (`defineInferredForm`) - Automatic schema generation
 *
 * @category Builders
 */

// Export basic builder utilities (for simple forms)
export * from "./BasicFormBuilder";

// Export advanced field builder (recommended for all field types)
export * from "./AdvancedFormBuilder";

// Export type-inferred builder (alternative API)
export * from "./TypeInferredBuilder";

// Re-export for convenience
export {
  createBasicFormBuilder,
  FormFieldHelpers,
  CommonFields,
} from "./BasicFormBuilder";
export {
  createField,
  createAdvancedBuilder,
  createFieldArrayItemBuilder,
  createFieldArrayBuilder,
} from "./AdvancedFormBuilder";
export {
  createTypeInferredBuilder,
  defineInferredForm,
  field,
} from "./TypeInferredBuilder";
export { createNestedPathBuilder } from "./NestedPathBuilder";
