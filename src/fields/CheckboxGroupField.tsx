"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type {
  CheckboxGroupPassthroughProps,
  FieldBaseProps,
  WithControl,
} from "../types";
import { createFieldHandlers } from "../utils/fieldHandlers";

import { Checkbox } from "#ui";

/**
 * Configuration for a checkbox option in a checkbox group.
 *
 * @template TValue - The value type for the option
 */
interface CheckboxOption<TValue extends string | number> {
  /** Display label for the option */
  label: string;
  /** Value of the option */
  value: TValue;
  /** Optional description text */
  description?: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Props for the CheckboxGroupField component.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the checkbox group (string or number)
 *
 * @example
 * ```tsx
 * import { CheckboxGroupField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { interests: [] },
 * });
 *
 * const options = [
 *   { label: "Reading", value: "reading" },
 *   { label: "Sports", value: "sports" },
 *   { label: "Music", value: "music" },
 * ];
 *
 * <CheckboxGroupField
 *   control={form.control}
 *   name="interests"
 *   label="Interests"
 *   options={options}
 * />
 * ```
 */
export type CheckboxGroupFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue[]> &
  WithControl<TFieldValues> & {
    /** Array of checkbox options */
    options: readonly CheckboxOption<TValue>[];
    /** Additional props to pass to individual Checkbox components */
    checkboxProps?: CheckboxGroupPassthroughProps;
    /** Layout orientation for the checkboxes */
    orientation?: "vertical" | "horizontal";
  };

/**
 * A checkbox group field component that integrates React Hook Form with HeroUI Checkbox.
 *
 * This component provides a type-safe checkbox group field with validation support,
 * error handling, and accessibility features. Multiple options can be selected,
 * and the value is stored as an array of selected option values.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the checkbox group (string or number)
 *
 * @param props - The checkbox group field props
 * @returns The rendered checkbox group field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   interests: z.array(z.string()).min(1, "Please select at least one interest"),
 * });
 *
 * const options = [
 *   { label: "Reading", value: "reading" },
 *   { label: "Sports", value: "sports" },
 *   { label: "Music", value: "music" },
 * ];
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.checkboxGroup("interests", "Interests", options),
 *         ],
 *       }}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling and horizontal layout
 * <CheckboxGroupField
 *   control={form.control}
 *   name="interests"
 *   label="Interests"
 *   options={options}
 *   orientation="horizontal"
 *   checkboxProps={{
 *     color: "primary",
 *     size: "lg",
 *   }}
 * />
 * ```
 */
export function CheckboxGroupField<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>(props: CheckboxGroupFieldProps<TFieldValues, TValue>) {
  const {
    checkboxProps,
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    options,
    orientation = "vertical",
    rules,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentValues = (field.value as TValue[]) || [];

        // Create handlers for individual checkboxes
        // Checkbox accepts FocusEvent<Element>, not just HTMLInputElement
        const restCheckboxProps = createFieldHandlers<
          boolean,
          Element,
          CheckboxGroupPassthroughProps
        >(checkboxProps, field, { isDisabled });

        const handleCheckboxChange = (
          optionValue: TValue,
          checked: boolean,
        ) => {
          if (checked) {
            // Add to array if not already present
            if (!currentValues.includes(optionValue)) {
              field.onChange([...currentValues, optionValue]);
            }
          } else {
            // Remove from array
            field.onChange(currentValues.filter((val) => val !== optionValue));
          }
        };

        const containerClass =
          orientation === "horizontal"
            ? "flex flex-row gap-4 flex-wrap"
            : "flex flex-col gap-2";

        return (
          <div className={className}>
            {label && (
              <label className="text-sm font-medium text-foreground block mb-2">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-default-500 mb-2">{description}</p>
            )}
            <div className={containerClass}>
              {options.map((option) => {
                const isSelected = currentValues.includes(option.value);

                return (
                  <Checkbox
                    key={String(option.value)}
                    {...defaults.checkbox}
                    {...restCheckboxProps}
                    isDisabled={restCheckboxProps.isDisabled || option.disabled}
                    isInvalid={Boolean(fieldState.error)}
                    isSelected={isSelected}
                    name={name}
                    onValueChange={(checked) =>
                      handleCheckboxChange(option.value, checked)
                    }
                  >
                    {option.label}
                  </Checkbox>
                );
              })}
            </div>
            {fieldState.error?.message ? (
              <p className="text-tiny text-danger mt-1">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        );
      }}
      rules={rules}
    />
  );
}
