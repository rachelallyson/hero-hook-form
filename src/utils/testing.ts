import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import type { FormTestUtils } from "../types";

/**
 * Testing utilities for forms
 * These utilities help with testing form behavior and state
 */

/**
 * Creates form test utilities for a given form instance
 */
export function createFormTestUtils<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): FormTestUtils<TFieldValues> {
  return {
    /**
     * Get a field by name
     */
    getField: (name: Path<TFieldValues>) => {
      return {
        error: form.formState.errors[name],
        isDirty: !!(form.formState.dirtyFields as Record<string, boolean>)[
          name
        ],
        isTouched: !!(form.formState.touchedFields as Record<string, boolean>)[
          name
        ],
        value: form.getValues(name),
      };
    },

    /**
     * Get the current form state
     */
    getFormState: () => ({
      errors: form.formState.errors,
      isSubmitted: form.formState.isSubmitted,
      isSubmitting: form.formState.isSubmitting,
      isSuccess: form.formState.isSubmitSuccessful,
      values: form.getValues(),
    }),

    /**
     * Reset the form
     */
    resetForm: () => {
      form.reset();
    },

    /**
     * Set a field value
     */
    setFieldValue: (name: Path<TFieldValues>, value: unknown) => {
      form.setValue(name, value as never, { shouldValidate: true });
    },

    /**
     * Submit the form
     */
    submitForm: async () => {
      const isValid = await form.trigger();

      if (isValid) {
        await form.handleSubmit(() => {
          // Empty submit handler for testing
        })();
      }
    },

    /**
     * Trigger validation for a field or all fields
     */
    triggerValidation: async (name?: Path<TFieldValues>) => {
      if (name) {
        return await form.trigger(name);
      }

      return await form.trigger();
    },
  };
}

/**
 * Mock form data for testing
 */
export function createMockFormData<TFieldValues extends FieldValues>(
  overrides: Partial<TFieldValues> = {},
): TFieldValues {
  return {
    agreeToTerms: true,
    confirmPassword: "password123",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "password123",
    phone: "123-456-7890",
    ...overrides,
  } as unknown as TFieldValues;
}

/**
 * Mock form errors for testing
 */
export function createMockFormErrors<TFieldValues extends FieldValues>(
  overrides: Partial<FieldErrors<TFieldValues>> = {},
): FieldErrors<TFieldValues> {
  return {
    email: { message: "Invalid email address", type: "pattern" },
    password: { message: "Password is too short", type: "minLength" },
    ...overrides,
  } as FieldErrors<TFieldValues>;
}

/**
 * Wait for form state to change (useful for async operations)
 */
export function waitForFormState<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  condition: (state: unknown) => boolean,
  timeout = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkState = () => {
      if (condition(form.formState)) {
        resolve();

        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for form state"));

        return;
      }

      setTimeout(checkState, 100);
    };

    checkState();
  });
}

/**
 * Simulate user input on a field
 */
export function simulateFieldInput<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>,
  value: unknown,
) {
  form.setValue(name, value as never);
  void form.trigger(name);
}

/**
 * Simulate form submission
 */
export function simulateFormSubmission<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: (data: TFieldValues) => void | Promise<void>,
) {
  return form.handleSubmit(onSubmit)();
}

/**
 * Check if form has validation errors
 */
export function hasFormErrors<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): boolean {
  return Object.keys(form.formState.errors).length > 0;
}

/**
 * Get all form errors as a flat array
 */
export function getFormErrors<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): string[] {
  return Object.values(form.formState.errors).map(
    (error: unknown) => (error as { message: string }).message,
  );
}

/**
 * Check if a specific field has an error
 */
export function hasFieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>,
): boolean {
  return !!form.formState.errors[name];
}

/**
 * Get error message for a specific field
 */
export function getFieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>,
): string | undefined {
  const error = form.formState.errors[name];

  return (error as { message?: string })?.message;
}
