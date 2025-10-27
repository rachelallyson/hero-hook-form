"use client";

import React from "react";
import { z } from "zod";
import {
  ZodForm,
  createBasicFormBuilder,
  FormFieldHelpers,
  CommonFields,
} from "@rachelallyson/hero-hook-form";

// Define the form schema with Zod
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  country: z.string().min(1, "Please select a country"),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function SimpleFormDemo() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simple Form Building Demo</h1>
        <p className="text-gray-600">
          This demonstrates the new simple form building utilities that eliminate the need for "as const" assertions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Method 1: Helper Functions (Recommended) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 1: Helper Functions</h2>
          <ZodForm
            config={{
              schema: contactSchema,
              fields: [
                FormFieldHelpers.input<ContactFormData>("firstName", "First Name"),
                FormFieldHelpers.input<ContactFormData>("lastName", "Last Name"),
                FormFieldHelpers.input<ContactFormData>("email", "Email", "email"),
                FormFieldHelpers.input<ContactFormData>("phone", "Phone", "tel"),
                FormFieldHelpers.textarea<ContactFormData>("message", "Message", "Tell us about your project..."),
                FormFieldHelpers.select<ContactFormData>("country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ]),
                FormFieldHelpers.checkbox<ContactFormData>("newsletter", "Subscribe to newsletter"),
                FormFieldHelpers.checkbox<ContactFormData>("terms", "I agree to the terms and conditions"),
              ],
            }}
            onSubmit={handleSubmit}
            title="Contact Form (Helpers)"
            subtitle="Using helper functions"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>

        {/* Method 2: Builder Pattern */}
        <div className="space-y-4">
        <h2 className="text-xl font-semibold">Method 2: Builder Pattern</h2>
        <ZodForm
          config={{
            schema: contactSchema,
            fields: createBasicFormBuilder<ContactFormData>()
                .input("firstName", "First Name")
                .input("lastName", "Last Name")
                .input("email", "Email", "email")
                .input("phone", "Phone", "tel")
                .textarea("message", "Message", "Tell us about your project...")
                .select("country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ])
                .checkbox("newsletter", "Subscribe to newsletter")
                .checkbox("terms", "I agree to the terms and conditions")
                .build(),
            }}
            onSubmit={handleSubmit}
            title="Contact Form (Builder)"
            subtitle="Using builder pattern"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>

        {/* Method 3: Common Fields */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 3: Common Fields</h2>
          <ZodForm
            config={{
              schema: contactSchema,
              fields: [
                ...CommonFields.personal<ContactFormData>(),
                FormFieldHelpers.textarea<ContactFormData>("message", "Message", "Tell us about your project..."),
                FormFieldHelpers.select<ContactFormData>("country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ]),
                ...CommonFields.terms<ContactFormData>(),
              ],
            }}
            onSubmit={handleSubmit}
            title="Contact Form (Common Fields)"
            subtitle="Using common field collections"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>

        {/* Method 4: Mixed Approaches */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 4: Mixed Approaches</h2>
          <ZodForm
            config={{
              schema: contactSchema,
              fields: [
                // Mix helper functions and common fields
                ...CommonFields.personal<ContactFormData>(),
                FormFieldHelpers.textarea<ContactFormData>("message", "Message", "Tell us about your project..."),
                FormFieldHelpers.select<ContactFormData>("country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ]),
                // Use builder for the rest
                ...createBasicFormBuilder<ContactFormData>()
                  .checkbox("newsletter", "Subscribe to newsletter")
                  .checkbox("terms", "I agree to the terms and conditions")
                  .build(),
              ],
            }}
            onSubmit={handleSubmit}
            title="Contact Form (Mixed)"
            subtitle="Combining different approaches"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Benefits of the New Form Builders</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>No more "as const"</strong> - Clean, readable syntax</li>
          <li>✅ <strong>Type safety</strong> - Full TypeScript support</li>
          <li>✅ <strong>Flexibility</strong> - Mix and match approaches</li>
          <li>✅ <strong>Reusability</strong> - Common fields and templates</li>
          <li>✅ <strong>Maintainability</strong> - Easy to refactor and update</li>
          <li>✅ <strong>Developer Experience</strong> - Intuitive, fluent APIs</li>
        </ul>
      </div>
    </div>
  );
}
