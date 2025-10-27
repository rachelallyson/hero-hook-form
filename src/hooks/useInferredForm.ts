"use client";

import { useForm } from "react-hook-form";
// Optional import - will be undefined if not installed
let zodResolver: any;
try {
  zodResolver = require("@hookform/resolvers/zod").zodResolver;
} catch {
  // zodResolver will be undefined if not installed
}
import type { UseFormReturn, FieldValues } from "react-hook-form";
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
  options: UseInferredFormOptions<T> = {}
): UseFormReturn<T> {
  const {
    defaultValues,
    mode = "onChange",
    reValidateMode = "onChange",
    shouldFocusError = true,
    shouldUnregister = false,
    delayError = 0,
  } = options;

  return useForm<T>({
    resolver: zodResolver ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as any,
    mode,
    reValidateMode,
    shouldFocusError,
    shouldUnregister,
    delayError,
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
  options: UseInferredFormOptions<T> = {}
): UseFormReturn<T> {
  return useInferredForm(formConfig.schema, formConfig.fields, options);
}
