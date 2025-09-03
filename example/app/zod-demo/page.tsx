"use client";

import React from "react";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

// Define the form schema with Zod
const contactSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  email: z.email("Please enter a valid email address"),
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

const contactFields = [
  {
    label: "First Name",
    name: "firstName" as const,
    type: "input" as const,
  },
  {
    label: "Last Name",
    name: "lastName" as const,
    type: "input" as const,
  },
  {
    inputProps: { type: "email" },
    label: "Email",
    name: "email" as const,
    type: "input" as const,
  },
  {
    inputProps: { type: "tel" },
    label: "Phone",
    name: "phone" as const,
    type: "input" as const,
  },
  {
    label: "Message",
    name: "message" as const,
    textareaProps: { placeholder: "Tell us about your project..." },
    type: "textarea" as const,
  },
  {
    label: "Country",
    name: "country" as const,
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
    ],
    type: "select" as const,
  },
  {
    label: "Subscribe to newsletter",
    name: "newsletter" as const,
    type: "checkbox" as const,
  },
  {
    label: "I agree to the terms and conditions",
    name: "terms" as const,
    type: "checkbox" as const,
  },
];

// Settings form with more complex validation
const settingsSchema = z.object({
  age: z
    .number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  autoSave: z.boolean().default(true),
  language: z.enum(["en", "es", "fr"]).default("en"),
  notifications: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const settingsFields = [
  {
    label: "Username",
    name: "username" as const,
    type: "input" as const,
  },
  {
    inputProps: { type: "number" },
    label: "Age",
    name: "age" as const,
    type: "input" as const,
  },
  {
    label: "Theme",
    name: "theme" as const,
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
    type: "radio" as const,
  },
  {
    label: "Language",
    name: "language" as const,
    options: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "French", value: "fr" },
    ],
    type: "select" as const,
  },
  {
    label: "Enable notifications",
    name: "notifications" as const,
    type: "switch" as const,
  },
  {
    label: "Auto-save changes",
    name: "autoSave" as const,
    type: "checkbox" as const,
  },
];

export default function ZodDemoPage() {
  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    // Success message is now handled by ZodForm component
  };

  const handleSettingsSubmit = (data: SettingsFormData) => {
    console.log("Settings form submitted:", data);
    // Success message is now handled by ZodForm component
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Zod Validation Demo</h1>
        <p className="text-gray-600">
          Using Zod schemas for type-safe form validation
        </p>
      </div>

      {/* Contact Form with Zod */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Contact Form (Zod Validation)
        </h2>
        <p className="text-gray-600">
          This form uses Zod schemas for validation. Notice how the validation
          rules are defined in the schema rather than in individual field
          configurations.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ZodForm
            config={{ schema: contactSchema, fields: contactFields }}
            layout="vertical"
            showResetButton={true}
            subtitle="We'd love to hear from you"
            title="Get in Touch"
            onSubmit={handleContactSubmit}
          />
        </div>
      </section>

      {/* Settings Form with Zod */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Settings Form (Zod Validation)
        </h2>
        <p className="text-gray-600">
          Two column form with complex Zod validation including enums, numbers,
          and custom refinements.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg">
          <ZodForm
            columns={2}
            config={{ schema: settingsSchema, fields: settingsFields }}
            layout="grid"
            showResetButton={true}
            subtitle="Customize your experience"
            title="User Settings"
            onSubmit={handleSettingsSubmit}
          />
        </div>
      </section>

      {/* Zod Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Zod Integration Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">✅ Type Safety</h3>
            <ul className="text-sm text-gray-600">
              <li>• Full TypeScript support</li>
              <li>• Runtime type checking</li>
              <li>• Automatic type inference</li>
              <li>• Compile-time validation</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">
              ✅ Validation Rules
            </h3>
            <ul className="text-sm text-gray-600">
              <li>• String length validation</li>
              <li>• Email format validation</li>
              <li>• Number range validation</li>
              <li>• Enum validation</li>
              <li>• Custom refinements</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">✅ Error Messages</h3>
            <ul className="text-sm text-gray-600">
              <li>• Custom error messages</li>
              <li>• Automatic field mapping</li>
              <li>• Real-time validation</li>
              <li>• Form-level errors</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">✅ Schema Features</h3>
            <ul className="text-sm text-gray-600">
              <li>• Optional fields</li>
              <li>• Default values</li>
              <li>• Transformations</li>
              <li>• Nested objects</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">✅ Integration</h3>
            <ul className="text-sm text-gray-600">
              <li>• React Hook Form resolver</li>
              <li>• HeroUI components</li>
              <li>• TypeScript support</li>
              <li>• Optional dependency</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600">✅ Benefits</h3>
            <ul className="text-sm text-gray-600">
              <li>• Single source of truth</li>
              <li>• Reusable schemas</li>
              <li>• Better error handling</li>
              <li>• Runtime safety</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Code Example</h2>
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            {`// Define your schema
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

// Create form configuration
const config = createZodFormConfig(contactSchema, fields);

// Use in your component
<ZodForm
  config={config}
  onSubmit={handleSubmit}
  title="Contact Form"
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
