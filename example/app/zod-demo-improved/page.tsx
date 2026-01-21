"use client";

import React from "react";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

// Define the form schema with Zod
const contactSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  newsletter: z.boolean().default(false),
  phone: z.string().optional(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Helper functions to create field configs without "as const"
const createInputField = (
  name: keyof ContactFormData,
  label: string,
  inputProps?: any,
) => ({
  label,
  name,
  type: "input",
  ...(inputProps && { inputProps }),
});

const createTextareaField = (
  name: keyof ContactFormData,
  label: string,
  textareaProps?: any,
) => ({
  label,
  name,
  type: "textarea",
  ...(textareaProps && { textareaProps }),
});

const createSelectField = (
  name: keyof ContactFormData,
  label: string,
  options: any[],
) => ({
  label,
  name,
  options,
  type: "select",
});

const createCheckboxField = (name: keyof ContactFormData, label: string) => ({
  label,
  name,
  type: "checkbox",
});

// Much cleaner field definitions!
const contactFields = [
  createInputField("firstName", "First Name"),
  createInputField("lastName", "Last Name"),
  createInputField("email", "Email", { type: "email" }),
  createInputField("phone", "Phone", { type: "tel" }),
  createTextareaField("message", "Message", {
    placeholder: "Tell us about your project...",
  }),
  createSelectField("country", "Country", [
    { label: "Select a country", value: "" },
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
  ]),
  createCheckboxField("newsletter", "Subscribe to newsletter"),
  createCheckboxField("terms", "I agree to the terms and conditions"),
];

export default function ZodDemoImproved() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zod Form Demo (Improved)</h1>
        <p className="text-gray-600">
          This form uses helper functions to avoid repetitive &quot;as
          const&quot; assertions.
        </p>
      </div>

      <ZodForm
        config={{
          fields: contactFields,
          schema: contactSchema,
        }}
        resetButtonText="Clear Form"
        showResetButton={true}
        submitButtonText="Send Message"
        subtitle="Fill out the form below and we'll get back to you"
        title="Contact Form"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
