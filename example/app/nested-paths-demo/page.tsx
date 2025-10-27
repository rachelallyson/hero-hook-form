"use client";

import React from "react";
import { z } from "zod";
import { ZodForm } from "@rachelallyson/hero-hook-form";
import { createNestedPathBuilder } from "@rachelallyson/hero-hook-form";

// Schema for the demo
const nestedFormSchema = z.object({
  // Basic fields
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  
  // Nested address object
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
    country: z.string().min(1, "Country is required"),
  }),
  
  // Nested user profile
  profile: z.object({
    bio: z.string().optional(),
    website: z.string().url().optional(),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
  
  // Nested preferences
  preferences: z.object({
    notifications: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
    }),
    privacy: z.object({
      profilePublic: z.boolean(),
      showEmail: z.boolean(),
      showPhone: z.boolean(),
    }),
  }),
});

type NestedFormData = z.infer<typeof nestedFormSchema>;

export default function NestedPathsDemo() {
  // Nested Path Builder - The single, best approach
  const nestedPathFields = createNestedPathBuilder<NestedFormData>()
    // Basic fields
    .field("firstName", "First Name")
    .field("lastName", "Last Name")
    .field("email", "Email Address", "email")
    
    // Nested address using nest()
    .nest("address")
      .field("street", "Street Address")
      .field("city", "City")
      .field("state", "State/Province")
      .field("zipCode", "ZIP/Postal Code")
      .field("country", "Country")
      .end()
    
    // Nested profile using nest()
    .nest("profile")
      .field("bio", "Bio", "textarea")
      .field("website", "Website", "url")
      .nest("social")
        .field("twitter", "Twitter Handle")
        .field("linkedin", "LinkedIn Profile")
        .field("github", "GitHub Username")
        .end()
      .end()
    
    // Nested preferences using section()
    .section("preferences" as any)
      .nest("notifications" as any)
        .field("email", "Email Notifications", "checkbox")
        .field("sms", "SMS Notifications", "checkbox")
        .field("push", "Push Notifications", "checkbox")
        .end()
      .nest("privacy" as any)
        .field("profilePublic", "Public Profile", "checkbox")
        .field("showEmail", "Show Email", "checkbox")
        .field("showPhone", "Show Phone", "checkbox")
        .end()
      .end()
    
    .build();

  const handleSubmit = (data: NestedFormData) => {
    console.log("Form submitted:", data);
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Nested Paths Demo
        </h1>
        
        <div className="space-y-8">
          {/* Nested Path Builder - The Single Approach */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Nested Path Builder</h2>
            <p className="text-gray-600 mb-4">
              The single, best approach for handling nested field paths. Uses <code>.nest()</code> and <code>.section()</code> methods for intuitive nested field definition with full type safety.
            </p>
            <ZodForm
              config={{
                schema: nestedFormSchema,
                fields: nestedPathFields,
              }}
              onSubmit={handleSubmit}
              submitButtonText="Submit Nested Path Form"
              className="space-y-4"
            />
          </div>
        </div>

        {/* Benefits of the Nested Path Builder */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Nested Path Builder?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Type Safety:</strong> Full autocomplete and type checking</li>
                <li>• <strong>Intuitive API:</strong> Methods like <code>.nest()</code> and <code>.section()</code> are self-explanatory</li>
                <li>• <strong>No String Concatenation:</strong> No risk of typos in path strings</li>
                <li>• <strong>Better IDE Support:</strong> Full IntelliSense and refactoring support</li>
                <li>• <strong>Composable:</strong> Easy to build complex nested structures</li>
                <li>• <strong>Maintainable:</strong> Changes to schema automatically update field paths</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">❌ Problems with Dot Notation</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>No Autocomplete:</strong> Easy to make typos in path strings</li>
                <li>• <strong>No Type Safety:</strong> Runtime errors instead of compile-time checks</li>
                <li>• <strong>Hard to Refactor:</strong> Manual string replacement when schema changes</li>
                <li>• <strong>Error-Prone:</strong> Silent failures when paths don't match schema</li>
                <li>• <strong>Poor Developer Experience:</strong> No IDE assistance for nested paths</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
