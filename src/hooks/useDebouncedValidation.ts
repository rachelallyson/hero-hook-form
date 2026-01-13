"use client";

import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Options for the useDebouncedValidation hook.
 */
export interface UseDebouncedValidationOptions {
  delay?: number;
  fields?: string[];
  enabled?: boolean;
}

/**
 * Hook for debouncing form validation to improve performance.
 *
 * @description
 * Delays validation until the user stops typing, reducing unnecessary
 * validation calls and improving form performance. Useful for forms with
 * expensive validation logic or many fields.
 *
 * @template T - The form data type
 *
 * @param {UseFormReturn<T>} form - React Hook Form instance
 * @param {UseDebouncedValidationOptions} [options] - Configuration options
 * @param {number} [options.delay=300] - Delay in milliseconds before validation
 * @param {string[]} [options.fields] - Specific fields to watch (if not provided, watches all)
 * @param {boolean} [options.enabled=true] - Whether debouncing is enabled
 *
 * @returns {Object} Debounced validation utilities
 * @returns {() => void} debouncedTrigger - Function to trigger debounced validation
 * @returns {boolean} isDebouncing - Whether validation is currently debouncing
 *
 * @example
 * ```tsx
 * import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * function MyForm() {
 *   const form = useForm();
 *   const { debouncedTrigger, isDebouncing } = useDebouncedValidation(form, {
 *     delay: 500,
 *     fields: ["email", "username"], // Only watch these fields
 *   });
 *
 *   return (
 *     <form>
 *       <input
 *         {...form.register("email")}
 *         onChange={(e) => {
 *           form.setValue("email", e.target.value);
 *           debouncedTrigger();
 *         }}
 *       />
 *       {isDebouncing && <span>Validating...</span>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @see {@link useDebouncedFieldValidation} for single field debouncing
 * @category Hooks
 */
export function useDebouncedValidation<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseDebouncedValidationOptions = {},
) {
  const { delay = 300, enabled = true, fields } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const lastValuesRef = useRef<Partial<T>>({});

  const debouncedTrigger = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      const currentValues = form.getValues();
      const lastValues = lastValuesRef.current;

      // Check if any watched fields have changed
      const hasChanges = fields
        ? fields.some((field) => currentValues[field] !== lastValues[field])
        : Object.keys(currentValues).some(
            (key) => currentValues[key] !== lastValues[key],
          );

      if (hasChanges) {
        // Update last values
        lastValuesRef.current = { ...currentValues };

        // Trigger validation for specific fields or all fields
        if (fields && fields.length > 0) {
          await form.trigger(fields as any);
        } else {
          await form.trigger();
        }
      }
    }, delay);
  }, [form, delay, fields, enabled]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  // Reset when form is reset
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      lastValuesRef.current = {};
    }
  }, [form.formState.isSubmitSuccessful]);

  return {
    debouncedTrigger,
    isDebouncing: !!timeoutRef.current,
  };
}

/**
 * Hook for debouncing validation of a single field.
 *
 * @description
 * Similar to useDebouncedValidation but optimized for a single field.
 * Automatically triggers validation when the specified field changes.
 *
 * @template T - The form data type
 *
 * @param {UseFormReturn<T>} form - React Hook Form instance
 * @param {keyof T} fieldName - Name of the field to debounce
 * @param {Object} [options] - Configuration options
 * @param {number} [options.delay=300] - Delay in milliseconds before validation
 * @param {boolean} [options.enabled=true] - Whether debouncing is enabled
 *
 * @returns {Object} Debounced field validation utilities
 * @returns {() => void} debouncedFieldTrigger - Function to trigger debounced validation for this field
 * @returns {boolean} isDebouncing - Whether validation is currently debouncing
 *
 * @example
 * ```tsx
 * import { useDebouncedFieldValidation } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * function MyForm() {
 *   const form = useForm();
 *   const { debouncedFieldTrigger, isDebouncing } = useDebouncedFieldValidation(
 *     form,
 *     "email",
 *     { delay: 500 }
 *   );
 *
 *   return (
 *     <input
 *       {...form.register("email")}
 *       onChange={(e) => {
 *         form.setValue("email", e.target.value);
 *         debouncedFieldTrigger();
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link useDebouncedValidation} for multiple fields
 * @category Hooks
 */
export function useDebouncedFieldValidation<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  options: { delay?: number; enabled?: boolean } = {},
) {
  const { delay = 300, enabled = true } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const debouncedFieldTrigger = useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await form.trigger(fieldName as any);
    }, delay);
  }, [form, fieldName, delay, enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  return {
    debouncedFieldTrigger,
    isDebouncing: !!timeoutRef.current,
  };
}
