"use client";

import React from "react";
import { z } from "zod";
import {
  ZodForm,
  createField,
  createAdvancedBuilder,
} from "@rachelallyson/hero-hook-form";

// Define the form schema with Zod
const unifiedSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  country: z.string().min(1, "Please select a country"),
  newsletter: z.boolean().default(false),
  notifications: z.boolean().default(false),
  communication: z.string().min(1, "Please select a communication method"),
  volume: z.number().min(0).max(100),
  birthDate: z.string().optional(),
  avatar: z.any().optional(),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type UnifiedFormData = z.infer<typeof unifiedSchema>;

export default function UnifiedFormDemo() {
  const handleSubmit = async (data: UnifiedFormData) => {
    console.log("Form submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unified Field Builder Demo</h1>
        <p className="text-gray-600">
          This demonstrates the new unified field builder that takes field type as the first argument!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Method 1: Direct createField Function */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 1: Direct createField Function</h2>
          <ZodForm
            config={{
              schema: unifiedSchema,
              fields: [
                createField<UnifiedFormData>("input", "firstName", "First Name"),
                createField<UnifiedFormData>("input", "lastName", "Last Name"),
                createField<UnifiedFormData>("input", "email", "Email", { type: "email" }),
                createField<UnifiedFormData>("input", "phone", "Phone", { type: "tel" }),
                createField<UnifiedFormData>("textarea", "message", "Message", { placeholder: "Tell us about your project..." }),
                createField<UnifiedFormData>("select", "country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ]),
                createField<UnifiedFormData>("checkbox", "newsletter", "Subscribe to newsletter"),
                createField<UnifiedFormData>("switch", "notifications", "Enable notifications"),
                createField<UnifiedFormData>("radio", "communication", "Communication Preference", [
                  { label: "Email", value: "email" },
                  { label: "Phone", value: "phone" },
                  { label: "SMS", value: "sms" },
                ]),
                createField<UnifiedFormData>("slider", "volume", "Volume", { min: 0, max: 100, step: 1 }),
                createField<UnifiedFormData>("date", "birthDate", "Birth Date"),
                createField<UnifiedFormData>("file", "avatar", "Profile Picture", { accept: "image/*" }),
                createField<UnifiedFormData>("checkbox", "terms", "I agree to the terms and conditions"),
              ],
            }}
            onSubmit={handleSubmit}
            title="Direct createField Function"
            subtitle="Using createField with type as first argument"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>

        {/* Method 2: Field Helper Object */}
        <div className="space-y-4">
        <h2 className="text-xl font-semibold">Method 2: Advanced Builder Pattern</h2>
        <ZodForm
          config={{
            schema: unifiedSchema,
            fields: createAdvancedBuilder<UnifiedFormData>()
              .field("input", "firstName", "First Name")
              .field("input", "lastName", "Last Name")
              .field("input", "email", "Email", { type: "email" })
              .field("input", "phone", "Phone", { type: "tel" })
              .field("textarea", "message", "Message", { placeholder: "Tell us about your project..." })
              .field("select", "country", "Country", [
                { label: "Select a country", value: "" },
                { label: "United States", value: "us" },
                { label: "Canada", value: "ca" },
                { label: "United Kingdom", value: "uk" },
              ])
              .field("checkbox", "newsletter", "Subscribe to newsletter")
              .field("switch", "notifications", "Enable notifications")
              .field("radio", "communication", "Communication Preference", [
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "SMS", value: "sms" },
              ])
              .field("slider", "volume", "Volume", { min: 0, max: 100, step: 1 })
              .field("date", "birthDate", "Birth Date")
              .field("file", "avatar", "Profile Picture", { accept: "image/*" })
              .field("checkbox", "terms", "I agree to the terms and conditions")
              .build(),
          }}
          onSubmit={handleSubmit}
          title="Advanced Builder Pattern"
          subtitle="Using createAdvancedBuilder with .field() method"
          showResetButton={true}
          submitButtonText="Send Message"
          resetButtonText="Clear Form"
        />
        </div>

        {/* Method 3: Mixed Approach */}
        <div className="space-y-4">
        <h2 className="text-xl font-semibold">Method 3: Mixed Approach</h2>
        <ZodForm
          config={{
            schema: unifiedSchema,
            fields: createAdvancedBuilder<UnifiedFormData>()
                .field("input", "firstName", "First Name")
                .field("input", "lastName", "Last Name")
                .field("input", "email", "Email", { type: "email" })
                .field("input", "phone", "Phone", { type: "tel" })
                .field("textarea", "message", "Message", { placeholder: "Tell us about your project..." })
                .field("select", "country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ])
                .field("checkbox", "newsletter", "Subscribe to newsletter")
                .field("switch", "notifications", "Enable notifications")
                .field("radio", "communication", "Communication Preference", [
                  { label: "Email", value: "email" },
                  { label: "Phone", value: "phone" },
                  { label: "SMS", value: "sms" },
                ])
                .field("slider", "volume", "Volume", { min: 0, max: 100, step: 1 })
                .field("date", "birthDate", "Birth Date")
                .field("file", "avatar", "Profile Picture", { accept: "image/*" })
                .field("checkbox", "terms", "I agree to the terms and conditions")
                .build(),
            }}
            onSubmit={handleSubmit}
            title="Unified Builder Pattern"
            subtitle="Using createUnifiedBuilder with .field() method"
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
              schema: unifiedSchema,
              fields: [
                // Mix direct createField calls
                createField<UnifiedFormData>("input", "firstName", "First Name"),
                createField<UnifiedFormData>("input", "lastName", "Last Name"),
                createField<UnifiedFormData>("input", "email", "Email", { type: "email" }),
                createField<UnifiedFormData>("input", "phone", "Phone", { type: "tel" }),
                createField<UnifiedFormData>("textarea", "message", "Message", { placeholder: "Tell us about your project..." }),
                createField<UnifiedFormData>("select", "country", "Country", [
                  { label: "Select a country", value: "" },
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                ]),
                // Use builder for the rest
                ...createAdvancedBuilder<UnifiedFormData>()
                  .field("checkbox", "newsletter", "Subscribe to newsletter")
                  .field("switch", "notifications", "Enable notifications")
                  .field("radio", "communication", "Communication Preference", [
                    { label: "Email", value: "email" },
                    { label: "Phone", value: "phone" },
                    { label: "SMS", value: "sms" },
                  ])
                  .field("slider", "volume", "Volume", { min: 0, max: 100, step: 1 })
                  .field("date", "birthDate", "Birth Date")
                  .field("file", "avatar", "Profile Picture", { accept: "image/*" })
                  .field("checkbox", "terms", "I agree to the terms and conditions")
                  .build(),
              ],
            }}
            onSubmit={handleSubmit}
            title="Mixed Approaches"
            subtitle="Combining different unified field methods"
            showResetButton={true}
            submitButtonText="Send Message"
            resetButtonText="Clear Form"
          />
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎯 Unified Field Builder Benefits</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Single API</strong> - One function for all field types</li>
          <li>✅ <strong>Type as first argument</strong> - Clear and intuitive</li>
          <li>✅ <strong>Type safety</strong> - Full TypeScript support with overloads</li>
          <li>✅ <strong>Consistent interface</strong> - Same pattern for all field types</li>
          <li>✅ <strong>Flexible usage</strong> - Direct function, helper object, or builder pattern</li>
          <li>✅ <strong>No "as const"</strong> - Clean, readable syntax</li>
          <li>✅ <strong>Easy to remember</strong> - One function to learn for all field types</li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">📝 Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Direct Function:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              createField("input", "email" as any, "Email", {"{"} type: "email" {"}"})
            </code>
          </div>
          <div>
            <h4 className="font-medium">Helper Object:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              Field.field("input", "email", "Email", {"{"} type: "email" {"}"})
            </code>
          </div>
          <div>
            <h4 className="font-medium">Builder Pattern:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              createUnifiedBuilder().field("input", "email", "Email", {"{"} type: "email" {"}"}).build()
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
