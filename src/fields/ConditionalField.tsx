"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

import type { ConditionalFieldConfig, ZodFormFieldConfig } from "../types";
import { FormField } from "../components/FormField";

export interface ConditionalFieldProps<TFieldValues extends FieldValues> {
  config: ConditionalFieldConfig<TFieldValues>;
  control: Control<TFieldValues>;
  className?: string;
}

export function ConditionalField<TFieldValues extends FieldValues>({
  config,
  control,
  className,
}: ConditionalFieldProps<TFieldValues>) {
  const { condition, field, name } = config;
  const form = useFormContext<TFieldValues>();
  
  // Watch all form values to determine if condition is met
  const formValues = useWatch({ control });
  
  // Check if condition is met
  const shouldShow = condition(formValues);
  
  // Don't render anything if condition is not met
  if (!shouldShow) {
    return null;
  }
  
  // Render the child field when condition is met
  return (
    <div className={className}>
      <FormField
        config={field as any}
        form={form}
        submissionState={{
          isSubmitting: false,
          isSubmitted: false,
          isSuccess: false,
          error: undefined,
        }}
      />
    </div>
  );
}
