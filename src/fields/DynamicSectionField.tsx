"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";

import type { DynamicSectionConfig } from "../types";
import { FormField } from "../components/FormField";

export interface DynamicSectionFieldProps<TFieldValues extends FieldValues> {
  config: DynamicSectionConfig<TFieldValues>;
  control: Control<TFieldValues>;
  className?: string;
}

export function DynamicSectionField<TFieldValues extends FieldValues>({
  className,
  config,
  control,
}: DynamicSectionFieldProps<TFieldValues>) {
  const { condition, description, fields, title } = config;
  const form = useFormContext<TFieldValues>();

  // Watch all form values to determine if condition is met
  const formValues = useWatch({ control });

  // Check if condition is met
  const shouldShow = condition(formValues);

  // Don't render anything if condition is not met
  if (!shouldShow) {
    return null;
  }

  // Render the section with all fields when condition is met
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((fieldConfig, index) => (
          <FormField
            key={`${fieldConfig.name}-${index}`}
            config={fieldConfig as any}
            form={form}
            submissionState={{
              error: undefined,
              isSubmitted: false,
              isSubmitting: false,
              isSuccess: false,
            }}
          />
        ))}
      </div>
    </div>
  );
}
