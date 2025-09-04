"use client";

import React from "react";

import { Button } from "@heroui/react";
import type {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import type { FormValidationError, ZodFormConfig } from "../types";
import { useZodForm } from "../zod-integration";

import { FormField } from "./FormField";

interface ZodFormProps<T extends FieldValues> {
  className?: string;
  columns?: 1 | 2 | 3;
  config: ZodFormConfig<T>;
  layout?: "vertical" | "horizontal" | "grid";
  onError?: (error: FormValidationError) => void;
  onSubmit: SubmitHandler<T>;
  onSuccess?: (data: T) => void;
  resetButtonText?: string;
  showResetButton?: boolean;
  spacing?: "2" | "4" | "6" | "8" | "lg";
  submitButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  submitButtonText?: string;
  subtitle?: string;
  title?: string;
  // Enhanced error handling
  errorDisplay?: "inline" | "toast" | "modal" | "none";
  // Form state access
  render?: (formState: {
    form: UseFormReturn<T>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    isSuccess: boolean;
    errors: FieldErrors<T>;
    values: T;
  }) => React.ReactNode;
}

export function ZodForm<T extends FieldValues>({
  className,
  columns = 1,
  config,
  errorDisplay = "inline",
  layout = "vertical",
  onError,
  onSubmit,
  onSuccess,
  render,
  resetButtonText = "Reset",
  showResetButton = false,
  spacing = "4",
  submitButtonProps = {},
  submitButtonText = "Submit",
  subtitle,
  title,
}: ZodFormProps<T>) {
  const form = useZodForm(config);
  const [submissionState, setSubmissionState] = React.useState({
    error: undefined as string | undefined,
    isSubmitted: false,
    isSubmitting: false,
    isSuccess: false,
  });

  const handleSubmit = async () => {
    setSubmissionState((prev) => ({
      ...prev,
      error: undefined,
      isSubmitting: true,
    }));

    // Check if form is valid before proceeding
    const isValid = await form.trigger();

    if (!isValid) {
      setSubmissionState({
        error: "Please fix the validation errors above",
        isSubmitted: true,
        isSubmitting: false,
        isSuccess: false,
      });

      return;
    }

    try {
      await form.handleSubmit(async (formData) => {
        await onSubmit(formData);
      })();

      setSubmissionState({
        error: undefined,
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
      error: undefined,
      isSubmitted: false,
      isSubmitting: false,
      isSuccess: false,
    });
  };

  const renderFields = () => {
    if (layout === "grid") {
      return (
        <div
          className={`grid gap-${spacing} ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {config.fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={submissionState}
            />
          ))}
        </div>
      );
    }

    if (layout === "horizontal") {
      return (
        <div className={`grid gap-${spacing} grid-cols-1 md:grid-cols-2`}>
          {config.fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={submissionState}
            />
          ))}
        </div>
      );
    }

    // Vertical layout (default)
    return (
      <div className={`space-y-${spacing}`}>
        {config.fields.map((field) => (
          <FormField
            key={field.name as string}
            config={field}
            form={form}
            submissionState={submissionState}
          />
        ))}
      </div>
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit();
  };

  // Enhanced error handling
  React.useEffect(() => {
    if (config.onError && Object.keys(form.formState.errors).length > 0) {
      config.onError(form.formState.errors);
    }
  }, [form.formState.errors, config.onError]);

  // Custom render function
  if (render) {
    return render({
      errors: form.formState.errors,
      form,
      isSubmitted: submissionState.isSubmitted,
      isSubmitting: submissionState.isSubmitting,
      isSuccess: submissionState.isSuccess,
      values: form.getValues(),
    });
  }

  return (
    <form className={className} role="form" onSubmit={handleFormSubmit}>
      {/* Title and Subtitle */}
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Success Message */}
      {submissionState.isSubmitted && submissionState.isSuccess && (
        <div
          className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg"
          data-testid="success-message"
        >
          <p className="text-success-800 font-medium">Success!</p>
          <p className="text-success-700 text-sm mt-1">
            Your request has been processed successfully.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submissionState.error && errorDisplay !== "none" && (
        <div
          className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
          data-testid="error-message"
        >
          <p className="text-danger-800 font-medium">Error</p>
          <p className="text-danger-700 text-sm mt-1">
            {submissionState.error}
          </p>
        </div>
      )}

      {/* Form Fields */}
      {renderFields()}

      {/* Submit Button */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button
          color="primary"
          isDisabled={submissionState.isSubmitting}
          isLoading={submissionState.isSubmitting}
          type="submit"
          {...submitButtonProps}
        >
          {submitButtonText}
        </Button>

        {showResetButton && (
          <Button
            isDisabled={submissionState.isSubmitting}
            type="button"
            variant="bordered"
            onPress={resetForm}
          >
            {resetButtonText}
          </Button>
        )}
      </div>
    </form>
  );
}
