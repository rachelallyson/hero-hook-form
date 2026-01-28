import { CalendarDate } from "@internationalized/date";
import type {
  DefaultValues,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ZodFormConfig, ZodFormFieldConfig } from "./types";

/**
 * Simple Zod resolver that works with Zod v4
 */
function createZodResolver<T extends FieldValues>(
  schema: z.ZodSchema<T>,
): Resolver<T> {
  return async (values) => {
    try {
      const result = await schema.parseAsync(values);

      return {
        errors: {} as Record<string, never>,
        values: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, { message: string }> = {};

        error.issues.forEach((err: z.ZodIssue) => {
          const path = err.path.join(".");

          errors[path] = { message: err.message };
        });

        // Convert Zod errors to FieldErrors format
        // Zod errors are structured differently, so we need to transform them
        // We build the errors object and then type it as FieldErrors<T>
        const fieldErrors: Record<string, { message: string }> = {};

        Object.entries(errors).forEach(([path, error]) => {
          fieldErrors[path] = error;
        });

        return {
          // TypeScript can't prove all paths are valid field paths, but at runtime they will be
          // because Zod validates against the schema which matches T
          // This is a necessary type assertion due to TypeScript's limitations with dynamic paths
          errors: fieldErrors as FieldErrors<T>,
          values: {} as Record<string, never>,
        };
      }

      throw error;
    }
  };
}

/**
 * Convert Date, ISO string, or CalendarDate to CalendarDate.
 * Returns null if input is null/undefined.
 */
function toCalendarDate(
  value: unknown,
): import("@internationalized/date").CalendarDate | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Already a CalendarDate
  if (
    typeof value === "object" &&
    "year" in value &&
    "month" in value &&
    "day" in value &&
    typeof (value as { year: unknown }).year === "number"
  ) {
    return value as CalendarDate;
  }

  // Date object
  if (value instanceof Date) {
    return new CalendarDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  // ISO string (YYYY-MM-DD or full ISO)
  if (typeof value === "string") {
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      );
    }
  }

  // Fallback: try to return as-is (might already be CalendarDate with different shape)
  return value as CalendarDate | null;
}

/**
 * Build default values from field configs (fields that have a name and defaultValue property).
 * Used so date and other fields can set default via field config when config.defaultValues is partial.
 * Automatically converts Date/string values to CalendarDate for date fields.
 */
function defaultValuesFromFields<T extends FieldValues>(
  fields: ZodFormFieldConfig<T>[],
): Partial<T> {
  const out: Record<string, unknown> = {};
  const dateFieldNames = new Set<string>();

  // First pass: identify date fields
  for (const field of fields) {
    if ("name" in field && field.name !== undefined && field.type === "date") {
      dateFieldNames.add(String(field.name));
    }
  }

  // Second pass: collect defaults and convert date values
  for (const field of fields) {
    if (
      "name" in field &&
      field.name !== undefined &&
      "defaultValue" in field &&
      field.defaultValue !== undefined
    ) {
      const fieldName = String(field.name);
      let value = field.defaultValue;

      // Convert Date/string to CalendarDate for date fields
      if (dateFieldNames.has(fieldName)) {
        value = toCalendarDate(value);
      }

      out[fieldName] = value;
    }
  }

  return out as Partial<T>;
}

/**
 * Hook for using Zod validation with React Hook Form
 */
export function useZodForm<TFieldValues extends FieldValues>(
  config: ZodFormConfig<TFieldValues>,
) {
  const resolver =
    config.resolver ??
    (config.schema ? createZodResolver(config.schema) : undefined);

  const fieldDefaults = defaultValuesFromFields(
    config.fields as ZodFormFieldConfig<TFieldValues>[],
  );
  const hasFieldDefaults = Object.keys(fieldDefaults).length > 0;

  // Convert Date/string values to CalendarDate for date fields in config.defaultValues
  const dateFieldNames = new Set<string>();

  for (const field of config.fields) {
    if ("name" in field && field.name !== undefined && field.type === "date") {
      dateFieldNames.add(String(field.name));
    }
  }

  const convertedConfigDefaults = config.defaultValues
    ? Object.entries(config.defaultValues).reduce(
        (acc, [key, value]) => {
          acc[key] = dateFieldNames.has(key) ? toCalendarDate(value) : value;

          return acc;
        },
        {} as Record<string, unknown>,
      )
    : undefined;

  const mergedDefaultValues: DefaultValues<TFieldValues> | undefined =
    hasFieldDefaults || convertedConfigDefaults
      ? ({
          ...fieldDefaults,
          ...convertedConfigDefaults,
        } as DefaultValues<TFieldValues>)
      : convertedConfigDefaults;

  return useForm<TFieldValues>({
    ...config,
    ...(resolver && { resolver }),
    defaultValues: mergedDefaultValues,
  });
}

/**
 * Helper function to create Zod form configurations
 */
export function createZodFormConfig<TFieldValues extends FieldValues>(
  schema: z.ZodSchema<TFieldValues>,
  fields: ZodFormFieldConfig<TFieldValues>[],
  defaultValues?: DefaultValues<TFieldValues>,
): ZodFormConfig<TFieldValues> {
  return {
    fields,
    schema,
    ...(defaultValues && { defaultValues }),
  };
}
