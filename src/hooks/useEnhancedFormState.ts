"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldErrors, FieldValues, Path, UseFormReturn } from "react-hook-form";

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

export interface UseEnhancedFormStateOptions<T extends FieldValues> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  autoReset?: boolean;
  resetDelay?: number;
}

export function useEnhancedFormState<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: UseEnhancedFormStateOptions<T> = {}
): EnhancedFormState<T> {
  const {
    onSuccess,
    onError,
    successMessage = "Form submitted successfully!",
    errorMessage = "An error occurred. Please try again.",
    autoReset = true,
    resetDelay = 3000,
  } = options;

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [submittedData, setSubmittedData] = useState<T | undefined>(undefined);

  const { formState, getValues } = form;
  const { errors, touchedFields, dirtyFields, isSubmitting } = formState;

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

  const handleSuccess = useCallback((data: T) => {
    setStatus("success");
    setSubmittedData(data);
    setError(undefined);
    onSuccess?.(data);
  }, [onSuccess]);

  const handleError = useCallback((errorMessage: string) => {
    setStatus("error");
    setError(errorMessage);
    setSubmittedData(undefined);
    onError?.(errorMessage);
  }, [onError]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(undefined);
    setSubmittedData(undefined);
  }, []);

  return {
    status,
    isSubmitting,
    isSuccess: status === "success",
    isError: status === "error",
    error,
    submittedData,
    touchedFields: new Set(Object.keys(touchedFields)) as Set<Path<T>>,
    dirtyFields: new Set(Object.keys(dirtyFields)) as Set<Path<T>>,
    hasErrors: Object.keys(errors).length > 0,
    errorCount: Object.keys(errors).length,
    handleSuccess,
    handleError,
    reset,
  };
}
