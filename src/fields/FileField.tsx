"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Input } from "#ui";

export type FileFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  FileList | null
> &
  WithControl<TFieldValues> & {
    fileProps?: Omit<
      React.ComponentProps<typeof Input>,
      | "value"
      | "onValueChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
      | "type"
    >;
    transform?: (value: FileList | null) => FileList | null;
    multiple?: boolean;
    accept?: string;
  };

function CoercedFileInput<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  fileProps?: Omit<
    React.ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
    | "type"
  >;
  multiple?: boolean;
  accept?: string;
}) {
  const {
    accept,
    description,
    disabled,
    errorMessage,
    field,
    fileProps,
    label,
    multiple,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Input
      {...defaults.input}
      {...fileProps}
      accept={accept}
      description={description}
      errorMessage={errorMessage}
      isDisabled={disabled}
      isInvalid={Boolean(errorMessage)}
      label={label}
      multiple={multiple}
      type="file"
      value={field.value ? "" : ""} // File inputs don't use value prop
      onBlur={field.onBlur}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;

        field.onChange(target.files);
      }}
    />
  );
}

export function FileField<TFieldValues extends FieldValues>(
  props: FileFieldProps<TFieldValues>,
) {
  const {
    accept,
    className,
    control,
    description,
    fileProps,
    isDisabled,
    label,
    multiple = false,
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
          <CoercedFileInput<TFieldValues>
            accept={accept}
            description={description}
            disabled={isDisabled}
            errorMessage={fieldState.error?.message}
            field={{
              ...field,
              onChange: (value: FileList | null) =>
                field.onChange(transform ? transform(value) : value),
            }}
            fileProps={fileProps}
            label={label}
            multiple={multiple}
          />
        </div>
      )}
      rules={rules}
    />
  );
}
