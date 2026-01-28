"use client";

import React from "react";

import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { get, useWatch } from "react-hook-form";

import { AutocompleteField } from "../fields/AutocompleteField";
import { CheckboxField } from "../fields/CheckboxField";
import { CheckboxGroupField } from "../fields/CheckboxGroupField";
import { ConditionalField } from "../fields/ConditionalField";
import { ContentField } from "../fields/ContentField";
import { DateField } from "../fields/DateField";
import { DynamicSectionField } from "../fields/DynamicSectionField";
import { FieldArrayField } from "../fields/FieldArrayField";
import { FileField } from "../fields/FileField";
import { FontPickerField } from "../fields/FontPickerField";
import { InputField } from "../fields/InputField";
import { RadioGroupField } from "../fields/RadioGroupField";
import { SelectField } from "../fields/SelectField";
import { SliderField } from "../fields/SliderField";
import { StringArrayField } from "../fields/StringArrayField";
import { SwitchField } from "../fields/SwitchField";
import { TextareaField } from "../fields/TextareaField";
import type {
  ConditionalFieldConfig,
  DynamicSectionConfig,
  FieldArrayConfig,
  FormFieldConfig,
  FormSubmissionState,
  ZodFormFieldConfig,
} from "../types";

interface FormFieldProps<TFieldValues extends FieldValues> {
  // Accept both FormFieldConfig and ZodFormFieldConfig (ZodFormFieldConfig is Omit<FormFieldConfig, "rules">)
  // Also accept flexible field configs to support FormFieldHelpers without explicit generics
  // Template literal types from FormFieldHelpers are compatible with Path<TFieldValues>
  config:
    | FormFieldConfig<TFieldValues>
    | ZodFormFieldConfig<TFieldValues>
    | (Omit<FormFieldConfig<FieldValues>, "name"> & {
        name: Path<TFieldValues>;
      })
    | (Omit<ZodFormFieldConfig<FieldValues>, "name"> & {
        name: Path<TFieldValues>;
      });
  form: UseFormReturn<TFieldValues>;
  submissionState: FormSubmissionState;
}

function FormFieldComponent<TFieldValues extends FieldValues>({
  config,
  form,
  submissionState,
}: FormFieldProps<TFieldValues>) {
  // Check if form context is available (for SSR compatibility)
  if (!form || !form.control) {
    return null;
  }

  const { control } = form;
  const watchedValues = useWatch({ control });

  // All field configs extend BaseFormFieldConfig, so we can access common properties directly
  // TypeScript's discriminated union narrowing works for the 'type' property in the switch statement
  // We don't need force casts because the structure is compatible
  const fieldConfig = config;

  // Handle content fields early - they don't need conditional rendering or baseProps
  // Use type narrowing to ensure TypeScript understands this is a ContentFieldConfig
  if ("type" in fieldConfig && fieldConfig.type === "content") {
    // TypeScript can't narrow the flexible union type, so we need to verify it's actually a ContentFieldConfig
    // by checking for content-specific properties
    if ("render" in fieldConfig || "content" in fieldConfig) {
      return (
        <ContentField<TFieldValues>
          // @ts-expect-error - TypeScript can't verify the flexible union type is ContentFieldConfig, but we've checked the type and properties
          config={fieldConfig}
          form={form}
          submissionState={submissionState}
        />
      );
    }
  }

  // Handle conditional rendering for other field types
  // Special case: If this is a conditional field containing an alwaysRegistered field array,
  // we want to render it even when the condition is false (the field array handles its own visibility)
  if (
    "condition" in fieldConfig &&
    fieldConfig.condition &&
    !fieldConfig.condition(watchedValues)
  ) {
    // Check if this conditional field contains an alwaysRegistered field array
    if (
      "field" in fieldConfig &&
      fieldConfig.field &&
      typeof fieldConfig.field === "object" &&
      "type" in fieldConfig.field &&
      fieldConfig.field.type === "fieldArray" &&
      "alwaysRegistered" in fieldConfig.field &&
      fieldConfig.field.alwaysRegistered === true
    ) {
      // This is an alwaysRegistered field array - render it anyway (fall through)
    } else {
      // Regular conditional field - don't render when condition is false
      return null;
    }
  }

  // Handle dependency-based conditional rendering
  if ("dependsOn" in fieldConfig && fieldConfig.dependsOn) {
    // Use get() to properly resolve nested paths like "slots.0.slotType"
    const dependentValue = get(watchedValues, fieldConfig.dependsOn);

    if (
      "dependsOnValue" in fieldConfig &&
      fieldConfig.dependsOnValue !== undefined &&
      dependentValue !== fieldConfig.dependsOnValue
    ) {
      return null;
    }
  }

  // All field configs extend BaseFormFieldConfig, so these properties are always available
  // We use optional chaining since the union type prevents direct access
  // Note: name is Path<TFieldValues> | string, but we know it's valid at runtime
  const baseProps = {
    ariaDescribedBy:
      "ariaDescribedBy" in fieldConfig
        ? fieldConfig.ariaDescribedBy
        : undefined,
    ariaLabel: "ariaLabel" in fieldConfig ? fieldConfig.ariaLabel : undefined,
    className: "className" in fieldConfig ? fieldConfig.className : undefined,
    description:
      "description" in fieldConfig ? fieldConfig.description : undefined,
    isDisabled:
      ("isDisabled" in fieldConfig ? fieldConfig.isDisabled : undefined) ??
      submissionState.isSubmitting,
    label: "label" in fieldConfig ? fieldConfig.label : undefined,
    // name is Path<TFieldValues> | string, but FieldBaseProps expects Path<TFieldValues>
    // We pass it directly to each component instead of through baseProps
    rules: "rules" in fieldConfig ? fieldConfig.rules : undefined,
  };

  switch (fieldConfig.type) {
    case "input": {
      // TypeScript narrows fieldConfig.type to "input" here
      return (
        <InputField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          inputProps={
            "inputProps" in fieldConfig ? fieldConfig.inputProps : undefined
          }
        />
      );
    }

    case "textarea": {
      return (
        <TextareaField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          textareaProps={
            "textareaProps" in fieldConfig
              ? fieldConfig.textareaProps
              : undefined
          }
        />
      );
    }

    case "select": {
      return (
        <SelectField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          options={
            "options" in fieldConfig && fieldConfig.options
              ? fieldConfig.options.map((opt) => ({
                  label: opt.label,
                  value: String(opt.value),
                }))
              : []
          }
          selectProps={
            "selectProps" in fieldConfig ? fieldConfig.selectProps : undefined
          }
        />
      );
    }

    case "autocomplete": {
      return (
        <AutocompleteField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          items={("options" in fieldConfig && fieldConfig.options
            ? fieldConfig.options
            : []
          ).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
          autocompleteProps={
            "autocompleteProps" in fieldConfig
              ? fieldConfig.autocompleteProps
              : undefined
          }
        />
      );
    }

    case "checkbox": {
      return (
        <CheckboxField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          checkboxProps={
            "checkboxProps" in fieldConfig
              ? fieldConfig.checkboxProps
              : undefined
          }
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
        />
      );
    }

    case "checkboxGroup": {
      return (
        <CheckboxGroupField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          checkboxProps={
            "checkboxProps" in fieldConfig
              ? fieldConfig.checkboxProps
              : undefined
          }
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig &&
            fieldConfig.defaultValue &&
            Array.isArray(fieldConfig.defaultValue)
              ? fieldConfig.defaultValue.map((v) => String(v))
              : undefined
          }
          options={("checkboxGroupOptions" in fieldConfig &&
          fieldConfig.checkboxGroupOptions
            ? fieldConfig.checkboxGroupOptions
            : []
          ).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
          orientation={
            "orientation" in fieldConfig ? fieldConfig.orientation : undefined
          }
        />
      );
    }

    case "radio": {
      return (
        <RadioGroupField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          options={("radioOptions" in fieldConfig && fieldConfig.radioOptions
            ? fieldConfig.radioOptions
            : []
          ).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
          radioGroupProps={
            "radioProps" in fieldConfig ? fieldConfig.radioProps : undefined
          }
        />
      );
    }

    case "switch": {
      return (
        <SwitchField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          switchProps={
            "switchProps" in fieldConfig ? fieldConfig.switchProps : undefined
          }
        />
      );
    }

    case "slider": {
      return (
        <SliderField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          sliderProps={
            "sliderProps" in fieldConfig ? fieldConfig.sliderProps : undefined
          }
        />
      );
    }

    case "stringArray": {
      return (
        <StringArrayField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          stringArrayProps={
            "stringArrayProps" in fieldConfig
              ? fieldConfig.stringArrayProps
              : undefined
          }
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
        />
      );
    }

    case "date": {
      return (
        <DateField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          dateProps={
            "dateProps" in fieldConfig ? fieldConfig.dateProps : undefined
          }
        />
      );
    }

    case "file": {
      // FileFieldConfig has accept and multiple properties
      return (
        <FileField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          accept={"accept" in fieldConfig ? fieldConfig.accept : undefined}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          fileProps={
            "fileProps" in fieldConfig ? fieldConfig.fileProps : undefined
          }
          multiple={
            "multiple" in fieldConfig ? fieldConfig.multiple : undefined
          }
        />
      );
    }

    case "fontPicker": {
      return (
        <FontPickerField<TFieldValues>
          {...baseProps}
          name={fieldConfig.name}
          control={control}
          defaultValue={
            "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined
          }
          fontPickerProps={
            "fontPickerProps" in fieldConfig
              ? fieldConfig.fontPickerProps
              : undefined
          }
        />
      );
    }

    case "custom": {
      if (!("render" in fieldConfig)) {
        return null;
      }

      return fieldConfig.render({
        control,
        errors: form.formState.errors,
        form,
        isSubmitting: submissionState.isSubmitting,
        name: fieldConfig.name,
      });
    }
    case "conditional": {
      // ConditionalFieldConfig requires condition and field
      if (!("condition" in fieldConfig) || !("field" in fieldConfig)) {
        return null;
      }
      const conditionalConfig: ConditionalFieldConfig<TFieldValues> = {
        className:
          "className" in fieldConfig ? fieldConfig.className : undefined,
        condition: fieldConfig.condition,
        description:
          "description" in fieldConfig ? fieldConfig.description : undefined,
        field: fieldConfig.field,
        label: "label" in fieldConfig ? fieldConfig.label : undefined,
        name: fieldConfig.name,
        type: "conditional",
      };

      return (
        <ConditionalField<TFieldValues>
          config={conditionalConfig}
          control={control}
          className={conditionalConfig.className}
        />
      );
    }

    case "fieldArray": {
      // FieldArrayConfig requires fields
      if (!("fields" in fieldConfig) || !fieldConfig.fields) {
        return null;
      }
      const fieldArrayConfig: FieldArrayConfig<TFieldValues> = {
        addButtonText:
          "addButtonText" in fieldConfig
            ? fieldConfig.addButtonText
            : undefined,
        className:
          "className" in fieldConfig ? fieldConfig.className : undefined,
        defaultItem:
          "defaultItem" in fieldConfig ? fieldConfig.defaultItem : undefined,
        description:
          "description" in fieldConfig ? fieldConfig.description : undefined,
        enableReordering:
          "enableReordering" in fieldConfig
            ? fieldConfig.enableReordering
            : undefined,
        fields: fieldConfig.fields,
        label: "label" in fieldConfig ? fieldConfig.label : undefined,
        max: "max" in fieldConfig ? fieldConfig.max : undefined,
        min: "min" in fieldConfig ? fieldConfig.min : undefined,
        name: fieldConfig.name,
        removeButtonText:
          "removeButtonText" in fieldConfig
            ? fieldConfig.removeButtonText
            : undefined,
        renderAddButton:
          "renderAddButton" in fieldConfig
            ? fieldConfig.renderAddButton
            : undefined,
        renderItem:
          "renderItem" in fieldConfig ? fieldConfig.renderItem : undefined,
        reorderButtonText:
          "reorderButtonText" in fieldConfig
            ? fieldConfig.reorderButtonText
            : undefined,
        type: "fieldArray",
      };

      return (
        <FieldArrayField<TFieldValues>
          config={fieldArrayConfig}
          className={fieldArrayConfig.className}
          alwaysRegistered={
            "alwaysRegistered" in fieldConfig
              ? fieldConfig.alwaysRegistered
              : false
          }
        />
      );
    }

    case "dynamicSection": {
      // DynamicSectionConfig requires sections, condition, and fields
      if (
        !("sections" in fieldConfig) ||
        !("condition" in fieldConfig) ||
        !("fields" in fieldConfig)
      ) {
        return null;
      }
      const dynamicSectionConfig: DynamicSectionConfig<TFieldValues> = {
        className:
          "className" in fieldConfig ? fieldConfig.className : undefined,
        condition: fieldConfig.condition,
        description:
          "description" in fieldConfig ? fieldConfig.description : undefined,
        fields: fieldConfig.fields,
        label: "label" in fieldConfig ? fieldConfig.label : undefined,
        name: fieldConfig.name,
        title: "title" in fieldConfig ? fieldConfig.title : undefined,
        type: "dynamicSection",
      };

      return (
        <DynamicSectionField<TFieldValues>
          config={dynamicSectionConfig}
          control={control}
          className={dynamicSectionConfig.className}
        />
      );
    }

    default: {
      const fieldType = "type" in config ? config.type : "unknown";

      console.warn(`Unknown field type: ${fieldType}`);

      return null;
    }
  }
}

// React.memo doesn't preserve generic types, so we need to export the component directly
// and let TypeScript infer the generic from props
export const FormField = FormFieldComponent;
