"use client";

import React from "react";

import type { FieldValues, UseFormReturn } from "react-hook-form";

import type { ContentFieldConfig, FormSubmissionState } from "../types";

interface ContentFieldProps<TFieldValues extends FieldValues> {
  config: ContentFieldConfig<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  submissionState: FormSubmissionState;
}

export function ContentField<TFieldValues extends FieldValues>({
  config,
  form,
  submissionState,
}: ContentFieldProps<TFieldValues>) {
  // If custom render function is provided, use it
  if (config.render) {
    return (
      <div className={config.className}>
        {config.render({
          errors: form.formState.errors,
          form,
          isSubmitting: submissionState.isSubmitting,
        })}
      </div>
    );
  }

  // Otherwise, render title and/or description
  return (
    <div className={config.className}>
      {config.title && (
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {config.title}
        </h3>
      )}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}
