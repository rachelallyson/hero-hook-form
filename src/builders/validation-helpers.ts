"use client";

import { z } from "zod";

/**
 * Common validation patterns for forms
 */
export const validationPatterns = {
  // Credit card validation
  creditCard: z.string().regex(
    // eslint-disable-next-line no-useless-escape
    /^[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}$/,
    "Please enter a valid credit card number",
  ),

  // Date validation (MM/DD/YYYY)
  date: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
      "Please enter a valid date (MM/DD/YYYY)",
    ),

  // Email validation
  email: z.string().email("Please enter a valid email address"),

  // Password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  // Phone number validation (international)
  phoneInternational: z
    .string()
    // eslint-disable-next-line no-useless-escape
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),

  // Phone number validation (US format)
  phoneUS: z
    .string()
    .regex(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Please enter a valid phone number (XXX) XXX-XXXX",
    ),

  // SSN validation
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "Please enter a valid SSN (XXX-XX-XXXX)"),

  // Strong password validation
  strongPassword: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  // Time validation (HH:MM AM/PM)
  time: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "Please enter a valid time (HH:MM AM/PM)",
    ),

  // URL validation
  url: z.string().url("Please enter a valid URL"),

  // ZIP code validation
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
};

/**
 * Async validation helpers
 */
export const asyncValidation = {
  /**
   * Email availability check
   */
  emailAvailability: async (email: string): Promise<boolean> => {
    // This would typically make an API call
    // For demo purposes, we'll simulate a check
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate some emails being taken
        const takenEmails = ["test@example.com", "admin@example.com"];

        resolve(!takenEmails.includes(email));
      }, 1000);
    });
  },

  /**
   * Username availability check
   */
  usernameAvailability: async (username: string): Promise<boolean> => {
    // This would typically make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const takenUsernames = ["admin", "test", "user"];

        resolve(!takenUsernames.includes(username.toLowerCase()));
      }, 1000);
    });
  },
};

/**
 * Custom error messages
 */
export const errorMessages = {
  date: () => "Please enter a valid date",
  email: () => "Please enter a valid email address",
  max: (fieldName: string, max: number) =>
    `${fieldName} must be no more than ${max}`,
  maxLength: (fieldName: string, max: number) =>
    `${fieldName} must be no more than ${max} characters`,
  min: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min}`,
  minLength: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min} characters`,
  pattern: (fieldName: string) => `${fieldName} format is invalid`,
  phone: () => "Please enter a valid phone number",
  required: (fieldName: string) => `${fieldName} is required`,
  time: () => "Please enter a valid time",
  url: () => "Please enter a valid URL",
};

/**
 * Server-side validation integration
 */
export const serverValidation = {
  /**
   * Apply server errors to form
   */
  applyServerErrors: (errors: Record<string, string[]>, setError: any) => {
    Object.entries(errors).forEach(([field, messages]) => {
      setError(field, {
        message: messages[0],
        type: "server", // Use first error message
      });
    });
  },

  /**
   * Clear server errors
   */
  clearServerErrors: (fields: string[], clearErrors: any) => {
    fields.forEach((field) => {
      clearErrors(field, "server");
    });
  },
};

/**
 * Form validation utilities
 */
export const validationUtils = {
  /**
   * Debounced validation
   */
  debounceValidation: (fn: (...args: any[]) => void, delay = 300) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Get field error message
   */
  getFieldError: (
    errors: Record<string, string>,
    field: string,
  ): string | undefined => {
    return errors[field];
  },

  /**
   * Check if field has error
   */
  hasFieldError: (errors: Record<string, string>, field: string): boolean => {
    return !!errors[field];
  },

  /**
   * Validate form data against schema
   */
  validateForm: async (data: any, schema: z.ZodSchema) => {
    try {
      await schema.parseAsync(data);

      return { errors: {}, success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};

        error.issues.forEach((err: any) => {
          const path = err.path.join(".");

          errors[path] = err.message;
        });

        return { errors, success: false };
      }
      throw error;
    }
  },
};
