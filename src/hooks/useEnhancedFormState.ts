"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/**
 * Enhanced form state with submission tracking and error management.
 *
 * @template T - The form data type
 */
export interface EnhancedFormState<T extends FieldValues> {
  status: "idle" | "submitting" | "success" | "error";
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  submittedData?: T;
  touchedFields: Set<Path<T>>;
  dirtyFields: Set<Path<T>>;
  hasErrors: boolean;
  errorCount: number;
  handleSuccess: (data: T) => void;
  handleError: (error: string) => void;
  reset: () => void;
}

/**
 * Options for the useEnhancedFormState hook.
 *
 * @template T - The form data type
 */
export interface UseEnhancedFormStateOptions<T extends FieldValues> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  autoReset?: boolean;
  resetDelay?: number;
}

/**
 * Hook for managing enhanced form state with submission tracking.
 *
 * @description
 * Provides advanced form state management including submission status,
 * error tracking, touched/dirty field tracking, and automatic reset
 * functionality. Useful for building forms with rich UI feedback.
 *
 * @template T - The form data type
 *
 * @param {UseFormReturn<T>} form - React Hook Form instance
 * @param {UseEnhancedFormStateOptions<T>} [options] - Configuration options
 * @param {(data: T) => void} [options.onSuccess] - Success callback
 * @param {(error: string) => void} [options.onError] - Error callback
 * @param {string} [options.successMessage] - Custom success message
 * @param {string} [options.errorMessage] - Custom error message
 * @param {boolean} [options.autoReset=true] - Automatically reset after success
 * @param {number} [options.resetDelay=3000] - Delay before auto-reset (ms)
 *
 * @returns {EnhancedFormState<T>} Enhanced form state object
 * @returns {"idle"|"submitting"|"success"|"error"} status - Current submission status
 * @returns {boolean} isSubmitting - Whether form is currently submitting
 * @returns {boolean} isSuccess - Whether last submission was successful
 * @returns {boolean} isError - Whether last submission had an error
 * @returns {string|undefined} error - Error message if submission failed
 * @returns {T|undefined} submittedData - Data from last successful submission
 * @returns {Set<Path<T>>} touchedFields - Set of touched field paths
 * @returns {Set<Path<T>>} dirtyFields - Set of dirty field paths
 * @returns {boolean} hasErrors - Whether form has validation errors
 * @returns {number} errorCount - Number of validation errors
 * @returns {(data: T) => void} handleSuccess - Function to mark submission as successful
 * @returns {(error: string) => void} handleError - Function to mark submission as failed
 * @returns {() => void} reset - Function to reset state to idle
 *
 * @example
 * ```tsx
 * import { useEnhancedFormState } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * function MyForm() {
 *   const form = useForm();
 *   const state = useEnhancedFormState(form, {
 *     onSuccess: (data) => {
 *       console.log("Success:", data);
 *     },
 *     onError: (error) => {
 *       console.error("Error:", error);
 *     },
 *     autoReset: true,
 *     resetDelay: 3000,
 *   });
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitToServer(data);
 *       state.handleSuccess(data);
 *     } catch (error) {
 *       state.handleError(error.message);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(handleSubmit)}>
 *       {/* form fields *\/}
 *       {state.isSubmitting && <div>Submitting...</div>}
 *       {state.isSuccess && <div>Success!</div>}
 *       {state.error && <div>Error: {state.error}</div>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @see {@link ZodForm} which uses this hook internally
 * @category Hooks
 */
export function useEnhancedFormState<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: UseEnhancedFormStateOptions<T> = {},
): EnhancedFormState<T> {
  const {
    autoReset = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMessage: _errorMessage = "An error occurred. Please try again.",
    onError,
    onSuccess,
    resetDelay = 3000,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    successMessage: _successMessage = "Form submitted successfully!",
  } = options;

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [submittedData, setSubmittedData] = useState<T | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formState, getValues: _getValues } = form;
  const { dirtyFields, errors, isSubmitting, touchedFields } = formState;

  // Update submission state
  useEffect(() => {
    if (isSubmitting) {
      setStatus("submitting");
    }
  }, [isSubmitting]);

  // Auto-reset after success
  useEffect(() => {
    if (status === "success" && autoReset) {
      const timer = setTimeout(() => {
        setStatus("idle");
        setSubmittedData(undefined);
        setError(undefined);
      }, resetDelay);

      return () => clearTimeout(timer);
    }
  }, [status, autoReset, resetDelay]);

  const handleSuccess = useCallback(
    (data: T) => {
      setStatus("success");
      setSubmittedData(data);
      setError(undefined);
      onSuccess?.(data);
    },
    [onSuccess],
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      setStatus("error");
      setError(errorMessage);
      setSubmittedData(undefined);
      onError?.(errorMessage);
    },
    [onError],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(undefined);
    setSubmittedData(undefined);
  }, []);

  return {
    dirtyFields: new Set(Object.keys(dirtyFields)) as Set<Path<T>>,
    error,
    errorCount: Object.keys(errors).length,
    handleError,
    handleSuccess,
    hasErrors: Object.keys(errors).length > 0,
    isError: status === "error",
    isSubmitting,
    isSuccess: status === "success",
    reset,
    status,
    submittedData,
    touchedFields: new Set(Object.keys(touchedFields)) as Set<Path<T>>,
  };
}
