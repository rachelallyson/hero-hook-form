"use client";

import React from "react";
import { z } from "zod";
import {
  ZodForm,
  FormFieldHelpers,
  commonValidations,
} from "@rachelallyson/hero-hook-form";

// Enhanced form schema with validation utilities
const enhancedFormSchema = z.object({
  // Basic fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: commonValidations.email,

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
});

type EnhancedFormData = z.infer<typeof enhancedFormSchema>;

export default function EnhancedDemoPage() {
  const [formData, setFormData] = React.useState<EnhancedFormData | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Enhanced Form Demo
          </h1>
          <p className="text-muted-foreground">
            Demonstrating advanced features of the hero-hook-form package
          </p>
        </div>

        <ZodForm<EnhancedFormData>
          config={{
            schema: enhancedFormSchema,
            fields: [
              // Section headers using content fields
              FormFieldHelpers.content<EnhancedFormData>(
                "Basic Information",
                "Enter your personal details",
              ),

              FormFieldHelpers.input<EnhancedFormData>("firstName", "First Name"),
              FormFieldHelpers.input<EnhancedFormData>("lastName", "Last Name"),
              FormFieldHelpers.input<EnhancedFormData>("email", "Email Address", "email"),

              FormFieldHelpers.content<EnhancedFormData>(
                "Contact Information",
                "Optional contact details",
              ),

              FormFieldHelpers.switch<EnhancedFormData>("hasPhone", "I have a phone number"),
              {
                type: "input" as const,
                name: "phoneNumber" as const,
                label: "Phone Number",
                inputProps: { type: "tel", placeholder: "+1 (555) 123-4567" },
                dependsOn: "hasPhone" as const,
                dependsOnValue: true,
              },

              FormFieldHelpers.content<EnhancedFormData>(
                "Role & Experience",
                "Tell us about your background",
              ),

              FormFieldHelpers.select<EnhancedFormData>("role", "Role", [
                { label: "Administrator", value: "admin" },
                { label: "Regular User", value: "user" },
                { label: "Guest", value: "guest" },
              ]),

              {
                type: "slider" as const,
                name: "experience" as const,
                label: "Years of Experience",
                sliderProps: { min: 0, max: 50, step: 1 },
              },

              FormFieldHelpers.content<EnhancedFormData>(
                "Skills",
                "Select your technical skills",
              ),

              // Skills as custom field
              {
                type: "custom" as const,
                name: "skills" as const,
                label: "Skills",
                render: ({ form, control }) => {
                  const skills = ["React", "TypeScript", "Node.js", "Python", "Java", "Go"];
                  const currentSkills = form.watch("skills") || [];

                  return (
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentSkills.includes(skill)}
                            onChange={(e) => {
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
                      ))}
                    </div>
                  );
                },
              },

              FormFieldHelpers.content<EnhancedFormData>(
                "Profile",
                "Upload your profile picture",
              ),

              {
                type: "file" as const,
                name: "avatar" as const,
                label: "Profile Picture",
                accept: "image/*",
                fileProps: { multiple: false },
              },

              FormFieldHelpers.content<EnhancedFormData>(
                "Agreement",
                "Please read and accept our terms",
              ),

              FormFieldHelpers.checkbox<EnhancedFormData>(
                "agreeToTerms",
                "I agree to the terms and conditions",
              ),
            ],
            onError: (errors) => {
              console.log("Form validation errors:", errors);
            },
          }}
          onSubmit={async (data) => {
            console.log("Form submitted with data:", data);
            setFormData(data);
          }}
          onSuccess={(data) => {
            console.log("Form submission successful:", data);
          }}
          title="Enhanced Form Demo"
          subtitle="Using content fields for section headers"
          showResetButton={true}
        />

        {/* Display submitted data */}
        {formData && (
          <div className="mt-8">
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
    </div>
  );
}
