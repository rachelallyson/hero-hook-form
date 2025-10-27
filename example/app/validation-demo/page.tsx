"use client";

import React from "react";
import { z } from "zod";
import { 
  ZodForm, 
  createAdvancedBuilder,
  crossFieldValidation,
  validationPatterns,
  asyncValidation,
  errorMessages
} from "@rachelallyson/hero-hook-form";

// Enhanced validation schema with cross-field validation
const userRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  phone: z.string().regex(
    /^\(\d{3}\) \d{3}-\d{4}$/,
    "Please enter a valid phone number (XXX) XXX-XXXX"
  ),
  birthDate: z.string().regex(
    /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
    "Please enter a valid date (MM/DD/YYYY)"
  ),
  website: z.string().url("Please enter a valid URL").optional(),
  creditCard: z.string().regex(
    /^[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}$/,
    "Please enter a valid credit card number"
  ).optional(),
  ssn: z.string().regex(
    /^\d{3}-\d{2}-\d{4}$/,
    "Please enter a valid SSN (XXX-XX-XXXX)"
  ).optional(),
  zipCode: z.string().regex(
    /^\d{5}(-\d{4})?$/,
    "Please enter a valid ZIP code"
  ),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  newsletter: z.boolean().optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

const userRegistrationFields = createAdvancedBuilder<UserRegistrationForm>()
  .field("input","firstName", "First Name", { placeholder: "Enter your first name" })
  .field("input","lastName", "Last Name", { placeholder: "Enter your last name" })
  .field("input", "email", "Email Address", { placeholder: "Enter your email" })
  .field("input","password", "Password", { 
    type: "password",
    placeholder: "Enter a strong password"
  })
  .field("input","confirmPassword", "Confirm Password", { 
    type: "password",
    placeholder: "Confirm your password"
  })
  .field("input","phone", "Phone Number", { 
    type: "tel",
    placeholder: "(XXX) XXX-XXXX"
  })
  .field("input","birthDate", "Birth Date", { 
    placeholder: "MM/DD/YYYY"
  })
  .field("input","website", "Website", { 
    type: "url",
    placeholder: "https://example.com"
  })
  .field("input","creditCard", "Credit Card", { 
    placeholder: "1234 5678 9012 3456"
  })
  .field("input","ssn", "Social Security Number", { 
    placeholder: "XXX-XX-XXXX"
  })
  .field("input","zipCode", "ZIP Code", { 
    placeholder: "12345 or 12345-6789"
  })
  .field("checkbox","terms", "I agree to the Terms of Service", { required: true })
  .field("checkbox","newsletter", "Subscribe to newsletter")
  .build();

// Async validation demo
const asyncValidationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
});

type AsyncValidationForm = z.infer<typeof asyncValidationSchema>;

const asyncValidationFields = createAdvancedBuilder<AsyncValidationForm>()
  .field("input","username", "Username", { placeholder: "Enter your username" })
  .field("input", "email", "Email Address", { placeholder: "Enter your email" })
  .build();

export default function ValidationDemo() {
  const [asyncErrors, setAsyncErrors] = React.useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = React.useState(false);

  const handleUserSubmit = async (data: UserRegistrationForm) => {
    console.log("User registration submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAsyncSubmit = async (data: AsyncValidationForm) => {
    console.log("Async validation form submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Async validation handlers
  const handleUsernameChange = async (username: string) => {
    if (username.length < 3) return;
    
    setIsValidating(true);
    try {
      const isAvailable = await asyncValidation.usernameAvailability(username);
      if (!isAvailable) {
        setAsyncErrors(prev => ({ ...prev, username: "Username is already taken" }));
      } else {
        setAsyncErrors(prev => {
          const { username: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (error) {
      setAsyncErrors(prev => ({ ...prev, username: "Error checking username availability" }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleEmailChange = async (email: string) => {
    if (!email.includes("@")) return;
    
    setIsValidating(true);
    try {
      const isAvailable = await asyncValidation.emailAvailability(email);
      if (!isAvailable) {
        setAsyncErrors(prev => ({ ...prev, email: "Email is already registered" }));
      } else {
        setAsyncErrors(prev => {
          const { email: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (error) {
      setAsyncErrors(prev => ({ ...prev, email: "Error checking email availability" }));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Validation Patterns Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating comprehensive validation patterns, cross-field validation, and async validation
        </p>
      </div>

      {/* Validation Patterns Showcase */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Validation Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Email Validation</h3>
            <p className="text-sm text-gray-600">
              Built-in email format validation with custom error messages.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Phone Validation</h3>
            <p className="text-sm text-gray-600">
              US phone number format validation (XXX) XXX-XXXX.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Password Strength</h3>
            <p className="text-sm text-gray-600">
              Complex password requirements with multiple criteria.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">URL Validation</h3>
            <p className="text-sm text-gray-600">
              Website URL format validation with protocol checking.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Credit Card</h3>
            <p className="text-sm text-gray-600">
              Credit card number format validation with spacing support.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">SSN Validation</h3>
            <p className="text-sm text-gray-600">
              Social Security Number format validation XXX-XX-XXXX.
            </p>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          User Registration Form
        </h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates comprehensive validation patterns including cross-field validation.
        </p>
        
        <ZodForm
          config={{
            schema: userRegistrationSchema,
            fields: userRegistrationFields,
          }}
          onSubmit={handleUserSubmit}
          title="Create Account"
          subtitle="Complete registration with comprehensive validation"
          columns={2}
          layout="grid"
          showResetButton={true}
        />
      </div>

      {/* Async Validation Demo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Async Validation Demo
        </h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates async validation for username and email availability.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {asyncErrors.username && (
              <p className="text-red-600 text-sm mt-1">{asyncErrors.username}</p>
            )}
            {isValidating && (
              <p className="text-blue-600 text-sm mt-1">Checking availability...</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {asyncErrors.email && (
              <p className="text-red-600 text-sm mt-1">{asyncErrors.email}</p>
            )}
            {isValidating && (
              <p className="text-blue-600 text-sm mt-1">Checking availability...</p>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Field Validation Examples */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Cross-Field Validation Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Password Confirmation</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ensures password and confirm password fields match.
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`crossFieldValidation.passwordConfirmation("password", "confirmPassword")`}
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Date Range Validation</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ensures end date is after start date.
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`crossFieldValidation.dateRange("startDate", "endDate")`}
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Conditional Required</h3>
            <p className="text-sm text-gray-600 mb-2">
              Makes fields required based on other field values.
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`crossFieldValidation.conditionalRequired("phone", "contactMethod", "phone")`}
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Age Validation</h3>
            <p className="text-sm text-gray-600 mb-2">
              Validates age based on birth date.
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`crossFieldValidation.ageValidation("birthDate", 18)`}
            </code>
          </div>
        </div>
      </div>

      {/* Validation Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Validation Features</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Real-time Validation:</strong> Fields validate as you type with debounced validation.</p>
          <p><strong>Cross-field Validation:</strong> Password confirmation and date range validation.</p>
          <p><strong>Async Validation:</strong> Server-side validation for username and email availability.</p>
          <p><strong>Custom Error Messages:</strong> Tailored error messages for better user experience.</p>
          <p><strong>Validation Patterns:</strong> Pre-built patterns for common validation scenarios.</p>
          <p><strong>Accessibility:</strong> Proper ARIA labels and error associations.</p>
        </div>
      </div>
    </div>
  );
}
