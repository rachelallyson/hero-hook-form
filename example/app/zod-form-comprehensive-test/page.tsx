"use client";

import React from "react";
import { z } from "zod";
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";

// Define the form schema with Zod
const comprehensiveSchema = z.object({
  // Text inputs
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // Textarea
  message: z.string().min(10, "Message must be at least 10 characters"),

  // Select
  country: z.string().min(1, "Please select a country"),

  // Autocomplete
  favoriteColor: z.string().min(1, "Please select a color"),

  // Radio group (single value)
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),

  // Checkbox group (array of strings)
  interests: z.array(z.string()).min(1, "Please select at least one interest"),

  // Individual checkboxes (booleans)
  newsletter: z.boolean().default(false),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),

  // Switch
  notifications: z.boolean().default(false),

  // Slider
  rating: z.number().min(0).max(100),

  // Date
  birthDate: z.string().optional(),

  avatar: z
    .any()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        typeof FileList === "undefined" ||
        value instanceof FileList,
      { message: "Please upload a valid file" },
    ),
});

type ComprehensiveFormData = z.infer<typeof comprehensiveSchema>;

export default function ZodFormComprehensiveTestPage() {
  const handleSubmit = async (data: ComprehensiveFormData) => {
    console.log("Form submitted:", data);
    alert(`Form submitted successfully!\n\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comprehensive ZodForm Test</h1>
        <p className="text-gray-600">
          This form includes all input types using FormFieldHelpers, including
          checkbox groups and radio groups. Test that names are working
          correctly.
        </p>
      </div>

      <ZodForm
        config={{
          schema: comprehensiveSchema,
          fields: [
            // Text inputs
            FormFieldHelpers.input<ComprehensiveFormData>(
              "firstName",
              "First Name",
              "text",
              { placeholder: "Enter your first name" },
            ),
            FormFieldHelpers.input<ComprehensiveFormData>(
              "lastName",
              "Last Name",
              "text",
              { placeholder: "Enter your last name" },
            ),
            FormFieldHelpers.input<ComprehensiveFormData>(
              "email",
              "Email Address",
              "email",
              { placeholder: "Enter your email" },
            ),
            FormFieldHelpers.input<ComprehensiveFormData>(
              "phone",
              "Phone Number",
              "tel",
              { placeholder: "Enter your phone number" },
            ),
            FormFieldHelpers.input<ComprehensiveFormData>(
              "password",
              "Password",
              "password",
              { placeholder: "Enter your password" },
            ),

            // Textarea
            FormFieldHelpers.textarea<ComprehensiveFormData>(
              "message",
              "Message",
              "Tell us about yourself...",
            ),

            // Select
            FormFieldHelpers.select<ComprehensiveFormData>(
              "country",
              "Country",
              [
                { label: "Select a country", value: "" },
                { label: "United States", value: "us" },
                { label: "Canada", value: "ca" },
                { label: "United Kingdom", value: "uk" },
                { label: "Australia", value: "au" },
              ],
            ),

            // Autocomplete
            FormFieldHelpers.autocomplete<ComprehensiveFormData>(
              "favoriteColor",
              "Favorite Color",
              [
                { label: "Red", value: "red" },
                { label: "Blue", value: "blue" },
                { label: "Green", value: "green" },
                { label: "Yellow", value: "yellow" },
                { label: "Purple", value: "purple" },
              ],
              "Search for a color",
            ),

            // Radio group (single value - typical form pattern)
            FormFieldHelpers.radio<ComprehensiveFormData>(
              "gender",
              "Gender",
              [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ],
              { orientation: "horizontal" },
            ),

            // Checkbox group (array of strings - typical form pattern)
            // Now using FormFieldHelpers.checkboxGroup() instead of custom field!
            FormFieldHelpers.checkboxGroup<ComprehensiveFormData>(
              "interests",
              "Interests",
              [
                { label: "Reading", value: "Reading" },
                { label: "Sports", value: "Sports" },
                { label: "Music", value: "Music" },
                { label: "Travel", value: "Travel" },
                { label: "Cooking", value: "Cooking" },
              ],
              {
                description: "Select all that apply",
                orientation: "vertical",
              },
            ),

            // Individual checkboxes (booleans)
            FormFieldHelpers.checkbox<ComprehensiveFormData>(
              "newsletter",
              "Subscribe to newsletter",
            ),
            FormFieldHelpers.checkbox<ComprehensiveFormData>(
              "terms",
              "I agree to the terms and conditions",
            ),

            // Switch
            FormFieldHelpers.switch<ComprehensiveFormData>(
              "notifications",
              "Enable notifications",
            ),

            // Slider
            FormFieldHelpers.slider<ComprehensiveFormData>("rating", "Rating", {
              minValue: 0,
              maxValue: 100,
              step: 1,
            }),

            // Date
            FormFieldHelpers.date<ComprehensiveFormData>(
              "birthDate",
              "Birth Date",
            ),

            // File
            FormFieldHelpers.file<ComprehensiveFormData>(
              "avatar",
              "Profile Picture",
              { accept: "image/*" },
            ),
          ],
        }}
        resetButtonText="Reset"
        showResetButton={true}
        submitButtonText="Submit Form"
        subtitle="All input types with FormFieldHelpers"
        title="Comprehensive Form Test"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
