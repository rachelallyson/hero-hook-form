"use client";

import { useForm } from "react-hook-form";
// Optional import - will be undefined if not installed
let zodResolver: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  zodResolver = require("@hookform/resolvers/zod").zodResolver;
} catch {
  // zodResolver will be undefined if not installed
}
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ZodFormFieldConfig } from "../types";

export interface UseInferredFormOptions<T extends FieldValues> {
  defaultValues?: Partial<T>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  delayError?: number;
}

export function useInferredForm<T extends FieldValues>(
  schema: any,
  fields: ZodFormFieldConfig<T>[],
  options: UseInferredFormOptions<T> = {},
): UseFormReturn<T> {
  const {
    defaultValues,
    delayError = 0,
    mode = "onChange",
    reValidateMode = "onChange",
    shouldFocusError = true,
    shouldUnregister = false,
  } = options;

  return useForm<T>({
    defaultValues: defaultValues as any,
    delayError,
    mode,
    resolver: zodResolver ? zodResolver(schema) : undefined,
    reValidateMode,
    shouldFocusError,
    shouldUnregister,
  });
}

/**
 * Hook that works with type-inferred forms
 */
export function useTypeInferredForm<T extends FieldValues>(
  formConfig: {
    schema: any;
    fields: ZodFormFieldConfig<T>[];
  },
  options: UseInferredFormOptions<T> = {},
): UseFormReturn<T> {
  return useInferredForm(formConfig.schema, formConfig.fields, options);
}
