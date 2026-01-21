"use client";

import { useForm } from "react-hook-form";
// Optional import - will be undefined if not installed
let zodResolver: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  zodResolver = require("@hookform/resolvers/zod").zodResolver;
} catch {
  // zodResolver will be undefined if not installed
}
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import type { ZodFormFieldConfig } from "../types";

/**
 * Options for the useInferredForm hook.
 *
 * @template T - The form data type
 */
export interface UseInferredFormOptions<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  delayError?: number;
}

/**
 * Hook for creating a form instance from an inferred form configuration.
 *
 * @description
 * Creates a React Hook Form instance with Zod validation resolver
 * from a type-inferred form configuration. Automatically sets up
 * validation based on the provided schema and fields.
 *
 * @template T - The form data type
 *
 * @param {any} schema - Zod schema for validation
 * @param {ZodFormFieldConfig<T>[]} fields - Field configurations
 * @param {UseInferredFormOptions<T>} [options] - Form options
 * @param {Partial<T>} [options.defaultValues] - Default form values
 * @param {"onChange"|"onBlur"|"onSubmit"|"onTouched"|"all"} [options.mode="onChange"] - Validation mode
 * @param {"onChange"|"onBlur"|"onSubmit"} [options.reValidateMode="onChange"] - Re-validation mode
 * @param {boolean} [options.shouldFocusError=true] - Focus first error field
 * @param {boolean} [options.shouldUnregister=false] - Unregister fields on unmount
 * @param {number} [options.delayError=0] - Delay before showing errors
 *
 * @returns {UseFormReturn<T>} React Hook Form instance
 *
 * @example
 * ```tsx
 * import { useInferredForm, defineInferredForm, field } from "@rachelallyson/hero-hook-form";
 *
 * const formConfig = defineInferredForm({
 *   name: field.string("Name").min(2),
 *   email: field.email("Email"),
 * });
 *
 * function MyForm() {
 *   const form = useInferredForm(
 *     formConfig.schema,
 *     formConfig.fields,
 *     { mode: "onBlur" }
 *   );
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(handleSubmit)}>
 *       {/* form fields *\/}
 *     </form>
 *   );
 * }
 * ```
 *
 * @see {@link defineInferredForm} for creating type-inferred form configurations
 * @see {@link useTypeInferredForm} for alternative API
 * @category Hooks
 */
export function useInferredForm<T extends FieldValues>(
  schema: any,
  fields: ZodFormFieldConfig<T>[],
  options: UseInferredFormOptions<T> = {},
): UseFormReturn<T> {
  const {
    defaultValues,
    delayError = 0,
    mode = "onChange",
    reValidateMode = "onChange",
    shouldFocusError = true,
    shouldUnregister = false,
  } = options;

  return useForm<T>({
    defaultValues,
    delayError,
    mode,
    resolver: zodResolver ? zodResolver(schema) : undefined,
    reValidateMode,
    shouldFocusError,
    shouldUnregister,
  });
}

/**
 * Hook that works with type-inferred form configurations.
 *
 * @description
 * Alternative API for useInferredForm that accepts a form configuration
 * object instead of separate schema and fields parameters. Useful when
 * working with defineInferredForm results.
 *
 * @template T - The form data type
 *
 * @param {Object} formConfig - Form configuration object
 * @param {any} formConfig.schema - Zod schema for validation
 * @param {ZodFormFieldConfig<T>[]} formConfig.fields - Field configurations
 * @param {UseInferredFormOptions<T>} [options] - Form options
 *
 * @returns {UseFormReturn<T>} React Hook Form instance
 *
 * @example
 * ```tsx
 * import { useTypeInferredForm, defineInferredForm, field } from "@rachelallyson/hero-hook-form";
 *
 * const formConfig = defineInferredForm({
 *   name: field.string("Name").min(2),
 *   email: field.email("Email"),
 * });
 *
 * function MyForm() {
 *   const form = useTypeInferredForm(formConfig);
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(handleSubmit)}>
 *       {/* form fields *\/}
 *     </form>
 *   );
 * }
 * ```
 *
 * @see {@link useInferredForm} for direct schema/fields API
 * @see {@link defineInferredForm} for creating type-inferred form configurations
 * @category Hooks
 */
export function useTypeInferredForm<T extends FieldValues>(
  formConfig: {
    schema: any;
    fields: ZodFormFieldConfig<T>[];
  },
  options: UseInferredFormOptions<T> = {},
): UseFormReturn<T> {
  return useInferredForm(formConfig.schema, formConfig.fields, options);
}
