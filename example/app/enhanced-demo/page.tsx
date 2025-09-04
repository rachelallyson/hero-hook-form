"use client";

import React from "react";
import { z } from "zod";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { commonValidations } from "@rachelallyson/hero-hook-form/utils/validation";
import { createFormTestUtils } from "@rachelallyson/hero-hook-form/utils/testing";

// Enhanced form schema with validation utilities
const enhancedFormSchema = z.object({
  // Basic fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: commonValidations.email,
  phone: commonValidations.phone,

  // Conditional fields
  hasPhone: z.boolean().default(false),
  phoneNumber: z.string().optional(),

  // Advanced fields
  role: z.enum(["admin", "user", "guest"]).default("user"),
  experience: z.number().min(0).max(50),
  skills: z.array(z.string()).min(1, "Select at least one skill"),

  // File upload
  avatar: z.instanceof(File).optional(),

  // Terms and conditions
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),

  // Custom field
  customField: z.string().optional(),
});

type EnhancedFormData = z.infer<typeof enhancedFormSchema>;

export default function EnhancedDemoPage() {
  const [formData, setFormData] = React.useState<EnhancedFormData | null>(null);
  const [testUtils, setTestUtils] = React.useState<any>(null);

  const formConfig = {
    schema: enhancedFormSchema,
    fields: [
      // Basic information section
      {
        name: "firstName" as const,
        type: "input" as const,
        label: "First Name",
        description: "Enter your first name",
        inputProps: { type: "text", placeholder: "John" },
        group: "basic",
      },
      {
        name: "lastName" as const,
        type: "input" as const,
        label: "Last Name",
        description: "Enter your last name",
        inputProps: { type: "text", placeholder: "Doe" },
        group: "basic",
      },
      {
        name: "email" as const,
        type: "input" as const,
        label: "Email Address",
        description: "We'll never share your email",
        inputProps: { type: "email", placeholder: "john@example.com" },
        group: "basic",
      },

      // Conditional phone field
      {
        name: "hasPhone" as const,
        type: "switch" as const,
        label: "I have a phone number",
        description: "Enable this to add your phone number",
        group: "contact",
      },
      {
        name: "phoneNumber" as const,
        type: "input" as const,
        label: "Phone Number",
        description: "Your contact phone number",
        inputProps: { type: "tel", placeholder: "+1 (555) 123-4567" },
        dependsOn: "hasPhone" as const,
        dependsOnValue: true,
        group: "contact",
      },

      // Role selection
      {
        name: "role" as const,
        type: "select" as const,
        label: "Role",
        description: "Select your role in the organization",
        options: [
          { label: "Administrator", value: "admin" },
          { label: "Regular User", value: "user" },
          { label: "Guest", value: "guest" },
        ],
        group: "role",
      },

      // Experience slider
      {
        name: "experience" as const,
        type: "slider" as const,
        label: "Years of Experience",
        description: "How many years of experience do you have?",
        sliderProps: { min: 0, max: 50, step: 1 },
        group: "experience",
      },

      // Skills (custom field example)
      {
        name: "skills" as const,
        type: "custom" as const,
        label: "Skills",
        description: "Select your technical skills",
        render: ({ form, name }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Skills
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["React", "TypeScript", "Node.js", "Python", "Java", "Go"].map(
                (skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        const currentSkills = form.getValues(name) || [];

                        if (e.target.checked) {
                          form.setValue(name, [...currentSkills, skill]);
                        } else {
                          form.setValue(
                            name,
                            currentSkills.filter((s: string) => s !== skill),
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        ),
        group: "skills",
      },

      // File upload
      {
        name: "avatar" as const,
        type: "file" as const,
        label: "Profile Picture",
        description: "Upload a profile picture (optional)",
        accept: "image/*",
        fileProps: { multiple: false },
        group: "profile",
      },

      // Terms and conditions
      {
        name: "agreeToTerms" as const,
        type: "checkbox" as const,
        label: "I agree to the terms and conditions",
        description: "Please read and accept our terms of service",
        group: "agreement",
      },
    ],

    // Enhanced error handling
    onError: (errors) => {
      console.log("Form validation errors:", errors);
    },

    // Custom render function for advanced use cases
    render: ({ form, isSubmitting, errors, values }) => {
      // Set up test utils for debugging
      React.useEffect(() => {
        setTestUtils(createFormTestUtils(form));
      }, [form]);

      return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Enhanced Form Demo
            </h1>
            <p className="text-muted-foreground">
              Demonstrating advanced features of the hero-hook-form package
            </p>
          </div>

          {/* Form Debug Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Form State Debug</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Is Submitting:</strong> {isSubmitting ? "Yes" : "No"}
              </div>
              <div>
                <strong>Has Errors:</strong>{" "}
                {Object.keys(errors).length > 0 ? "Yes" : "No"}
              </div>
              <div className="col-span-2">
                <strong>Current Values:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form
            className="space-y-6" onSubmit={form.handleSubmit((data) => {
            setFormData(data);
            console.log("Form submitted:", data);
          })}>
          >
            {/* Basic Information Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    First Name
                  </label>
                  <input
                    {...form.register("firstName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                    type="text"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    {...form.register("lastName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                    type="text"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email Address
                </label>
                <input
                  {...form.register("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Contact Information
              </h2>

              <div className="flex items-center space-x-2">
                <input
                  {...form.register("hasPhone")}
                  className="rounded border-gray-300"
                  type="checkbox"
                />
                <label className="text-sm font-medium text-foreground">
                  I have a phone number
                </label>
              </div>

              {form.watch("hasPhone") && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    {...form.register("phoneNumber")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Role and Experience Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Role & Experience
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Role
                </label>
                <select
                  {...form.register("role")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                  <option value="guest">Guest</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Years of Experience: {form.watch("experience") || 0}
                </label>
                <input
                  {...form.register("experience", { valueAsNumber: true })}
                  className="w-full"
                  max="50"
                  min="0"
                  step="1"
                  type="range"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            {/* Skills Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Skills
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {["React", "TypeScript", "Node.js", "Python", "Java", "Go"].map(
                  (skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          const currentSkills = form.getValues("skills") || [];

                          if (e.target.checked) {
                            form.setValue("skills", [...currentSkills, skill]);
                          } else {
                            form.setValue(
                              "skills",
                              currentSkills.filter((s: string) => s !== skill),
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ),
                )}
              </div>
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* Profile Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Profile
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Profile Picture
                </label>
                <input
                  {...form.register("avatar")}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                />
                {errors.avatar && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.avatar.message}
                  </p>
                )}
              </div>
            </div>

            {/* Agreement Group */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Agreement
              </h2>

              <div className="flex items-start space-x-2">
                <input
                  {...form.register("agreeToTerms")}
                  className="mt-1 rounded border-gray-300"
                  type="checkbox"
                />
                <div>
                  <label className="text-sm font-medium text-foreground">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please read and accept our terms of service
                  </p>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Test Utils Debug */}
          {testUtils && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Utils Available</h3>
              <p className="text-sm text-blue-700">
                Form test utilities are available in the console. Try:
                testUtils.getFormState()
              </p>
            </div>
          )}
        </div>
      );
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ZodForm
        config={formConfig}
        onError={(error) => {
          console.error("Form submission error:", error);
        }}
        onSubmit={async (data) => {
          console.log("Form submitted with data:", data);
          setFormData(data);
        }}
        onSuccess={(data) => {
          console.log("Form submission successful:", data);
        }}
      />

      {/* Display submitted data */}
      {formData && (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              Form Submitted Successfully!
            </h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
