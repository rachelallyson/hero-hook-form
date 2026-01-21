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
  birthDate: z.string().optional(),
  communication: z.string().min(1, "Please select a communication method"),
  avatar: z.any().optional(),
  country: z.string().min(1, "Please select a country"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  newsletter: z.boolean().default(false),
  notifications: z.boolean().default(false),
  phone: z.string().optional(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
  volume: z.number().min(0).max(100),
});

type UnifiedFormData = z.infer<typeof unifiedSchema>;

export default function UnifiedFormDemo() {
  const handleSubmit = async (data: UnifiedFormData) => {
    console.log("Form submitted:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unified Field Builder Demo</h1>
        <p className="text-gray-600">
          This demonstrates the new unified field builder that takes field type
          as the first argument!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Method 1: Direct createField Function */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Method 1: Direct createField Function
          </h2>
          <ZodForm<UnifiedFormData>
            config={{
              fields: [
                createField({
                  type: "input",
                  name: "firstName",
                  label: "First Name",
                }),
                createField({
                  type: "input",
                  name: "lastName",
                  label: "Last Name",
                }),
                createField({
                  type: "input",
                  name: "email",
                  label: "Email",
                  props: { type: "email" },
                }),
                createField({
                  type: "input",
                  name: "phone",
                  label: "Phone",
                  props: { type: "tel" },
                }),
                createField({
                  type: "textarea",
                  name: "message",
                  label: "Message",
                  props: { placeholder: "Tell us about your project..." },
                }),
                createField({
                  type: "select",
                  name: "country",
                  label: "Country",
                  options: [
                    { label: "Select a country", value: "" },
                    { label: "United States", value: "us" },
                    { label: "Canada", value: "ca" },
                    { label: "United Kingdom", value: "uk" },
                  ],
                }),
                createField({
                  type: "checkbox",
                  name: "newsletter",
                  label: "Subscribe to newsletter",
                }),
                createField({
                  type: "switch",
                  name: "notifications",
                  label: "Enable notifications",
                }),
                createField({
                  type: "radio",
                  name: "communication",
                  label: "Communication Preference",
                  options: [
                    { label: "Email", value: "email" },
                    { label: "Phone", value: "phone" },
                    { label: "SMS", value: "sms" },
                  ],
                }),
                createField({
                  type: "slider",
                  name: "volume",
                  label: "Volume",
                  props: { max: 100, min: 0, step: 1 },
                }),
                createField({
                  type: "date",
                  name: "birthDate",
                  label: "Birth Date",
                }),
                createField({
                  type: "file",
                  name: "avatar",
                  label: "Profile Picture",
                  props: { accept: "image/*" },
                }),
                createField({
                  type: "checkbox",
                  name: "terms",
                  label: "I agree to the terms and conditions",
                }),
              ],
              schema: unifiedSchema,
            }}
            resetButtonText="Clear Form"
            showResetButton={true}
            submitButtonText="Send Message"
            subtitle="Using createField with type as first argument"
            title="Direct createField Function"
            onSubmit={handleSubmit}
          />
        </div>

        {/* Method 2: Field Helper Object */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Method 2: Advanced Builder Pattern
          </h2>
          <ZodForm<UnifiedFormData>
            config={{
              fields: createAdvancedBuilder<UnifiedFormData>()
                .field({
                  type: "input",
                  name: "firstName",
                  label: "First Name",
                })
                .field({ type: "input", name: "lastName", label: "Last Name" })
                .field({
                  type: "input",
                  name: "email",
                  label: "Email",
                  props: { type: "email" },
                })
                .field({
                  type: "input",
                  name: "phone",
                  label: "Phone",
                  props: { type: "tel" },
                })
                .field({
                  type: "textarea",
                  name: "message",
                  label: "Message",
                  props: {
                    placeholder: "Tell us about your project...",
                  },
                })
                .field({
                  type: "select",
                  name: "country",
                  label: "Country",
                  options: [
                    { label: "Select a country", value: "" },
                    { label: "United States", value: "us" },
                    { label: "Canada", value: "ca" },
                    { label: "United Kingdom", value: "uk" },
                  ],
                })
                .field({
                  type: "checkbox",
                  name: "newsletter",
                  label: "Subscribe to newsletter",
                })
                .field({
                  type: "switch",
                  name: "notifications",
                  label: "Enable notifications",
                })
                .field({
                  type: "radio",
                  name: "communication",
                  label: "Communication Preference",
                  options: [
                    { label: "Email", value: "email" },
                    { label: "Phone", value: "phone" },
                    { label: "SMS", value: "sms" },
                  ],
                })
                .field({
                  type: "slider",
                  name: "volume",
                  label: "Volume",
                  props: {
                    max: 100,
                    min: 0,
                    step: 1,
                  },
                })
                .field({ type: "date", name: "birthDate", label: "Birth Date" })
                .field({
                  type: "file",
                  name: "avatar",
                  label: "Profile Picture",
                  props: {
                    accept: "image/*",
                  },
                })
                .field({
                  type: "checkbox",
                  name: "terms",
                  label: "I agree to the terms and conditions",
                })
                .build(),
              schema: unifiedSchema,
            }}
            resetButtonText="Clear Form"
            showResetButton={true}
            submitButtonText="Send Message"
            subtitle="Using createAdvancedBuilder with .field() method"
            title="Advanced Builder Pattern"
            onSubmit={handleSubmit}
          />
        </div>

        {/* Method 3: Mixed Approach */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 3: Mixed Approach</h2>
          <ZodForm<UnifiedFormData>
            config={{
              fields: createAdvancedBuilder<UnifiedFormData>()
                .field({
                  type: "input",
                  name: "firstName",
                  label: "First Name",
                })
                .field({ type: "input", name: "lastName", label: "Last Name" })
                .field({
                  type: "input",
                  name: "email",
                  label: "Email",
                  props: { type: "email" },
                })
                .field({
                  type: "input",
                  name: "phone",
                  label: "Phone",
                  props: { type: "tel" },
                })
                .field({
                  type: "textarea",
                  name: "message",
                  label: "Message",
                  props: {
                    placeholder: "Tell us about your project...",
                  },
                })
                .field({
                  type: "select",
                  name: "country",
                  label: "Country",
                  options: [
                    { label: "Select a country", value: "" },
                    { label: "United States", value: "us" },
                    { label: "Canada", value: "ca" },
                    { label: "United Kingdom", value: "uk" },
                  ],
                })
                .field({
                  type: "checkbox",
                  name: "newsletter",
                  label: "Subscribe to newsletter",
                })
                .field({
                  type: "switch",
                  name: "notifications",
                  label: "Enable notifications",
                })
                .field({
                  type: "radio",
                  name: "communication",
                  label: "Communication Preference",
                  options: [
                    { label: "Email", value: "email" },
                    { label: "Phone", value: "phone" },
                    { label: "SMS", value: "sms" },
                  ],
                })
                .field({
                  type: "slider",
                  name: "volume",
                  label: "Volume",
                  props: {
                    max: 100,
                    min: 0,
                    step: 1,
                  },
                })
                .field({ type: "date", name: "birthDate", label: "Birth Date" })
                .field({
                  type: "file",
                  name: "avatar",
                  label: "Profile Picture",
                  props: {
                    accept: "image/*",
                  },
                })
                .field({
                  type: "checkbox",
                  name: "terms",
                  label: "I agree to the terms and conditions",
                })
                .build(),
              schema: unifiedSchema,
            }}
            resetButtonText="Clear Form"
            showResetButton={true}
            submitButtonText="Send Message"
            subtitle="Using createUnifiedBuilder with .field() method"
            title="Unified Builder Pattern"
            onSubmit={handleSubmit}
          />
        </div>

        {/* Method 4: Mixed Approaches */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 4: Mixed Approaches</h2>
          <ZodForm<UnifiedFormData>
            config={{
              fields: [
                // Mix direct createField calls
                createField({
                  type: "input",
                  name: "firstName",
                  label: "First Name",
                }),
                createField({
                  type: "input",
                  name: "lastName",
                  label: "Last Name",
                }),
                createField({
                  type: "input",
                  name: "email",
                  label: "Email",
                  props: { type: "email" },
                }),
                createField({
                  type: "input",
                  name: "phone",
                  label: "Phone",
                  props: { type: "tel" },
                }),
                createField({
                  type: "textarea",
                  name: "message",
                  label: "Message",
                  props: { placeholder: "Tell us about your project..." },
                }),
                createField({
                  type: "select",
                  name: "country",
                  label: "Country",
                  options: [
                    { label: "Select a country", value: "" },
                    { label: "United States", value: "us" },
                    { label: "Canada", value: "ca" },
                    { label: "United Kingdom", value: "uk" },
                  ],
                }),
                // Use builder for the rest
                ...createAdvancedBuilder<UnifiedFormData>()
                  .field({
                    type: "checkbox",
                    name: "newsletter",
                    label: "Subscribe to newsletter",
                  })
                  .field({
                    type: "switch",
                    name: "notifications",
                    label: "Enable notifications",
                  })
                  .field({
                    type: "radio",
                    name: "communication",
                    label: "Communication Preference",
                    options: [
                      { label: "Email", value: "email" },
                      { label: "Phone", value: "phone" },
                      { label: "SMS", value: "sms" },
                    ],
                  })
                  .field({
                    type: "slider",
                    name: "volume",
                    label: "Volume",
                    props: {
                      max: 100,
                      min: 0,
                      step: 1,
                    },
                  })
                  .field({
                    type: "date",
                    name: "birthDate",
                    label: "Birth Date",
                  })
                  .field({
                    type: "file",
                    name: "avatar",
                    label: "Profile Picture",
                    props: {
                      accept: "image/*",
                    },
                  })
                  .field({
                    type: "checkbox",
                    name: "terms",
                    label: "I agree to the terms and conditions",
                  })
                  .build(),
              ],
              schema: unifiedSchema,
            }}
            resetButtonText="Clear Form"
            showResetButton={true}
            submitButtonText="Send Message"
            subtitle="Combining different unified field methods"
            title="Mixed Approaches"
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          🎯 Unified Field Builder Benefits
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            ✅ <strong>Single API</strong> - One function for all field types
          </li>
          <li>
            ✅ <strong>Type as first argument</strong> - Clear and intuitive
          </li>
          <li>
            ✅ <strong>Type safety</strong> - Full TypeScript support with
            overloads
          </li>
          <li>
            ✅ <strong>Consistent interface</strong> - Same pattern for all
            field types
          </li>
          <li>
            ✅ <strong>Flexible usage</strong> - Direct function, helper object,
            or builder pattern
          </li>
          <li>
            ✅ <strong>No &quot;as const&quot;</strong> - Clean, readable syntax
          </li>
          <li>
            ✅ <strong>Easy to remember</strong> - One function to learn for all
            field types
          </li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">📝 Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Direct Function:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              createField({"{"} type: &quot;input&quot;, name:
              &quot;email&quot;, label: &quot;Email&quot;, props: {"{"} type:
              &quot;email&quot; {"}"} {"}"})
            </code>
          </div>
          <div>
            <h4 className="font-medium">Helper Object:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              builder.field({"{"} type: &quot;input&quot;, name:
              &quot;email&quot;, label: &quot;Email&quot;, props: {"{"} type:
              &quot;email&quot; {"}"} {"}"})
            </code>
          </div>
          <div>
            <h4 className="font-medium">Builder Pattern:</h4>
            <code className="block bg-white p-2 rounded mt-1">
              createUnifiedBuilder().field(&quot;input&quot;, &quot;email&quot;,
              &quot;Email&quot;, {"{"} type: &quot;email&quot; {"}"}).build()
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
