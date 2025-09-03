"use client";

import React from "react";

import { Textarea } from "@heroui/react";
import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../../src/types";

export type TextareaFieldProps<TFieldValues extends FieldValues> =
  FieldBaseProps<TFieldValues, string> &
    WithControl<TFieldValues> & {
      textareaProps?: Omit<
        React.ComponentProps<typeof Textarea>,
        | "value"
        | "onValueChange"
        | "label"
        | "isInvalid"
        | "errorMessage"
        | "isDisabled"
      >;
    };

export function TextareaField<TFieldValues extends FieldValues>(
  props: TextareaFieldProps<TFieldValues>,
) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
    textareaProps,
  } = props;

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Textarea
            {...textareaProps}
            description={description}
            errorMessage={fieldState.error?.message}
            isDisabled={isDisabled}
            isInvalid={Boolean(fieldState.error)}
            label={label}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onValueChange={field.onChange}
          />
        </div>
      )}
      rules={rules}
    />
  );
}
