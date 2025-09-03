"use client";

import React from "react";

import { Checkbox } from "@heroui/react";
import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../../src/types";

export type CheckboxFieldProps<TFieldValues extends FieldValues> =
  FieldBaseProps<TFieldValues, boolean> &
    WithControl<TFieldValues> & {
      checkboxProps?: Omit<
        React.ComponentProps<typeof Checkbox>,
        | "isSelected"
        | "onValueChange"
        | "isInvalid"
        | "errorMessage"
        | "isDisabled"
      >;
    };

export function CheckboxField<TFieldValues extends FieldValues>(
  props: CheckboxFieldProps<TFieldValues>,
) {
  const {
    checkboxProps,
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
  } = props;

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Checkbox
            {...checkboxProps}
            isDisabled={isDisabled}
            isInvalid={Boolean(fieldState.error)}
            isSelected={Boolean(field.value)}
            onBlur={field.onBlur}
            onValueChange={(val: boolean) => field.onChange(val)}
          >
            {label}
          </Checkbox>
          {description ? (
            <p className="text-small text-default-400">{description}</p>
          ) : null}
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
