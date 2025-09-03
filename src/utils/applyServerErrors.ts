import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export interface ServerFieldError<TFieldValues extends FieldValues> {
  path: Path<TFieldValues>;
  message: string;
  type?: string;
}

export interface ServerFormError<TFieldValues extends FieldValues> {
  message?: string;
  fieldErrors?: readonly ServerFieldError<TFieldValues>[];
}

export function applyServerErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  serverError: ServerFormError<TFieldValues>,
) {
  if (!serverError.fieldErrors?.length) return;
  for (const err of serverError.fieldErrors) {
    setError(err.path, { message: err.message, type: err.type });
  }
}
