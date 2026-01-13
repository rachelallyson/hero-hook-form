"use client";

import React from "react";

import { Button } from "@heroui/react";
import {
  FormProvider,
  type FieldErrors,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import type { FormValidationError, ZodFormConfig } from "../types";
import { useZodForm } from "../zod-integration";
import { useEnhancedFormState } from "../hooks/useEnhancedFormState";
import { FormStatus } from "./FormStatus";

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
  const enhancedState = useEnhancedFormState(form, {
    autoReset: true,
    onError: (error: string) => onError?.({ field: "form", message: error }),
    onSuccess: onSuccess,
    resetDelay: 3000,
  });

  const handleSubmit = async () => {
    try {
      // Use React Hook Form's built-in validation
      await form.handleSubmit(
        async (formData) => {
          // Success handler - form is valid
          await onSubmit(formData);
          enhancedState.handleSuccess(formData);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_errors) => {
          // Error handler - form has validation errors
          enhancedState.handleError("Please fix the validation errors above");
        },
      )();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      enhancedState.handleError(errorMessage);
    }
  };

  const resetForm = () => {
    form.reset();
    enhancedState.reset();
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
              submissionState={{
                error: enhancedState.error,
                isSubmitted: enhancedState.status !== "idle",
                isSubmitting: enhancedState.isSubmitting,
                isSuccess: enhancedState.isSuccess,
              }}
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
              submissionState={{
                error: enhancedState.error,
                isSubmitted: enhancedState.status !== "idle",
                isSubmitting: enhancedState.isSubmitting,
                isSuccess: enhancedState.isSuccess,
              }}
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
            submissionState={{
              error: enhancedState.error,
              isSubmitted: enhancedState.status !== "idle",
              isSubmitting: enhancedState.isSubmitting,
              isSuccess: enhancedState.isSuccess,
            }}
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
    return (
      <FormProvider {...form}>
        {render({
          errors: form.formState.errors,
          form,
          isSubmitted: enhancedState.status !== "idle",
          isSubmitting: enhancedState.isSubmitting,
          isSuccess: enhancedState.isSuccess,
          values: form.getValues(),
        })}
      </FormProvider>
    );
  }

  return (
    <FormProvider {...form}>
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

        {/* Enhanced Form Status */}
        <FormStatus
          state={enhancedState}
          onDismiss={() => enhancedState.reset()}
          showDetails={true}
        />

        {/* Form Fields */}
        {renderFields()}

        {/* Submit Button */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            color="primary"
            isDisabled={enhancedState.isSubmitting}
            isLoading={enhancedState.isSubmitting}
            type="submit"
            {...submitButtonProps}
          >
            {enhancedState.isSuccess ? "Success!" : submitButtonText}
          </Button>

          {showResetButton && (
            <Button
              isDisabled={enhancedState.isSubmitting}
              type="button"
              variant="bordered"
              onPress={resetForm}
            >
              {resetButtonText}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
