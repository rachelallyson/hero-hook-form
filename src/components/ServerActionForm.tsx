"use client";

import React from "react";

import { Button, Checkbox, Input, Select, SelectItem, Textarea } from "#ui";
import type { FieldValues } from "react-hook-form";
import { useActionState } from "react";
import type { z } from "zod";

import type { FormFieldConfig } from "../types";

// Type for Server Action that matches Next.js pattern
type ServerAction<TState = unknown, TFormData = FormData> = (
  state: TState | undefined,
  formData: TFormData,
) => Promise<TState>;

// Type for action state that includes errors
interface ActionState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

interface ServerActionFormProps<T extends FieldValues> {
  /** Server Action function (Next.js pattern) */
  action: ServerAction<ActionState, FormData>;
  /** Optional: Zod schema for client-side validation before submission */
  clientValidationSchema?: z.ZodSchema<T>;
  className?: string;
  columns?: 1 | 2 | 3;
  /** Default values for form fields */
  defaultValues?: Partial<T>;
  fields: FormFieldConfig<T>[];
  /** Initial state for useActionState */
  initialState?: ActionState;
  layout?: "vertical" | "horizontal" | "grid";
  /** Callback when form submission encounters an error */
  onError?: (error: {
    errors?: Record<string, string[]>;
    message?: string;
  }) => void;
  /** Callback when form submission succeeds */
  onSuccess?: (data: FormData) => void;
  resetButtonText?: string;
  showResetButton?: boolean;
  spacing?: "2" | "4" | "6" | "8" | "lg";
  submitButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  submitButtonText?: string;
  subtitle?: string;
  title?: string;
}

/**
 * ServerActionForm - A form component compatible with Next.js Server Actions.
 *
 * @description
 * This component works with Next.js authentication patterns by using native
 * HTML form submission with Server Actions, while still providing the
 * beautiful HeroUI field components. It uses React's useActionState hook
 * to manage form state and handle server responses.
 *
 * **Validation Options:**
 * - **Server-side only (default)**: Form submits directly to Server Action
 * - **Client + Server (optional)**: Pass `clientValidationSchema` for client-side
 *   validation before submission. Server Action still validates (defense in depth).
 *
 * **Important Notes:**
 * - If your Server Action calls `redirect()`, success messages won't display
 *   (the page navigates away). Use URL params or cookies for success messages
 *   when redirecting.
 * - Server Actions receive FormData, not JSON, so field values are strings
 *
 * @template T - The form data type
 *
 * @param {ServerActionFormProps<T>} props - Component props
 * @param {ServerAction<ActionState, FormData>} props.action - Next.js Server Action function
 * @param {FormFieldConfig<T>[]} props.fields - Array of field configurations
 * @param {z.ZodSchema<T>} [props.clientValidationSchema] - Optional Zod schema for client-side validation
 * @param {Partial<T>} [props.defaultValues] - Default form values
 * @param {ActionState} [props.initialState] - Initial state for useActionState
 * @param {string} [props.title] - Optional form title
 * @param {string} [props.subtitle] - Optional form subtitle
 * @param {"vertical"|"horizontal"|"grid"} [props.layout="vertical"] - Form layout style
 * @param {1|2|3} [props.columns=1] - Number of columns for grid layout
 * @param {"2"|"4"|"6"|"8"|"lg"} [props.spacing="4"] - Spacing between form fields
 * @param {string} [props.submitButtonText="Submit"] - Text for the submit button
 * @param {boolean} [props.showResetButton=false] - Whether to show a reset button
 * @param {(error: {...}) => void} [props.onError] - Error callback
 * @param {(data: FormData) => void} [props.onSuccess] - Success callback
 *
 * @returns {JSX.Element} The rendered form component
 *
 * @example
 * Server-side only validation:
 * ```tsx
 * import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { signup } from "@/app/actions/auth";
 *
 * <ServerActionForm
 *   action={signup}
 *   fields={[
 *     FormFieldHelpers.input("name", "Name"),
 *     FormFieldHelpers.input("email", "Email", "email"),
 *     FormFieldHelpers.input("password", "Password", "password"),
 *   ]}
 * />
 * ```
 *
 * @example
 * Client + Server validation:
 * ```tsx
 * import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { signup } from "@/app/actions/auth";
 * import { z } from "zod";
 *
 * const signupSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * <ServerActionForm
 *   action={signup}
 *   clientValidationSchema={signupSchema}
 *   fields={[
 *     FormFieldHelpers.input("name", "Name"),
 *     FormFieldHelpers.input("email", "Email", "email"),
 *     FormFieldHelpers.input("password", "Password", "password"),
 *   ]}
 *   onError={(error) => {
 *     console.error("Form errors:", error.errors);
 *   }}
 *   onSuccess={(data) => {
 *     console.log("Form submitted:", data);
 *   }}
 * />
 * ```
 *
 * @see {@link ZodForm} for client-side only forms with Zod validation
 * @see {@link ConfigurableForm} for forms without Server Actions
 * @category Components
 */
export function ServerActionForm<T extends FieldValues>({
  action,
  className,
  clientValidationSchema,
  columns = 1,
  defaultValues,
  fields,
  initialState,
  layout = "vertical",
  onError,
  onSuccess,
  resetButtonText = "Reset",
  showResetButton = false,
  spacing = "4",
  submitButtonProps = {},
  submitButtonText = "Submit",
  subtitle,
  title,
}: ServerActionFormProps<T>) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    initialState ?? { errors: undefined, message: undefined, success: false },
  );

  const formRef = React.useRef<HTMLFormElement>(null);
  const [clientErrors, setClientErrors] = React.useState<
    Record<string, string>
  >({});
  const lastSubmittedFormData = React.useRef<FormData | null>(null);

  // Call onError callback when server errors occur
  React.useEffect(() => {
    if (state && (state.errors || (state.message && !state.success))) {
      onError?.({
        errors: state.errors,
        message: state.message,
      });
    }
  }, [state, onError]);

  // Call onSuccess callback when submission succeeds
  React.useEffect(() => {
    if (state?.success && lastSubmittedFormData.current) {
      onSuccess?.(lastSubmittedFormData.current);
    }
  }, [state?.success, onSuccess]);

  const handleReset = () => {
    formRef.current?.reset();
    setClientErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If client-side validation is enabled, validate first
    if (clientValidationSchema) {
      const formData = new FormData(e.currentTarget);
      const values: Record<string, unknown> = {};

      // Convert FormData to object for validation
      formData.forEach((val, key) => {
        // Handle checkboxes - "on" becomes true, empty becomes false

        if (val === "on") {
          values[key] = true;
        } else if (val === "") {
          // Skip empty strings for checkboxes

          if (!values[key]) {
            values[key] = false;
          }
        } else {
          values[key] = val;
        }
      });

      // Validate with Zod schema
      const result = clientValidationSchema.safeParse(values);

      if (!result.success) {
        // Set client-side errors for display
        const errors: Record<string, string> = {};

        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");

          errors[path] = issue.message;
        });
        // Use a callback to ensure state update happens
        setClientErrors((prev) => ({ ...prev, ...errors }));

        // Don't submit if client validation fails
        return;
      }

      // Clear client errors if validation passes
      setClientErrors({});
    }

    // Create FormData from form
    const formData = new FormData(e.currentTarget);

    lastSubmittedFormData.current = formData;

    // Submit to Server Action
    formAction(formData);
  };

  const renderFields = () => {
    // For Server Actions, we need to render native form inputs
    // that will be submitted as FormData
    if (layout === "grid") {
      return (
        <div
          className={`grid gap-${spacing} ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {fields.map((field) => (
            <ServerActionField
              key={field.name as string}
              clientErrors={clientErrors}
              defaultValues={defaultValues}
              errors={state?.errors}
              field={field}
            />
          ))}
        </div>
      );
    }

    if (layout === "horizontal") {
      return (
        <div className={`grid gap-${spacing} grid-cols-1 md:grid-cols-2`}>
          {fields.map((field) => (
            <ServerActionField
              key={field.name as string}
              clientErrors={clientErrors}
              defaultValues={defaultValues}
              errors={state?.errors}
              field={field}
            />
          ))}
        </div>
      );
    }

    // Vertical layout (default)
    return (
      <div className={`space-y-${spacing}`}>
        {fields.map((field) => (
          <ServerActionField
            key={field.name as string}
            clientErrors={clientErrors}
            defaultValues={defaultValues}
            errors={state?.errors}
            field={field}
          />
        ))}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      className={className}
      role="form"
      onSubmit={handleSubmit}
    >
      {/* Title and Subtitle */}
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Success Message */}
      {/* Note: Success messages only display if Server Action returns state (no redirect) */}
      {state?.success && !pending && (
        <div
          className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg"
          data-testid="success-message"
        >
          <p className="text-success-800 font-medium">Success!</p>
          {state.message && (
            <p className="text-success-700 text-sm mt-1">{state.message}</p>
          )}
        </div>
      )}

      {/* Error Message */}
      {state?.message && !state.success && (
        <div
          className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
          data-testid="error-message"
        >
          <p className="text-danger-800 font-medium">Error</p>
          <p className="text-danger-700 text-sm mt-1">{state.message}</p>
        </div>
      )}

      {/* Form Fields */}
      {renderFields()}

      {/* Submit Button */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button
          color="primary"
          isDisabled={pending}
          isLoading={pending}
          type="submit"
          {...submitButtonProps}
        >
          {submitButtonText}
        </Button>

        {showResetButton && (
          <Button
            isDisabled={pending}
            type="button"
            variant="bordered"
            onPress={handleReset}
          >
            {resetButtonText}
          </Button>
        )}
      </div>
    </form>
  );
}

// Helper component to render fields for Server Actions
// Uses HeroUI components with hidden native inputs for FormData serialization
function ServerActionField<T extends FieldValues>({
  clientErrors,
  defaultValues,
  errors,
  field,
}: {
  clientErrors?: Record<string, string>;
  defaultValues?: Partial<T>;
  errors?: Record<string, string[]>;
  field: FormFieldConfig<T>;
}) {
  // Handle content fields - they don't need form data
  if (field.type === "content") {
    const contentField = field as any;

    // If custom render function is provided, use it
    if (contentField.render) {
      return (
        <div className={contentField.className}>
          {contentField.render({
            errors: {},
            form: null,
            isSubmitting: false,
          })}
        </div>
      );
    }

    // Otherwise, render title and/or description
    return (
      <div className={contentField.className}>
        {contentField.title && (
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {contentField.title}
          </h3>
        )}
        {contentField.description && (
          <p className="text-sm text-muted-foreground">
            {contentField.description}
          </p>
        )}
      </div>
    );
  }

  const fieldName = field.name as string;
  const fieldErrors = errors?.[fieldName];
  const clientError = clientErrors?.[fieldName];

  // Prefer client-side errors (shown immediately), fall back to server errors
  const errorMessage =
    clientError ||
    (fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined);

  // Get default value from prop or field config
  const getDefaultValue = () => {
    const fromProps = defaultValues?.[fieldName as keyof T];
    const fromField = (field as any).defaultValue;

    if (fromProps !== undefined && fromProps !== null) {
      return typeof fromProps === "string" ? fromProps : String(fromProps);
    }
    if (fromField !== undefined && fromField !== null) {
      return typeof fromField === "string" ? fromField : String(fromField);
    }

    return "";
  };

  const getDefaultChecked = () => {
    const fromProps = defaultValues?.[fieldName as keyof T];
    const fromField = (field as any).defaultValue;

    if (fromProps !== undefined && fromProps !== null) {
      return typeof fromProps === "boolean" ? fromProps : false;
    }
    if (fromField !== undefined && fromField !== null) {
      return typeof fromField === "boolean" ? fromField : false;
    }

    return false;
  };

  // Initialize state with default values
  const [value, setValue] = React.useState<string>(getDefaultValue);
  const [checked, setChecked] = React.useState<boolean>(getDefaultChecked);

  // Update state when defaultValues prop changes (for dynamic updates)
  React.useEffect(() => {
    const newDefaultValue = defaultValues?.[fieldName as keyof T];

    if (newDefaultValue !== undefined && newDefaultValue !== null) {
      if (field.type === "checkbox") {
        setChecked(
          typeof newDefaultValue === "boolean" ? newDefaultValue : false,
        );
      } else {
        setValue(
          typeof newDefaultValue === "string"
            ? newDefaultValue
            : String(newDefaultValue),
        );
      }
    }
  }, [defaultValues, fieldName, field.type]);

  // Sync value to hidden input for FormData
  React.useEffect(() => {
    const hiddenInput = document.querySelector(
      `input[type="hidden"][name="${fieldName}"]`,
    ) as HTMLInputElement;

    if (hiddenInput) {
      if (field.type === "checkbox") {
        hiddenInput.value = checked ? "on" : "";
      } else {
        hiddenInput.value = value;
      }
    }
  }, [value, checked, fieldName, field.type]);

  switch (field.type) {
    case "input": {
      const inputType = (field as any).inputProps?.type || "text";

      return (
        <>
          {/* Hidden native input for FormData */}
          <input type="hidden" name={fieldName} value={value} />
          <Input
            {...(field as any).inputProps}
            data-field-name={fieldName}
            type={inputType}
            label={field.label}
            description={field.description}
            isDisabled={field.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
          />
        </>
      );
    }

    case "textarea": {
      return (
        <>
          <input type="hidden" name={fieldName} value={value} />
          <Textarea
            {...(field as any).textareaProps}
            data-field-name={fieldName}
            label={field.label}
            description={field.description}
            isDisabled={field.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
          />
        </>
      );
    }

    case "checkbox": {
      return (
        <>
          <input type="hidden" name={fieldName} value={checked ? "on" : ""} />
          <Checkbox
            {...(field as any).checkboxProps}
            data-field-name={fieldName}
            isDisabled={field.isDisabled}
            isSelected={checked}
            onValueChange={setChecked}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
          >
            {field.label}
          </Checkbox>
        </>
      );
    }

    case "select": {
      const options = (field as any).options || [];

      return (
        <>
          <input type="hidden" name={fieldName} value={value} />
          <Select
            {...(field as any).selectProps}
            data-field-name={fieldName}
            label={field.label}
            description={field.description}
            isDisabled={field.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            selectedKeys={value ? [value] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;

              setValue(selectedValue || "");
            }}
          >
            {options.map(
              (option: { label: string; value: string | number }) => (
                <SelectItem key={String(option.value)}>
                  {option.label}
                </SelectItem>
              ),
            )}
          </Select>
        </>
      );
    }

    default:
      // Fallback to basic input for unsupported types
      return (
        <>
          <input type="hidden" name={fieldName} value={value} />
          <Input
            data-field-name={fieldName}
            label={field.label}
            description={field.description}
            isDisabled={field.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
          />
        </>
      );
  }
}
