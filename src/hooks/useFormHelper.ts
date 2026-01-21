"use client";

import { useState } from "react";
import type {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import type { FormSubmissionState, FormValidationError } from "../types";

/**
 * Options for the useFormHelper hook.
 *
 * @template T - The form data type
 */
interface UseFormHelperOptions<T extends FieldValues> {
  onError?: (error: FormValidationError) => void;
  onSubmit: SubmitHandler<T>;
  onSuccess?: (data: T) => void;
  // DefaultValues<T> is more specific than Partial<T>, but useForm accepts both
  defaultValues?: DefaultValues<T>;
  methods?: UseFormReturn<T>;
}

/**
 * Hook for managing form state with enhanced features.
 *
 * @description
 * Provides form state management with loading states, error handling,
 * and submission tracking. Automatically handles form validation and
 * provides callbacks for success and error cases. This hook wraps
 * React Hook Form's useForm with additional state management.
 *
 * @template T - The form data type
 *
 * @param {UseFormHelperOptions<T>} options - Hook options
 * @param {Partial<T>} [options.defaultValues] - Default form values
 * @param {UseFormReturn<T>} [options.methods] - Optional existing form instance
 * @param {SubmitHandler<T>} options.onSubmit - Submit handler function
 * @param {(error: FormValidationError) => void} [options.onError] - Error handler callback
 * @param {(data: T) => void} [options.onSuccess] - Success handler callback
 *
 * @returns {Object} Form helper with state and methods
 * @returns {UseFormReturn<T>} form - React Hook Form instance
 * @returns {() => Promise<void>} handleSubmit - Submit handler function
 * @returns {() => void} resetForm - Reset form function
 * @returns {boolean} isSubmitting - Whether form is currently submitting
 * @returns {boolean} isSubmitted - Whether form has been submitted
 * @returns {boolean} isSuccess - Whether last submission was successful
 * @returns {string|undefined} error - Error message if submission failed
 * @returns {FormSubmissionState} submissionState - Complete submission state object
 *
 * @example
 * ```tsx
 * import { useFormHelper } from "@rachelallyson/hero-hook-form";
 *
 * function MyForm() {
 *   const { form, handleSubmit, isSubmitting, error } = useFormHelper({
 *     defaultValues: { email: "", name: "" },
 *     onSubmit: async (data) => {
 *       await submitToServer(data);
 *     },
 *     onError: (error) => {
 *       console.error("Validation errors:", error);
 *     },
 *     onSuccess: (data) => {
 *       console.log("Success:", data);
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
 *       <button disabled={isSubmitting}>
 *         {isSubmitting ? "Submitting..." : "Submit"}
 *       </button>
 *       {error && <div className="error">{error}</div>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * Using with existing form instance:
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { useFormHelper } from "@rachelallyson/hero-hook-form";
 *
 * function MyForm() {
 *   const existingForm = useForm({ defaultValues: { email: "" } });
 *   const { handleSubmit, isSubmitting } = useFormHelper({
 *     methods: existingForm,
 *     onSubmit: async (data) => {
 *       await submitToServer(data);
 *     },
 *   });
 *
 *   // Use existingForm and handleSubmit together
 * }
 * ```
 *
 * @see {@link useHeroForm} for alternative hook with different API
 * @see {@link ConfigurableForm} for component that uses this hook
 * @category Hooks
 */
export function useFormHelper<T extends FieldValues>({
  defaultValues,
  methods,
  onError,
  onSubmit,
  onSuccess,
}: UseFormHelperOptions<T>) {
  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitted: false,
    isSubmitting: false,
    isSuccess: false,
  });

  // useForm returns UseFormReturn<T, any, T> which is compatible with UseFormReturn<T>
  const form: UseFormReturn<T> =
    (methods as UseFormReturn<T>) ??
    useForm<T>({
      ...(defaultValues && { defaultValues }),
    });

  const handleSubmit = async () => {
    setSubmissionState((prev) => ({
      ...prev,
      error: undefined,
      isSubmitting: true,
    }));

    try {
      await form.handleSubmit(async (formData: T) => {
        await onSubmit(formData);
      })();

      setSubmissionState({
        isSubmitted: true,
        isSubmitting: false,
        isSuccess: true,
      });

      onSuccess?.(form.getValues());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      setSubmissionState({
        error: errorMessage,
        isSubmitted: true,
        isSubmitting: false,
        isSuccess: false,
      });

      onError?.({
        message: errorMessage,
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setSubmissionState({
      isSubmitted: false,
      isSubmitting: false,
      isSuccess: false,
    });
  };

  return {
    error: submissionState.error,
    // useForm returns UseFormReturn<T, any, T> which is structurally compatible with UseFormReturn<T>
    form: form as UseFormReturn<T>,
    handleSubmit,
    isSubmitted: submissionState.isSubmitted,
    isSubmitting: submissionState.isSubmitting,
    isSuccess: submissionState.isSuccess,
    resetForm,
    submissionState,
  };
}
