"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Input } from "#ui";

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
      value={field.value ?? ""}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
    />
  );
}

export const InputField = React.memo(<TFieldValues extends FieldValues>(
  props: InputFieldProps<TFieldValues>,
) => {
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
}) as <TFieldValues extends FieldValues>(
  props: InputFieldProps<TFieldValues>
) => React.JSX.Element;
