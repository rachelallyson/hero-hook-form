"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Input } from "#ui";

/**
 * Props for the InputField component.
 *
 * @template TFieldValues - The form data type
 */
export type InputFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  string
> &
  WithControl<TFieldValues> & {
    inputProps?: Omit<
      React.ComponentProps<typeof Input>,
      | "value"
      | "onValueChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
    transform?: (value: string) => string;
  };

function CoercedInput<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
}) {
  const { description, disabled, errorMessage, field, inputProps, label } =
    props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Input
      {...defaults.input}
      {...inputProps}
      description={description}
      errorMessage={errorMessage}
      isDisabled={disabled}
      isInvalid={Boolean(errorMessage)}
      label={label}
      name={field.name}
      value={field.value ?? ""}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
    />
  );
}

/**
 * Input field component for text, email, password, tel, and number inputs.
 *
 * @description
 * A memoized input field component that integrates with React Hook Form
 * and HeroUI Input component. Supports all standard input types and
 * includes automatic validation error display.
 *
 * @template TFieldValues - The form data type
 *
 * @param {InputFieldProps<TFieldValues>} props - Component props
 * @param {Path<TFieldValues>} props.name - Field name path
 * @param {string} [props.label] - Field label
 * @param {string} [props.description] - Field description/help text
 * @param {Control<TFieldValues>} props.control - React Hook Form control
 * @param {boolean} [props.isDisabled] - Whether field is disabled
 * @param {RegisterOptions<TFieldValues>} [props.rules] - Validation rules
 * @param {Partial<InputProps>} [props.inputProps] - Additional Input component props
 * @param {(value: string) => string} [props.transform] - Value transformation function
 *
 * @returns {JSX.Element} The rendered input field
 *
 * @example
 * ```tsx
 * import { InputField } from "@rachelallyson/hero-hook-form";
 * import { useForm, Controller } from "react-hook-form";
 *
 * function MyForm() {
 *   const { control } = useForm();
 *
 *   return (
 *     <InputField
 *       name="email"
 *       label="Email Address"
 *       description="Enter your email address"
 *       control={control}
 *       inputProps={{
 *         type: "email",
 *         placeholder: "you@example.com",
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link FormFieldHelpers.input} for helper function to create input field config
 * @category Fields
 */
export const InputField = React.memo(
  <TFieldValues extends FieldValues>(props: InputFieldProps<TFieldValues>) => {
    const {
      className,
      control,
      description,
      inputProps,
      isDisabled,
      label,
      name,
      rules,
      transform,
    } = props;

    return (
      <Controller<TFieldValues, Path<TFieldValues>>
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <div className={className}>
            <CoercedInput<TFieldValues>
              description={description}
              disabled={isDisabled}
              errorMessage={fieldState.error?.message}
              field={{
                ...field,
                onChange: (value: string) => {
                  // Handle number inputs by converting to number
                  if (inputProps?.type === "number") {
                    const numValue = value === "" ? undefined : Number(value);

                    field.onChange(
                      transform ? transform(String(numValue)) : numValue,
                    );
                  } else {
                    field.onChange(transform ? transform(value) : value);
                  }
                },
              }}
              inputProps={inputProps}
              label={label}
            />
          </div>
        )}
        rules={rules}
      />
    );
  },
) as <TFieldValues extends FieldValues>(
  props: InputFieldProps<TFieldValues>,
) => React.JSX.Element;
