"use client";

import React from "react";
import { ZodForm, createAdvancedBuilder } from "@rachelallyson/hero-hook-form";
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

// Builder pattern for maximum flexibility and type safety
class FormFieldBuilder<T> {
  private fields: any[] = [];

  input(name: keyof T, label: string, props?: any) {
    this.fields.push({
      label,
      name,
      type: "input",
      ...(props && { inputProps: props }),
    });
    return this;
  }

  textarea(name: keyof T, label: string, props?: any) {
    this.fields.push({
      label,
      name,
      type: "textarea",
      ...(props && { textareaProps: props }),
    });
    return this;
  }

  select(name: keyof T, label: string, options: any[]) {
    this.fields.push({
      label,
      name,
      type: "select",
      options,
    });
    return this;
  }

  checkbox(name: keyof T, label: string) {
    this.fields.push({
      label,
      name,
      type: "checkbox",
    });
    return this;
  }

  build() {
    return this.fields;
  }
}

// Super clean and fluent API!
const contactFields = createAdvancedBuilder<ContactFormData>()
  .field("input","firstName", "First Name")
  .field("input","lastName", "Last Name")
  .field("input", "email", "Email", { type: "email" })
  .field("input","phone", "Phone", { type: "tel" })
  .field("textarea","message", "Message", { placeholder: "Tell us about your project..." })
  .field("select","country", "Country", [
    { label: "Select a country", value: "" },
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
  ])
  .field("checkbox","newsletter", "Subscribe to newsletter")
  .field("checkbox","terms", "I agree to the terms and conditions")
  .build();

export default function ZodDemoBuilder() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zod Form Demo (Builder Pattern)</h1>
        <p className="text-gray-600">
          This form uses a builder pattern for maximum flexibility and type safety.
        </p>
      </div>

      <ZodForm
        config={{
          schema: contactSchema,
          fields: contactFields,
        }}
        onSubmit={handleSubmit}
        title="Contact Form"
        subtitle="Fill out the form below and we'll get back to you"
        showResetButton={true}
        submitButtonText="Send Message"
        resetButtonText="Clear Form"
      />
    </div>
  );
}
