"use client";

import { useFormContext } from "react-hook-form";

import type { FieldValues } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";

/**
 * Enhanced hook that provides both form methods and styling defaults
 * 
 * This hook combines React Hook Form's useFormContext with Hero Hook Form's
 * styling defaults, giving you access to both form functionality and
 * component styling in one convenient hook.
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
