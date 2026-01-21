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
 * Hook for using Zod validation with React Hook Form
 */
export function useZodForm<TFieldValues extends FieldValues>(
  config: ZodFormConfig<TFieldValues>,
) {
  if (!config.resolver && config.schema) {
    config.resolver = createZodResolver(config.schema);
  }

  return useForm<TFieldValues>(config);
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
