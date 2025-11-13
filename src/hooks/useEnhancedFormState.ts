"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

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
