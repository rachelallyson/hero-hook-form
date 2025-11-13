"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  createAdvancedBuilder,
  createTypeInferredBuilder,
  createField,
  createFieldArrayBuilder,
  ZodForm,
  FormStatus,
  useEnhancedFormState,
  useDebouncedValidation,
  validationPatterns,
  crossFieldValidation,
} from "@rachelallyson/hero-hook-form";

// Enhanced form with all new features
const enhancedFormSchema = z
  .object({
    advancedField: z.string().optional(),

    email: z.string().email("Invalid email address"),

    // Field array
    items: z
      .array(
        z.object({
          name: z.string().min(1, "Item name is required"),
          value: z.string().optional(),
        }),
      )
      .min(1, "At least one item is required"),

    // Basic fields
    name: z.string().min(2, "Name must be at least 2 characters"),

    
    confirmPassword: z.string(),

    // Cross-field validation
password: z.string().min(8, "Password must be at least 8 characters"),

    phone: z.string().optional(),

    sectionField1: z.string().optional(),

    sectionField2: z.string().optional(),

    // Conditional field
    showAdvanced: z.boolean().optional(),
    // Dynamic section
    showSection: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EnhancedFormData = z.infer<typeof enhancedFormSchema>;

const EnhancedFeaturesPage = () => {
  const handleSubmit = async (data: any) => {
    console.log("Form submitted successfully:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Advanced Form Builder
  const advancedBuilder = createAdvancedBuilder<EnhancedFormData>();
  const advancedFields = advancedBuilder
    .field("input", "name", "Full Name", {
      placeholder: "Enter your full name",
      required: true,
    })
    .field("input", "email", "Email Address", {
      placeholder: "Enter your email",
      required: true,
      type: "email",
    })
    .field("input", "phone", "Phone Number", {
      placeholder: "Enter your phone number",
      type: "tel",
    })
    .field("switch", "showAdvanced", "Show Advanced Options")
    .conditionalField(
      "advancedField",
      (data) => data.showAdvanced === true,
      createField("input", "advancedField", "Advanced Field", {
        placeholder: "This field appears when switch is on",
      }),
    )
    .fieldArray(
      "items",
      "Items",
      createFieldArrayBuilder("items")
        .field("input", "name", "Item Name", { placeholder: "Enter item name" })
        .field("input", "value", "Item Value", {
          placeholder: "Enter item value",
        })
        .build(),
      {
        addButtonText: "Add Item",
        max: 5,
        min: 1,
        removeButtonText: "Remove",
      },
    )
    .field("switch", "showSection", "Show Dynamic Section")
    .conditionalField(
      "sectionField1",
      (data) => data.showSection === true,
      createField("input", "sectionField1", "Section Field 1", {
        placeholder: "Enter section field 1",
      }),
    )
    .conditionalField(
      "sectionField2",
      (data) => data.showSection === true,
      createField("input", "sectionField2", "Section Field 2", {
        placeholder: "Enter section field 2",
      }),
    )
    .field("input", "password", "Password", {
      placeholder: "Enter your password",
      required: true,
      type: "password",
    })
    .field("input", "confirmPassword", "Confirm Password", {
      placeholder: "Confirm your password",
      required: true,
      type: "password",
    })
    .build();

  // Type-Inferred Builder - Showcase automatic schema generation
  const typeInferredBuilder = createTypeInferredBuilder<{
    name: string;
    email: string;
    phone: string;
    age: number;
    website: string;
    bio: string;
  }>();
  const typeInferredConfig = typeInferredBuilder
    .text("name", "Full Name", {
      maxLength: 50,
      minLength: 2,
      placeholder: "Enter your full name",
    })
    .email("email", "Email Address", {
      placeholder: "Enter your email",
    })
    .text("phone", "Phone Number", {
      pattern: "^[\\d\\s\\-\\+\\(\\)]+$",
      placeholder: "Enter your phone number",
    })
    .number("age", "Age", {
      max: 120,
      min: 13,
      placeholder: "Enter your age",
    })
    .text("website", "Website", {
      pattern: "^https?://.+",
      placeholder: "https://example.com",
    })
    .textarea("bio", "Bio", {
      minLength: 10,
      placeholder: "Tell us about yourself",
      rows: 4,
    })
    .build();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enhanced Features Demo
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Comprehensive demonstration of all enhanced features
        </p>
      </div>

      {/* Enhanced Form State */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Enhanced Form State</h2>
        {/* Form status would go here */}

        <ZodForm
          config={{
            fields: advancedFields,
            schema: enhancedFormSchema,
          }}
          onSubmit={handleSubmit}
          onError={(error) => console.error("Form error:", error)}
          submitButtonText="Submit Enhanced Form"
          className="space-y-4"
        />
      </div>

      {/* Type-Inferred Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Type-Inferred Form</h2>
        <p className="text-gray-600 mb-4">
          This form automatically generates Zod schema from field definitions.
          Notice how we define validation rules directly in the field options
          (minLength, pattern) and the schema is created automatically.
        </p>

        <ZodForm
          config={typeInferredConfig}
          onSubmit={(data) => {
            console.log("Type-inferred form submitted:", data);
            alert(
              `Type-inferred form submitted: ${JSON.stringify(data, null, 2)}`,
            );
          }}
          onError={(error) => console.error("Type-inferred form error:", error)}
          submitButtonText="Submit Type-Inferred Form"
          className="space-y-4"
        />
      </div>

      {/* Performance Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Performance Features</h2>
        <p className="text-gray-600 mb-4">
          Debounced validation and memoized components
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Debounced Email Validation
            </label>
            <input
              type="email"
              placeholder="Type to see debounced validation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => console.log("Email validation:", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Validation Patterns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Validation Patterns</h2>
        <p className="text-gray-600 mb-4">
          Common validation patterns and cross-field validation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Available Patterns:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Required fields</li>
              <li>• Email validation</li>
              <li>• Phone validation</li>
              <li>• Password strength</li>
              <li>• Positive numbers</li>
              <li>• Date ranges</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Cross-Field Validation:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Password confirmation</li>
              <li>• Date range validation</li>
              <li>• Conditional requirements</li>
              <li>• Custom business rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeaturesPage;
