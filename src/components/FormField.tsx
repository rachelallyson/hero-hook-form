"use client";

import React from "react";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { CheckboxField } from "../fields/CheckboxField";
import { DateField } from "../fields/DateField";
import { FileField } from "../fields/FileField";
import { FontPickerField } from "../fields/FontPickerField";
import { InputField } from "../fields/InputField";
import { RadioGroupField } from "../fields/RadioGroupField";
import { SelectField } from "../fields/SelectField";
import { SliderField } from "../fields/SliderField";
import { SwitchField } from "../fields/SwitchField";
import { TextareaField } from "../fields/TextareaField";
import type { FormFieldConfig, FormSubmissionState } from "../types";

interface FormFieldProps<TFieldValues extends FieldValues> {
  config: FormFieldConfig<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  submissionState: FormSubmissionState;
}

export function FormField<TFieldValues extends FieldValues>({
  config,
  form,
  submissionState,
}: FormFieldProps<TFieldValues>) {
  const { control } = form;
  const watchedValues = useWatch({ control });

  // Handle conditional rendering
  if (config.condition && !config.condition(watchedValues)) {
    return null;
  }

  // Handle dependency-based conditional rendering
  if (config.dependsOn) {
    const dependentValue = watchedValues[config.dependsOn];

    if (
      config.dependsOnValue !== undefined &&
      dependentValue !== config.dependsOnValue
    ) {
      return null;
    }
  }

  const baseProps = {
    ariaDescribedBy: config.ariaDescribedBy,
    ariaLabel: config.ariaLabel,
    className: config.className,
    description: config.description,
    isDisabled: config.isDisabled ?? submissionState.isSubmitting,
    label: config.label,
    name: config.name,
    rules: config.rules,
  };

  switch (config.type) {
    case "input":
      return (
        <InputField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          inputProps={config.inputProps}
        />
      );

    case "textarea":
      return (
        <TextareaField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          textareaProps={config.textareaProps}
        />
      );

    case "select":
      return (
        <SelectField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          options={(config.options ?? []).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
          selectProps={config.selectProps}
        />
      );

    case "checkbox":
      return (
        <CheckboxField<TFieldValues>
          {...baseProps}
          checkboxProps={config.checkboxProps}
          control={control}
          defaultValue={config.defaultValue}
        />
      );

    case "radio":
      return (
        <RadioGroupField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          options={(config.radioOptions ?? []).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
          radioGroupProps={config.radioProps}
        />
      );

    case "switch":
      return (
        <SwitchField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          switchProps={config.switchProps}
        />
      );

    case "slider":
      return (
        <SliderField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          sliderProps={config.sliderProps}
        />
      );

    case "date":
      return (
        <DateField<TFieldValues>
          {...baseProps}
          control={control}
          dateProps={config.dateProps}
          defaultValue={config.defaultValue}
        />
      );

    case "file":
      return (
        <FileField<TFieldValues>
          {...baseProps}
          accept={config.accept}
          control={control}
          defaultValue={config.defaultValue}
          fileProps={config.fileProps}
          multiple={config.multiple}
        />
      );

    case "fontPicker":
      return (
        <FontPickerField<TFieldValues>
          {...baseProps}
          control={control}
          defaultValue={config.defaultValue}
          fontPickerProps={config.fontPickerProps}
        />
      );

    case "custom":
      return config.render({
        control,
        errors: form.formState.errors,
        form,
        isSubmitting: submissionState.isSubmitting,
        name: config.name,
      });

    default: {
      const fieldType = (config as { type: string }).type;

      console.warn(`Unknown field type: ${fieldType}`);

      return null;
    }
  }
}
