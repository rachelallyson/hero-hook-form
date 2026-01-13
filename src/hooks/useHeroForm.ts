"use client";

import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useHeroHookFormDefaults } from "../providers/ConfigProvider";

/**
 * Enhanced hook that provides both form methods and styling defaults.
 *
 * @description
 * This hook combines React Hook Form's useFormContext with Hero Hook Form's
 * styling defaults, giving you access to both form functionality and
 * component styling in one convenient hook. Must be used within a FormProvider
 * context (provided by ZodForm, ConfigurableForm, or manual FormProvider).
 *
 * @template TFieldValues - The form data type
 *
 * @returns {Object} Enhanced form object with all React Hook Form methods and Hero Hook Form defaults
 * @returns {UseFormReturn<TFieldValues>} All React Hook Form methods (formState, getValues, setValue, etc.)
 * @returns {HeroHookFormDefaultsConfig} defaults - Hero Hook Form styling defaults
 *
 * @example
 * ```tsx
 * import { useHeroForm } from "@rachelallyson/hero-hook-form";
 *
 * function MyComponent() {
 *   const { formState, getValues, setValue, defaults } = useHeroForm();
 *
 *   // Access form state
 *   const isSubmitting = formState.isSubmitting;
 *   const errors = formState.errors;
 *
 *   // Access form methods
 *   const values = getValues();
 *   const handleReset = () => setValue('fieldName', '');
 *
 *   // Access styling defaults
 *   const inputDefaults = defaults.input;
 *   const buttonDefaults = defaults.submitButton;
 * }
 * ```
 *
 * @see {@link useFormHelper} for form state management with callbacks
 * @see {@link useFormContext} from React Hook Form for base functionality
 * @category Hooks
 */
export function useHeroForm<TFieldValues extends FieldValues>() {
  const form = useFormContext<TFieldValues>();
  const defaults = useHeroHookFormDefaults();

  return {
    // All React Hook Form methods and state
    ...form,
    // Hero Hook Form styling defaults
    defaults,
  };
}
