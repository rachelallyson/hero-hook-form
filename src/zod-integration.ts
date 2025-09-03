import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { ZodFormConfig } from "./types";

/**
 * Hook for using Zod validation with React Hook Form
 * This hook is only available when zod and @hookform/resolvers are installed
 *
 * TODO: Remove type assertion when @hookform/resolvers adds official Zod v4 support
 *
 * Current issue: @hookform/resolvers v5.2.1 is not compatible with Zod v4 due to
 * internal type structure changes. The resolver expects Zod3Type<Output, Input> but
 * Zod v4 uses a different internal structure (_zod.output vs _output).
 *
 * Related issues:
 * - GitHub Issue: https://github.com/react-hook-form/resolvers/issues/813
 * - GitHub PR: https://github.com/react-hook-form/resolvers/pull/803
 *
 * Workaround: Use type assertion until official support is added
 */
/**
 * Hook for using Zod validation with React Hook Form
 * Uses Zod's built-in type inference to avoid type assertion issues
 */
export function useZodForm<TFieldValues extends FieldValues>(
  config: ZodFormConfig<TFieldValues>,
) {
  if (!config.resolver && config.schema) {
    // Type assertion needed for both the function call and assignment due to Zod v4 compatibility
    // This is safe because the runtime behavior is correct, only TypeScript can't verify it
    // TODO: Remove when @hookform/resolvers adds official Zod v4 support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolver = zodResolver(config.schema as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.resolver = resolver as Resolver<TFieldValues, any, TFieldValues>;
  }

  const formConfig = {
    ...config,
  };

  return useForm<TFieldValues>(formConfig);
}
