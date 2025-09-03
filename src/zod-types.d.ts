// Module augmentation for Zod types when available
declare module "zod" {
  export interface ZodSchema<T = unknown> {
    __brand: "ZodSchema";
    parse: (data: unknown) => T;
    safeParse: (data: unknown) => {
      success: boolean;
      data?: T;
      error?: unknown;
    };
  }
}

// Conditional type helper
export type ZodSchemaType = typeof import("zod") extends { ZodSchema: infer T }
  ? T
  : unknown;
