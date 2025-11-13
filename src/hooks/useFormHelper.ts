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

interface UseFormHelperOptions<T extends FieldValues> {
  onError?: (error: FormValidationError) => void;
  onSubmit: SubmitHandler<T>;
  onSuccess?: (data: T) => void;
  defaultValues?: Partial<T>;
  methods?: UseFormReturn<T>;
}

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

  const form =
    methods ?? useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });

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
    form,
    handleSubmit,
    isSubmitted: submissionState.isSubmitted,
    isSubmitting: submissionState.isSubmitting,
    isSuccess: submissionState.isSuccess,
    resetForm,
    submissionState,
  };
}
