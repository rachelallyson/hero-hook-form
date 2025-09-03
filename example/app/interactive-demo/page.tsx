"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React, { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface InteractiveFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Account Information
  accountType: "personal" | "business" | "enterprise";
  companyName: string;
  companySize: string;
  industry: string;
  website: string;

  // Preferences
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Advanced Fields
  birthDate: CalendarDate | null;
  experience: number;
  skills: string;
  avatar: FileList | null;

  // Terms
  terms: boolean;
  marketing: boolean;
}

const interactiveFields: FormFieldConfig<InteractiveFormData>[] = [
  // Basic Information Section
  {
    group: "basic",
    label: "First Name",
    name: "firstName",
    rules: {
      minLength: { message: "At least 2 characters", value: 2 },
      pattern: {
        message: "Only letters allowed",
        value: /^[A-Za-z\s]+$/,
      },
      required: "First name is required",
    },
    type: "input",
  },
  {
    group: "basic",
    label: "Last Name",
    name: "lastName",
    rules: {
      minLength: { message: "At least 2 characters", value: 2 },
      pattern: {
        message: "Only letters allowed",
        value: /^[A-Za-z\s]+$/,
      },
      required: "Last name is required",
    },
    type: "input",
  },
  {
    group: "basic",
    inputProps: { type: "email" },
    label: "Email Address",
    name: "email",
    rules: {
      pattern: {
        message: "Invalid email address",
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      },
      required: "Email is required",
    },
    type: "input",
  },
  {
    group: "basic",
    inputProps: { type: "tel" },
    label: "Phone Number",
    name: "phone",
    rules: {
      pattern: {
        message: "Invalid phone number",
        value: /^[+]?[1-9][\d]{0,15}$/,
      },
    },
    type: "input",
  },

  // Account Type Selection
  {
    group: "account",
    label: "Account Type",
    name: "accountType",
    options: [
      { label: "Personal", value: "personal" },
      { label: "Business", value: "business" },
      { label: "Enterprise", value: "enterprise" },
    ],
    rules: { required: "Please select an account type" },
    type: "select",
  },

  // Company Information
  {
    group: "company",
    label: "Company Name",
    name: "companyName",
    rules: { required: "Company name is required" },
    type: "input",
  },
  {
    group: "company",
    label: "Company Size",
    name: "companySize",
    options: [
      { label: "1-10 employees", value: "1-10" },
      { label: "11-50 employees", value: "11-50" },
      { label: "51-200 employees", value: "51-200" },
      { label: "201-1000 employees", value: "201-1000" },
      { label: "1000+ employees", value: "1000+" },
    ],
    rules: { required: "Please select company size" },
    type: "select",
  },
  {
    group: "company",
    label: "Industry",
    name: "industry",
    options: [
      { label: "Technology", value: "tech" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Finance", value: "finance" },
      { label: "Education", value: "education" },
      { label: "Retail", value: "retail" },
      { label: "Other", value: "other" },
    ],
    type: "select",
  },
  {
    group: "company",
    inputProps: { type: "url" },
    label: "Website",
    name: "website",
    rules: {
      pattern: {
        message: "Please enter a valid URL",
        value: /^https?:\/\/.+/,
      },
    },
    type: "input",
  },

  // Notification Preferences
  {
    group: "preferences",
    label: "Email Notifications",
    name: "notifications.email",
    type: "switch",
  },
  {
    group: "preferences",
    label: "SMS Notifications",
    name: "notifications.sms",
    type: "switch",
  },
  {
    group: "preferences",
    label: "Push Notifications",
    name: "notifications.push",
    type: "switch",
  },

  // Advanced Fields
  {
    dateProps: {
      variant: "bordered",
    },
    group: "advanced",
    label: "Date of Birth",
    name: "birthDate",
    type: "date",
  },
  {
    group: "advanced",
    label: "Years of Experience",
    name: "experience",
    sliderProps: {
      color: "primary",
      maxValue: 50,
      minValue: 0,
      step: 1,
    },
    type: "slider",
  },
  {
    group: "advanced",
    inputProps: {
      placeholder: "Enter skills separated by commas",
    },
    label: "Skills",
    name: "skills",
    type: "input",
  },
  {
    accept: "image/*",
    fileProps: {
      variant: "bordered",
    },
    group: "advanced",
    label: "Profile Picture",
    name: "avatar",
    type: "file",
  },

  // Terms and Conditions
  {
    group: "terms",
    label: "I agree to the terms and conditions",
    name: "terms",
    rules: { required: "You must agree to the terms" },
    type: "checkbox",
  },
  {
    group: "terms",
    label: "I agree to receive marketing communications",
    name: "marketing",
    type: "checkbox",
  },
];

export default function InteractiveDemoPage() {
  const [formState, setFormState] = useState<{
    isSubmitting: boolean;
    isSubmitted: boolean;
    errors: string[];
  }>({
    errors: [],
    isSubmitted: false,
    isSubmitting: false,
  });

  const handleSubmit = async (data: InteractiveFormData) => {
    setFormState({ errors: [], isSubmitted: false, isSubmitting: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success
    setFormState({
      errors: [],
      isSubmitted: true,
      isSubmitting: false,
    });

    console.log("Form submitted:", data);
  };

  const handleError = (errors: any) => {
    console.log("Form errors:", errors);
    setFormState((prev) => ({
      ...prev,
      errors: Object.values(errors).flat().filter(Boolean) as string[],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Interactive Form Demo</h1>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          This demo showcases advanced form features including real-time
          validation, complex field types, and interactive feedback. Experience
          the power of Hero Hook Form with various input types and validation
          patterns.
        </p>
      </div>

      {/* Form State Display */}
      {formState.isSubmitted && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <h3 className="text-success-800 font-semibold">
            ✅ Form Submitted Successfully!
          </h3>
          <p className="text-success-700">
            Check the console to see the submitted data.
          </p>
        </div>
      )}

      {formState.errors.length > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <h3 className="text-danger-800 font-semibold">
            ❌ Form Validation Errors:
          </h3>
          <ul className="text-danger-700 list-disc list-inside">
            {formState.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Form */}
      <div className="bg-content1 rounded-lg border shadow-sm">
        <ConfigurableForm
          fields={interactiveFields}
          layout="vertical"
          showResetButton={true}
          spacing="6"
          submitButtonProps={{
            disabled: formState.isSubmitting,
            isLoading: formState.isSubmitting,
          }}
          submitButtonText={
            formState.isSubmitting ? "Submitting..." : "Submit Registration"
          }
          subtitle="Experience advanced form features and validation"
          title="Interactive Registration Form"
          onError={handleError}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            ✅ Real-time Validation
          </h3>
          <p className="text-sm text-default-600">
            Form validates as you type with custom patterns and rules. Try
            entering invalid data to see validation messages.
          </p>
        </div>
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            🎛️ Advanced Controls
          </h3>
          <p className="text-sm text-default-600">
            Experience sliders, switches, file uploads, and date pickers with
            various configurations and styling options.
          </p>
        </div>
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            📊 Form State Management
          </h3>
          <p className="text-sm text-default-600">
            Real-time feedback on form submission status, loading states, and
            error handling with visual indicators.
          </p>
        </div>
      </div>
    </div>
  );
}
