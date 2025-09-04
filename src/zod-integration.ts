import type { FieldValues, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ZodFormConfig } from "./types";

/**
 * Simple Zod resolver that works with Zod v4
 */
function createZodResolver<T extends FieldValues>(
  schema: z.ZodSchema<T>,
): Resolver<T> {
  return async (values, context) => {
    try {
      const result = await schema.parseAsync(values);

      return {
        errors: {},
        values: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, { message: string }> = {};

        error.issues.forEach((err: z.ZodIssue) => {
          const path = err.path.join(".");

          errors[path] = { message: err.message };
        });

        return {
          errors,
          values: {} as T,
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
