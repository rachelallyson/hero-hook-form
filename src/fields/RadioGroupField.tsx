"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Radio, RadioGroup } from "#ui";

/**
 * Configuration for a radio option.
 *
 * @template TValue - The value type for the option
 */
interface RadioOption<TValue extends string | number> {
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
 * Props for the RadioGroupField component.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the radio group (string or number)
 *
 * @example
 * ```tsx
 * import { RadioGroupField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { plan: "" },
 * });
 *
 * const options = [
 *   { label: "Basic", value: "basic" },
 *   { label: "Pro", value: "pro" },
 *   { label: "Enterprise", value: "enterprise" },
 * ];
 *
 * <RadioGroupField
 *   control={form.control}
 *   name="plan"
 *   label="Select Plan"
 *   options={options}
 * />
 * ```
 */
export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    /** Array of radio options */
    options: readonly RadioOption<TValue>[];
    /** Additional props to pass to the underlying RadioGroup component */
    radioGroupProps?: Omit<
      React.ComponentProps<typeof RadioGroup>,
      "value" | "onValueChange" | "label"
    >;
  };

/**
 * A radio group field component that integrates React Hook Form with HeroUI RadioGroup.
 *
 * This component provides a type-safe radio group field with validation support,
 * error handling, and accessibility features. Only one option can be selected at a time.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the radio group (string or number)
 *
 * @param props - The radio group field props
 * @returns The rendered radio group field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   plan: z.enum(["basic", "pro", "enterprise"], {
 *     required_error: "Please select a plan",
 *   }),
 * });
 *
 * const options = [
 *   { label: "Basic - $9/month", value: "basic" },
 *   { label: "Pro - $29/month", value: "pro" },
 *   { label: "Enterprise - $99/month", value: "enterprise" },
 * ];
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.radioGroup("plan", "Select Plan", options),
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
 * // With custom styling
 * <RadioGroupField
 *   control={form.control}
 *   name="plan"
 *   label="Select Plan"
 *   options={options}
 *   radioGroupProps={{
 *     orientation: "horizontal",
 *     color: "primary",
 *   }}
 * />
 * ```
 */
export function RadioGroupField<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>(props: RadioGroupFieldProps<TFieldValues, TValue>) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    options,
    radioGroupProps,
    rules,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <RadioGroup
            {...defaults.radioGroup}
            {...radioGroupProps}
            description={description}
            isDisabled={isDisabled}
            isInvalid={Boolean(fieldState.error)}
            label={label}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onValueChange={(val: string) => field.onChange(val)}
          >
            {options.map((opt) => (
              <Radio
                key={String(opt.value)}
                isDisabled={opt.disabled}
                value={String(opt.value)}
              >
                {opt.label}
              </Radio>
            ))}
          </RadioGroup>
          {fieldState.error?.message ? (
            <p className="text-tiny text-danger mt-1">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
      rules={rules}
    />
  );
}
