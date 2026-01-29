"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type {
  FieldBaseProps,
  FileInputPassthroughProps,
  WithControl,
} from "../types";
import { createFileFieldHandlers } from "../utils/fieldHandlers";

import { Input } from "#ui";

/**
 * Props for the FileField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { FileField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { avatar: null as FileList | null },
 * });
 *
 * <FileField
 *   control={form.control}
 *   name="avatar"
 *   label="Upload Avatar"
 *   accept="image/*"
 *   description="Select an image file"
 * />
 * ```
 */
export type FileFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  FileList | null
> &
  WithControl<TFieldValues> & {
    /** Additional props to pass to the underlying Input component */
    fileProps?: FileInputPassthroughProps;
    /** Transform function to modify the file list before it's set */
    transform?: (value: FileList | null) => FileList | null;
    /** Whether multiple files can be selected */
    multiple?: boolean;
    /** Accepted file types (e.g., "image/*", ".pdf,.doc") */
    accept?: string;
  };

function CoercedFileInput<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  fileProps?: FileInputPassthroughProps;
  multiple?: boolean;
  accept?: string;
  transform?: (value: FileList | null) => FileList | null;
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
    transform,
  } = props;
  const defaults = useHeroHookFormDefaults();

  const restProps = createFileFieldHandlers<FileInputPassthroughProps>(
    fileProps,
    field,
    transform,
    { isDisabled: disabled, label },
  );

  return (
    <Input
      {...defaults.input}
      {...restProps}
      accept={accept}
      description={description}
      errorMessage={errorMessage}
      isInvalid={Boolean(errorMessage)}
      multiple={multiple}
      name={field.name}
      type="file"
      value={field.value ? "" : ""} // File inputs don't use value prop
    />
  );
}

/**
 * A file input field component that integrates React Hook Form with HeroUI Input.
 *
 * This component provides a type-safe file upload field with validation support,
 * error handling, and accessibility features. The field value is a `FileList` or `null`.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The file field props
 * @returns The rendered file field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   avatar: z.instanceof(FileList).nullable(),
 *   documents: z.instanceof(FileList).optional(),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.file("avatar", "Upload Avatar", { accept: "image/*" }),
 *           FormFieldHelpers.file("documents", "Upload Documents", {
 *             multiple: true,
 *             accept: ".pdf,.doc,.docx",
 *           }),
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
 * // With file size validation
 * <FileField
 *   control={form.control}
 *   name="avatar"
 *   label="Upload Avatar"
 *   accept="image/*"
 *   transform={(files) => {
 *     if (files && files[0] && files[0].size > 5 * 1024 * 1024) {
 *       // File too large
 *       return null;
 *     }
 *     return files;
 *   }}
 * />
 * ```
 */
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
            field={field}
            transform={transform}
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
