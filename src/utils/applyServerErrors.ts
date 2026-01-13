import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Server field error structure.
 *
 * @template TFieldValues - The form data type
 */
export interface ServerFieldError<TFieldValues extends FieldValues> {
  path: Path<TFieldValues>;
  message: string;
  type?: string;
}

/**
 * Server form error structure containing field errors.
 *
 * @template TFieldValues - The form data type
 */
export interface ServerFormError<TFieldValues extends FieldValues> {
  message?: string;
  fieldErrors?: readonly ServerFieldError<TFieldValues>[];
}

/**
 * Applies server-side validation errors to a React Hook Form instance.
 *
 * @description
 * Maps server-returned field errors to React Hook Form's error state.
 * Useful for displaying validation errors from API responses. This function
 * iterates through the field errors and sets them on the form using
 * React Hook Form's setError function.
 *
 * @template TFieldValues - The form data type
 *
 * @param {UseFormSetError<TFieldValues>} setError - React Hook Form's setError function
 * @param {ServerFormError<TFieldValues>} serverError - Server error containing field errors
 *
 * @example
 * ```tsx
 * import { applyServerErrors } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * function MyForm() {
 *   const form = useForm();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       const response = await fetch("/api/submit", {
 *         method: "POST",
 *         body: JSON.stringify(data),
 *       });
 *
 *       if (!response.ok) {
 *         const errorData = await response.json();
 *         applyServerErrors(form.setError, errorData);
 *       }
 *     } catch (error) {
 *       console.error("Error:", error);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(handleSubmit)}>
 *       {/* form fields go here *\/}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * With ZodForm error handling:
 * ```tsx
 * import { ZodForm, applyServerErrors } from "@rachelallyson/hero-hook-form";
 *
 * function MyForm() {
 *   const form = useForm();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitToServer(data);
 *     } catch (error) {
 *       if (error.fieldErrors) {
 *         applyServerErrors(form.setError, {
 *           fieldErrors: error.fieldErrors,
 *         });
 *       }
 *     }
 *   };
 *
 *   return <ZodForm config={{ schema, fields }} onSubmit={handleSubmit} />;
 * }
 * ```
 *
 * @see {@link ServerFormError} for error structure
 * @see {@link ServerFieldError} for field error structure
 * @category Utilities
 */
export function applyServerErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  serverError: ServerFormError<TFieldValues>,
) {
  if (!serverError.fieldErrors?.length) return;
  for (const err of serverError.fieldErrors) {
    setError(err.path, { message: err.message, type: err.type });
  }
}
