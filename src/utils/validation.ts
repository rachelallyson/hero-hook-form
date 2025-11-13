import { z } from "zod";

/**
 * Validation utility functions for common form validation patterns
 * These utilities help create consistent validation schemas across forms
 */

/**
 * Creates a minimum length validation schema
 */
export const createMinLengthSchema = (min: number, fieldName: string) =>
  z.string().min(min, `${fieldName} must be at least ${min} characters`);

/**
 * Creates a maximum length validation schema
 */
export const createMaxLengthSchema = (max: number, fieldName: string) =>
  z.string().max(max, `${fieldName} must be no more than ${max} characters`);

/**
 * Creates an email validation schema
 */
export const createEmailSchema = () =>
  z.email("Please enter a valid email address");

/**
 * Creates a required field validation schema
 */
export const createRequiredSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Creates a URL validation schema
 */
export const createUrlSchema = () => z.string().url("Please enter a valid URL");

/**
 * Creates a phone number validation schema
 */
export const createPhoneSchema = () =>
  z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number");

/**
 * Creates a password validation schema with common requirements
 */
export const createPasswordSchema = (minLength = 8) =>
  z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    );

/**
 * Creates a number validation schema with range
 */
export const createNumberRangeSchema = (
  min: number,
  max: number,
  fieldName: string,
) =>
  z
    .number()
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} must be no more than ${max}`);

/**
 * Creates a date validation schema
 */
export const createDateSchema = (fieldName: string) =>
  z.date({ message: `${fieldName} is required` });

/**
 * Creates a future date validation schema
 */
export const createFutureDateSchema = (fieldName: string) =>
  z
    .date({ message: `${fieldName} is required` })
    .refine((date) => date > new Date(), {
      message: `${fieldName} must be in the future`,
    });

/**
 * Creates a past date validation schema
 */
export const createPastDateSchema = (fieldName: string) =>
  z
    .date({ message: `${fieldName} is required` })
    .refine((date) => date < new Date(), {
      message: `${fieldName} must be in the past`,
    });

/**
 * Creates a file validation schema
 */
export const createFileSchema = (
  maxSizeInMB = 5,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/gif"],
) =>
  z
    .instanceof(File)
    .refine(
      (file) => file.size <= maxSizeInMB * 1024 * 1024,
      `File size must be less than ${maxSizeInMB}MB`,
    )
    .refine(
      (file) => allowedTypes.includes(file.type),
      `File type must be one of: ${allowedTypes.join(", ")}`,
    );

/**
 * Creates a checkbox validation schema (must be checked)
 */
export const createRequiredCheckboxSchema = (fieldName: string) =>
  z.boolean().refine((val) => val === true, {
    message: `You must agree to ${fieldName}`,
  });

/**
 * Cross-field validation helpers
 */
export const crossFieldValidation = {
  /**
   * Conditional required field validation
   */
  conditionalRequired: (
    field: string,
    conditionField: string,
    conditionValue: any,
  ) => {
    return z
      .object({
        [conditionField]: z.any(),
        [field]: z.string(),
      })
      .refine(
        (data) => {
          if (data[conditionField] === conditionValue) {
            return data[field] && data[field].trim().length > 0;
          }

          return true;
        },
        {
          message: "This field is required",
          path: [field],
        },
      );
  },

  /**
   * Date range validation
   */
  dateRange: (startField: string, endField: string) => {
    return z
      .object({
        [endField]: z.string(),
        [startField]: z.string(),
      })
      .refine(
        (data) => {
          const startDate = new Date(data[startField]);
          const endDate = new Date(data[endField]);

          return startDate < endDate;
        },
        {
          message: "End date must be after start date",
          path: [endField],
        },
      );
  },

  /**
   * Password confirmation validation
   */
  passwordConfirmation: (passwordField: string, confirmField: string) => {
    return z
      .object({
        [confirmField]: z.string(),
        [passwordField]: z.string(),
      })
      .refine((data) => data[passwordField] === data[confirmField], {
        message: "Passwords do not match",
        path: [confirmField],
      });
  },
};

/**
 * Common validation patterns for forms
 */
export const commonValidations = {
  confirmPassword: (passwordField: string, confirmField: string) =>
    crossFieldValidation.passwordConfirmation(passwordField, confirmField),
  date: (fieldName: string) => createDateSchema(fieldName),
  email: createEmailSchema(),
  file: (maxSizeInMB?: number, allowedTypes?: string[]) =>
    createFileSchema(maxSizeInMB, allowedTypes),
  futureDate: (fieldName: string) => createFutureDateSchema(fieldName),
  maxLength: (max: number, fieldName: string) =>
    createMaxLengthSchema(max, fieldName),
  minLength: (min: number, fieldName: string) =>
    createMinLengthSchema(min, fieldName),
  numberRange: (min: number, max: number, fieldName: string) =>
    createNumberRangeSchema(min, max, fieldName),
  password: (minLength?: number) => createPasswordSchema(minLength),
  pastDate: (fieldName: string) => createPastDateSchema(fieldName),
  phone: createPhoneSchema(),
  required: (fieldName: string) => createRequiredSchema(fieldName),
  requiredCheckbox: (fieldName: string) =>
    createRequiredCheckboxSchema(fieldName),
  url: createUrlSchema(),
};
