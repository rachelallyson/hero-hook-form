"use client";

import { z } from "zod";

/**
 * Common validation patterns for forms
 */
export const validationPatterns = {
  // Email validation
  email: z.string().email("Please enter a valid email address"),
  
  // Phone number validation (US format)
  phoneUS: z.string().regex(
    /^\(\d{3}\) \d{3}-\d{4}$/,
    "Please enter a valid phone number (XXX) XXX-XXXX"
  ),
  
  // Phone number validation (international)
  phoneInternational: z.string().regex(
    /^\+?[\d\s\-\(\)]+$/,
    "Please enter a valid phone number"
  ),
  
  // URL validation
  url: z.string().url("Please enter a valid URL"),
  
  // Password validation
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  // Strong password validation
  strongPassword: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  // Credit card validation
  creditCard: z.string().regex(
    /^[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}$/,
    "Please enter a valid credit card number"
  ),
  
  // SSN validation
  ssn: z.string().regex(
    /^\d{3}-\d{2}-\d{4}$/,
    "Please enter a valid SSN (XXX-XX-XXXX)"
  ),
  
  // ZIP code validation
  zipCode: z.string().regex(
    /^\d{5}(-\d{4})?$/,
    "Please enter a valid ZIP code"
  ),
  
  // Date validation (MM/DD/YYYY)
  date: z.string().regex(
    /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
    "Please enter a valid date (MM/DD/YYYY)"
  ),
  
  // Time validation (HH:MM AM/PM)
  time: z.string().regex(
    /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
    "Please enter a valid time (HH:MM AM/PM)"
  ),
};

/**
 * Cross-field validation helpers
 */
// Cross-field validation is exported from utils/validation.ts
const crossFieldValidation = {
  /**
   * Password confirmation validation
   */
  passwordConfirmation: (passwordField: string, confirmField: string) => {
    return z.object({
      [passwordField]: z.string(),
      [confirmField]: z.string(),
    }).refine(
      (data) => data[passwordField] === data[confirmField],
      {
        message: "Passwords do not match",
        path: [confirmField],
      }
    );
  },

  /**
   * Date range validation
   */
  dateRange: (startField: string, endField: string) => {
    return z.object({
      [startField]: z.string(),
      [endField]: z.string(),
    }).refine(
      (data) => {
        const startDate = new Date(data[startField]);
        const endDate = new Date(data[endField]);
        return startDate < endDate;
      },
      {
        message: "End date must be after start date",
        path: [endField],
      }
    );
  },

  /**
   * Conditional required field validation
   */
  conditionalRequired: (field: string, conditionField: string, conditionValue: any) => {
    return z.object({
      [field]: z.string(),
      [conditionField]: z.any(),
    }).refine(
      (data) => {
        if (data[conditionField] === conditionValue) {
          return data[field] && data[field].trim().length > 0;
        }
        return true;
      },
      {
        message: "This field is required",
        path: [field],
      }
    );
  },

  /**
   * Age validation based on birth date
   */
  ageValidation: (birthDateField: string, minAge: number = 18) => {
    return z.object({
      [birthDateField]: z.string(),
    }).refine(
      (data) => {
        const birthDate = new Date(data[birthDateField]);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= minAge;
        }
        return age >= minAge;
      },
      {
        message: `You must be at least ${minAge} years old`,
        path: [birthDateField],
      }
    );
  },
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
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) => 
    `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) => 
    `${fieldName} must be no more than ${max} characters`,
  min: (fieldName: string, min: number) => 
    `${fieldName} must be at least ${min}`,
  max: (fieldName: string, max: number) => 
    `${fieldName} must be no more than ${max}`,
  pattern: (fieldName: string) => 
    `${fieldName} format is invalid`,
  email: () => "Please enter a valid email address",
  url: () => "Please enter a valid URL",
  phone: () => "Please enter a valid phone number",
  date: () => "Please enter a valid date",
  time: () => "Please enter a valid time",
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
        type: "server",
        message: messages[0], // Use first error message
      });
    });
  },

  /**
   * Clear server errors
   */
  clearServerErrors: (fields: string[], clearErrors: any) => {
    fields.forEach(field => {
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
  debounceValidation: (fn: Function, delay: number = 300) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Validate form data against schema
   */
  validateForm: async (data: any, schema: z.ZodSchema) => {
    try {
      await schema.parseAsync(data);
      return { success: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        return { success: false, errors };
      }
      throw error;
    }
  },

  /**
   * Get field error message
   */
  getFieldError: (errors: Record<string, string>, field: string): string | undefined => {
    return errors[field];
  },

  /**
   * Check if field has error
   */
  hasFieldError: (errors: Record<string, string>, field: string): boolean => {
    return !!errors[field];
  },
};
