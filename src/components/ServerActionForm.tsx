"use client";

import React from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  DateInput,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Switch,
  Textarea,
} from "#ui";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { useActionState } from "react";
import type { z } from "zod";

import { pathToString } from "../types";
import { toCalendarDateValue } from "../utils/dateCoercion";
import type {
  BooleanFieldConfig,
  CheckboxGroupFieldConfig,
  ContentFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
  FormFieldConfig,
  RadioFieldConfig,
  SliderFieldConfig,
  StringFieldConfig,
  ZodFormFieldConfig,
} from "../types";

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
  defaultValues?: Partial<T> | Record<string, unknown>;
  // Allow both FormFieldConfig and ZodFormFieldConfig for flexibility
  // Field configs can be created with FormFieldHelpers - they'll be compatible as long as
  // the form type includes all the field names
  // We accept FormFieldConfig<any> and ZodFormFieldConfig<any> to allow field configs
  // created with FormFieldHelpers without explicit generics, since TypeScript creates
  // intersection types when inferring from multiple field configs
  // The name property must always be a valid Path<T> - template literal types are compatible
  fields: (
    | FormFieldConfig<T>
    | FormFieldConfig<any>
    | ZodFormFieldConfig<any>
    | (Omit<FormFieldConfig<FieldValues>, "name"> & {
        name: Path<T>;
      })
    | (Omit<ZodFormFieldConfig<FieldValues>, "name"> & {
        name: Path<T>;
      })
  )[];
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
export function ServerActionForm<T extends FieldValues = FieldValues>({
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
      const form = e.currentTarget;
      const values: Record<string, unknown> = {};

      // Convert FormData to object for validation
      formData.forEach((val, key) => {
        // Handle checkboxes/switches - any value means checked (true)
        // Check if the form element is a checkbox or switch
        const formElement = form.querySelector(
          `input[type="checkbox"][name="${key}"], input[role="switch"][name="${key}"]`,
        );

        // Type guard: check if element is HTMLInputElement
        if (
          formElement instanceof HTMLInputElement &&
          (formElement.type === "checkbox" ||
            formElement.getAttribute("role") === "switch")
        ) {
          // Checkbox/switch is checked (exists in FormData) - convert to true
          // Value can be "on" (default) or custom value from checkboxProps
          values[key] = true;
        } else {
          values[key] = val;
        }
      });

      // Handle unchecked checkboxes/switches - if not in FormData, set to false
      // This assumes all checkbox/switch fields are in the schema
      // If a field is not present in FormData and the schema expects a boolean, it will be handled by Zod's default/optional logic

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
              key={field.name}
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
              key={field.name}
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
            key={pathToString(field.name)}
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
  // Accept flexible field config to support FormFieldHelpers without explicit generics
  // Template literal types from FormFieldHelpers are compatible with Path<T>
  field:
    | FormFieldConfig<T>
    | (Omit<FormFieldConfig<FieldValues>, "name"> & { name: Path<T> });
}) {
  const fieldConfig = field;

  // Helper to safely access base properties that exist on all field configs
  const getBaseProps = () => {
    const baseProps: {
      label?: string;
      description?: string;
      isDisabled?: boolean;
    } = {};

    if ("label" in fieldConfig) {
      baseProps.label = fieldConfig.label;
    }
    if ("description" in fieldConfig) {
      baseProps.description = fieldConfig.description;
    }
    if ("isDisabled" in fieldConfig) {
      baseProps.isDisabled = fieldConfig.isDisabled;
    }

    return baseProps;
  };

  const baseProps = getBaseProps();

  // Handle content fields - they don't need form data
  if (fieldConfig.type === "content") {
    const contentField = fieldConfig as ContentFieldConfig<T>;

    // If custom render function is provided, use it
    if (contentField.render) {
      // ContentFieldConfig.render expects a form, but ServerActionForm doesn't use React Hook Form
      // We provide a minimal mock - the render function should handle cases where form methods aren't fully implemented
      // Cast to satisfy the type requirements - the render function should be defensive about missing form methods
      const mockForm = {
        formState: { errors: {} },
        watch: () => ({}) as T,
      } as unknown as UseFormReturn<T>;

      // TypeScript can't safely call the union of render functions, so we cast
      // This is safe because the render function should handle the mock form gracefully
      const renderFn = contentField.render as (field: {
        form: UseFormReturn<T>;
        errors: FieldErrors<T>;
        isSubmitting: boolean;
      }) => React.ReactNode;

      return (
        <div className={contentField.className}>
          {renderFn({
            errors: {},
            form: mockForm,
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

  const fieldName = pathToString(fieldConfig.name);
  const fieldErrors = errors?.[fieldName];
  const clientError = clientErrors?.[fieldName];

  // Prefer client-side errors (shown immediately), fall back to server errors
  const errorMessage =
    clientError ||
    (fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined);

  // Get default value from prop or field config
  const getDefaultValue = () => {
    const fromProps = defaultValues?.[fieldName as keyof T];
    const fromField =
      "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined;

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
    const fromField =
      "defaultValue" in fieldConfig ? fieldConfig.defaultValue : undefined;

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
      if (fieldConfig.type === "checkbox") {
        setChecked(
          typeof newDefaultValue === "boolean" ? newDefaultValue : false,
        );
      } else if (fieldConfig.type === "checkboxGroup") {
        // For checkbox groups, value is an array
        const arrayValue = Array.isArray(newDefaultValue)
          ? newDefaultValue.map(String).join(",")
          : "";

        setValue(arrayValue);
      } else {
        setValue(
          typeof newDefaultValue === "string"
            ? newDefaultValue
            : String(newDefaultValue),
        );
      }
    }
  }, [defaultValues, fieldName, fieldConfig.type]);

  // Sync value to hidden input for FormData (only for DateInput which doesn't forward name prop)
  React.useEffect(() => {
    // Only DateInput needs a hidden input because it doesn't forward the name prop
    if (fieldConfig.type !== "date") {
      return;
    }

    const hiddenInput = document.querySelector(
      `input[type="hidden"][name="${fieldName}"]`,
    );

    // Type guard: ensure it's an HTMLInputElement
    if (!(hiddenInput instanceof HTMLInputElement)) {
      throw new Error(`Expected HTMLInputElement for field ${fieldName}`);
    }

    if (hiddenInput) {
      hiddenInput.value = value || "";
    }
  }, [value, fieldName, fieldConfig.type]);

  switch (fieldConfig.type) {
    case "input": {
      const stringConfig = fieldConfig as
        | StringFieldConfig<T>
        | StringFieldConfig<FieldValues>;
      const inputType = stringConfig.inputProps?.type || "text";

      return (
        <Input
          {...stringConfig.inputProps}
          name={fieldName}
          data-field-name={fieldName}
          type={inputType}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          value={value}
          onValueChange={setValue}
        />
      );
    }

    case "textarea": {
      const stringConfig = fieldConfig as
        | StringFieldConfig<T>
        | StringFieldConfig<FieldValues>;

      return (
        <Textarea
          {...stringConfig.textareaProps}
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          value={value}
          onValueChange={setValue}
        />
      );
    }

    case "checkbox": {
      const booleanConfig = fieldConfig as
        | BooleanFieldConfig<T>
        | BooleanFieldConfig<FieldValues>;

      // HeroUI Checkbox (built on React Aria) forwards the `value` prop to the underlying input
      // This ensures FormData includes the value when the checkbox is checked
      // Default to "on" (HTML standard), but allow users to customize via checkboxProps
      // According to HTML spec: if no value is specified, default is "on", but
      // explicitly setting it ensures consistent behavior across browsers and FormData
      const checkboxValue = booleanConfig.checkboxProps?.value ?? "on";

      // Use a ref and useEffect to ensure the value attribute is set on the underlying input
      // HeroUI Checkbox may not always forward the value prop correctly
      const containerRef = React.useRef<HTMLDivElement>(null);

      // Set value using useLayoutEffect to run synchronously after DOM mutations
      React.useLayoutEffect(() => {
        const setValue = () => {
          if (containerRef.current) {
            const input = containerRef.current.querySelector(
              `input[type="checkbox"][name="${fieldName}"]`,
            );

            // Type guard: check if element is HTMLInputElement
            if (input instanceof HTMLInputElement) {
              input.setAttribute("value", checkboxValue);
              // Also set the value property directly as a fallback
              input.value = checkboxValue;
            }
          }
        };

        // Set immediately
        setValue();

        // Also set after a short delay to catch async rendering
        const timeoutId = setTimeout(setValue, 0);

        return () => clearTimeout(timeoutId);
      }, [fieldName, checkboxValue, checked]);

      return (
        <div ref={containerRef}>
          <Checkbox
            {...booleanConfig.checkboxProps}
            name={fieldName}
            data-field-name={fieldName}
            value={checkboxValue}
            isDisabled={baseProps.isDisabled}
            isSelected={checked}
            onValueChange={setChecked}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
          >
            {baseProps.label}
          </Checkbox>
        </div>
      );
    }

    case "checkboxGroup": {
      const checkboxGroupConfig = fieldConfig as
        | CheckboxGroupFieldConfig<T>
        | CheckboxGroupFieldConfig<FieldValues>;
      const options = checkboxGroupConfig.checkboxGroupOptions || [];
      const currentValues = (
        value ? String(value).split(",").filter(Boolean) : []
      ) as string[];

      return (
        <div>
          {baseProps.label && (
            <label className="text-sm font-medium text-foreground block mb-2">
              {baseProps.label}
            </label>
          )}
          {baseProps.description && (
            <p className="text-sm text-default-500 mb-2">
              {baseProps.description}
            </p>
          )}
          <div
            className={
              checkboxGroupConfig.orientation === "horizontal"
                ? "flex flex-row gap-4 flex-wrap"
                : "flex flex-col gap-2"
            }
          >
            {options.map(
              (option: { label: string; value: string | number }) => {
                const optionValue = String(option.value);
                const isSelected = currentValues.includes(optionValue);

                return (
                  <Checkbox
                    key={optionValue}
                    {...checkboxGroupConfig.checkboxProps}
                    name={fieldName}
                    data-field-name={fieldName}
                    data-checkbox-value={optionValue}
                    isDisabled={baseProps.isDisabled}
                    isSelected={isSelected}
                    onValueChange={(checked) => {
                      const newValues = checked
                        ? [
                            ...currentValues.filter((v) => v !== optionValue),
                            optionValue,
                          ]
                        : currentValues.filter((v) => v !== optionValue);

                      setValue(newValues.join(","));
                    }}
                    isInvalid={Boolean(errorMessage)}
                    errorMessage={errorMessage}
                  >
                    {option.label}
                  </Checkbox>
                );
              },
            )}
          </div>
          {errorMessage && (
            <p className="text-tiny text-danger mt-1">{errorMessage}</p>
          )}
        </div>
      );
    }

    case "switch": {
      const booleanConfig = fieldConfig as
        | BooleanFieldConfig<T>
        | BooleanFieldConfig<FieldValues>;

      return (
        <Switch
          {...booleanConfig.switchProps}
          name={fieldName}
          data-field-name={fieldName}
          isDisabled={baseProps.isDisabled}
          isSelected={checked}
          onValueChange={setChecked}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
        >
          {baseProps.label}
        </Switch>
      );
    }

    case "select": {
      const stringConfig = fieldConfig as
        | StringFieldConfig<T>
        | StringFieldConfig<FieldValues>;
      const options = stringConfig.options || [];

      return (
        <Select
          {...stringConfig.selectProps}
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          selectedKeys={value ? [value] : []}
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0] as string;

            setValue(selectedValue || "");
          }}
        >
          {options.map((option: { label: string; value: string | number }) => (
            <SelectItem key={String(option.value)}>{option.label}</SelectItem>
          ))}
        </Select>
      );
    }

    case "radio": {
      const radioConfig = fieldConfig as
        | RadioFieldConfig<T>
        | RadioFieldConfig<FieldValues>;
      const options = radioConfig.radioOptions || [];

      return (
        <RadioGroup
          {...radioConfig.radioProps}
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          value={value || ""}
          onValueChange={setValue}
        >
          {options.map((option: { label: string; value: string | number }) => (
            <Radio key={String(option.value)} value={String(option.value)}>
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      );
    }

    case "autocomplete": {
      const stringConfig = fieldConfig as
        | StringFieldConfig<T>
        | StringFieldConfig<FieldValues>;
      const rawItems =
        typeof stringConfig.getOptions === "function"
          ? stringConfig.getOptions()
          : (stringConfig.options ?? []);
      const items = rawItems.map((opt) => ({
        label: opt.label,
        value: String(opt.value),
      }));

      return (
        <Autocomplete
          {...stringConfig.autocompleteProps}
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          selectedKey={value || null}
          inputValue={value || ""}
          onSelectionChange={(key) => {
            setValue(key ? String(key) : "");
          }}
          onInputChange={setValue}
          items={items}
        >
          {items.map((item: { label: string; value: string | number }) => (
            <AutocompleteItem key={String(item.value)}>
              {typeof stringConfig.renderItem === "function"
                ? stringConfig.renderItem(item)
                : item.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      );
    }

    case "slider": {
      const sliderConfig = fieldConfig as
        | SliderFieldConfig<T>
        | SliderFieldConfig<FieldValues>;
      const numValue = value ? Number(value) : 0;

      return (
        <Slider
          {...sliderConfig.sliderProps}
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          value={numValue}
          onChange={(val) => {
            const newValue = Array.isArray(val) ? val[0] : val;

            setValue(String(newValue));
          }}
        />
      );
    }

    case "date": {
      const dateConfig = fieldConfig as
        | DateFieldConfig<T>
        | DateFieldConfig<FieldValues>;

      // DateInput doesn't forward name to spinbuttons, so we rely on hidden input
      const dateValue = toCalendarDateValue(value);

      return (
        <>
          {/* Hidden native input for FormData - DateInput doesn't forward name prop */}
          <input type="hidden" name={fieldName} value={value || ""} />
          <DateInput
            {...dateConfig.dateProps}
            data-field-name={fieldName}
            label={baseProps.label}
            description={baseProps.description}
            isDisabled={baseProps.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            value={dateValue}
            onChange={(date) => {
              // Convert CalendarDate to string for FormData
              const dateString = date
                ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
                : "";

              setValue(dateString);
            }}
          />
        </>
      );
    }

    case "file": {
      const fileConfig = fieldConfig as
        | FileFieldConfig<T>
        | FileFieldConfig<FieldValues>;
      const multiple = fileConfig.multiple || false;
      const accept = fileConfig.accept;

      return (
        <>
          {/* File inputs handle name natively - no hidden input needed */}
          <Input
            {...fileConfig.fileProps}
            name={fieldName}
            data-field-name={fieldName}
            type="file"
            label={baseProps.label}
            description={baseProps.description}
            isDisabled={baseProps.isDisabled}
            isInvalid={Boolean(errorMessage)}
            errorMessage={errorMessage}
            multiple={multiple}
            accept={accept}
            onChange={(e) => {
              // Type guard: ensure target is HTMLInputElement
              if (!(e.target instanceof HTMLInputElement)) {
                return;
              }
              const target = e.target;

              // File inputs don't use value state - they're handled by FormData directly
              // But we can track the file count for validation purposes
              if (target.files) {
                setValue(String(target.files.length));
              }
            }}
          />
        </>
      );
    }

    default:
      // Fallback to basic input for unsupported types
      return (
        <Input
          name={fieldName}
          data-field-name={fieldName}
          label={baseProps.label}
          description={baseProps.description}
          isDisabled={baseProps.isDisabled}
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          value={value}
          onValueChange={setValue}
        />
      );
  }
}
