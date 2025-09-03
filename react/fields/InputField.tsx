"use client";

import React from "react";

import { Input } from "@heroui/react";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../../src/types";

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

  return (
    <Input
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

export function InputField<TFieldValues extends FieldValues>(
  props: InputFieldProps<TFieldValues>,
) {
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
              onChange: (value: string) =>
                field.onChange(transform ? transform(value) : value),
            }}
            inputProps={inputProps}
            label={label}
          />
        </div>
      )}
      rules={rules}
    />
  );
}
