"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React from "react";
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface UserRegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Account Settings
  username: string;
  password: string;
  confirmPassword: string;
  accountType: "personal" | "business" | "enterprise";

  // Business Info (conditional)
  companyName?: string;
  companySize?: string;
  industry?: string;

  // Preferences
  newsletter: boolean;
  smsUpdates: boolean;
  marketingEmails: boolean;

  // Terms
  terms: boolean;
  privacy: boolean;
}

interface SurveyData {
  // Basic Info
  age: number;
  gender: string;
  location: string;

  // Experience
  experience: string;
  satisfaction: number;
  recommendation: number;

  // Feedback
  feedback: string;
  improvements: string[];

  // Contact
  followUp: boolean;
  contactMethod?: string;
}

const registrationFields: FormFieldConfig<UserRegistrationData>[] = [
  // Personal Information Group
  {
    group: "personal",
    label: "First Name",
    name: "firstName",
    rules: {
      minLength: { message: "At least 2 characters", value: 2 },
      required: "First name is required",
    },
    type: "input",
  },
  {
    group: "personal",
    label: "Last Name",
    name: "lastName",
    rules: {
      minLength: { message: "At least 2 characters", value: 2 },
      required: "Last name is required",
    },
    type: "input",
  },
  {
    group: "personal",
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
    group: "personal",
    inputProps: { type: "tel" },
    label: "Phone Number",
    name: "phone",
    rules: {
      pattern: {
        message: "Invalid phone number",
        value: /^[+]?[1-9][\d]{0,15}$/,
      },
      required: "Phone number is required",
    },
    type: "input",
  },

  // Account Settings Group
  {
    description: "Choose a unique username (3-20 characters)",
    group: "account",
    label: "Username",
    name: "username",
    rules: {
      maxLength: { message: "Maximum 20 characters", value: 20 },
      minLength: { message: "At least 3 characters", value: 3 },
      pattern: {
        message: "Only letters, numbers, and underscores allowed",
        value: /^[a-zA-Z0-9_]+$/,
      },
      required: "Username is required",
    },
    type: "input",
  },
  {
    description: "Must be at least 8 characters with numbers and letters",
    group: "account",
    inputProps: { type: "password" },
    label: "Password",
    name: "password",
    rules: {
      minLength: { message: "At least 8 characters", value: 8 },
      pattern: {
        message: "Must contain both letters and numbers",
        value: /^(?=.*[a-zA-Z])(?=.*\d)/,
      },
      required: "Password is required",
    },
    type: "input",
  },
  {
    group: "account",
    inputProps: { type: "password" },
    label: "Confirm Password",
    name: "confirmPassword",
    rules: {
      required: "Please confirm your password",
    },
    type: "input",
  },
  {
    defaultValue: "personal",
    group: "account",
    label: "Account Type",
    name: "accountType",
    radioOptions: [
      { label: "Personal", value: "personal" },
      { label: "Business", value: "business" },
      { label: "Enterprise", value: "enterprise" },
    ],
    rules: { required: "Please select an account type" },
    type: "radio",
  },

  // Business Information (conditional fields)
  {
    group: "business",
    label: "Company Name",
    name: "companyName",
    rules: { required: "Company name is required" },
    type: "input",
  },
  {
    group: "business",
    label: "Company Size",
    name: "companySize",
    options: [
      { label: "1-10 employees", value: "small" },
      { label: "11-50 employees", value: "medium" },
      { label: "51-200 employees", value: "large" },
      { label: "200+ employees", value: "enterprise" },
    ],
    type: "select",
  },
  {
    group: "business",
    label: "Industry",
    name: "industry",
    options: [
      { label: "Technology", value: "tech" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Finance", value: "finance" },
      { label: "Education", value: "education" },
      { label: "Retail", value: "retail" },
      { label: "Manufacturing", value: "manufacturing" },
      { label: "Other", value: "other" },
    ],
    type: "select",
  },

  // Preferences Group
  {
    description: "Get weekly updates and insights",
    group: "preferences",
    label: "Subscribe to newsletter",
    name: "newsletter",
    type: "checkbox",
  },
  {
    description: "Receive important updates via SMS",
    group: "preferences",
    label: "SMS Updates",
    name: "smsUpdates",
    type: "switch",
  },
  {
    description: "Promotional content and offers",
    group: "preferences",
    label: "Marketing Emails",
    name: "marketingEmails",
    type: "switch",
  },

  // Terms and Conditions
  {
    group: "legal",
    label: "I agree to the Terms of Service",
    name: "terms",
    rules: { required: "You must agree to the terms" },
    type: "checkbox",
  },
  {
    group: "legal",
    label: "I agree to the Privacy Policy",
    name: "privacy",
    rules: { required: "You must agree to the privacy policy" },
    type: "checkbox",
  },
];

const surveyFields: FormFieldConfig<SurveyData>[] = [
  {
    inputProps: { max: 120, min: 13, type: "number" },
    label: "Age",
    name: "age",
    rules: {
      max: { message: "Must be under 120", value: 120 },
      min: { message: "Must be at least 13", value: 13 },
      required: "Age is required",
    },
    type: "input",
  },
  {
    label: "Gender",
    name: "gender",
    radioOptions: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Non-binary", value: "non-binary" },
      { label: "Prefer not to say", value: "prefer-not-to-say" },
    ],
    type: "radio",
  },
  {
    label: "Location",
    name: "location",
    options: [
      { label: "North America", value: "na" },
      { label: "Europe", value: "eu" },
      { label: "Asia", value: "asia" },
      { label: "South America", value: "sa" },
      { label: "Africa", value: "africa" },
      { label: "Oceania", value: "oceania" },
    ],
    type: "select",
  },
  {
    label: "Experience Level",
    name: "experience",
    radioOptions: [
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
      { label: "Expert", value: "expert" },
    ],
    type: "radio",
  },
  {
    label: "Additional Feedback",
    name: "feedback",
    textareaProps: {
      minRows: 4,
      placeholder: "Share your thoughts and suggestions...",
    },
    type: "textarea",
  },
  {
    label: "I'm interested in follow-up surveys",
    name: "followUp",
    type: "checkbox",
  },
];

export default function AdvancedDemoPage() {
  const handleRegistrationSubmit = (data: UserRegistrationData) => {
    console.log("Registration form submitted:", data);

    // Validate password match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    alert(`Registration Successful!\nWelcome, ${data.firstName}!`);
  };

  const handleSurveySubmit = (data: SurveyData) => {
    console.log("Survey form submitted:", data);
    alert(`Survey Submitted!\nThank you for your feedback!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Advanced Form Demo</h1>
        <p className="text-gray-600">
          Complex forms with conditional fields, grouping, and advanced
          validation
        </p>
      </div>

      {/* User Registration Form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Registration Form</h2>
        <p className="text-gray-600">
          Multi-section form with conditional business fields and advanced
          validation
        </p>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
          <ConfigurableForm
            columns={2}
            fields={registrationFields}
            layout="grid"
            resetButtonText="Clear Form"
            showResetButton={true}
            spacing="lg"
            submitButtonText="Create Account"
            subtitle="Join thousands of users already using our platform"
            title="Create Your Account"
            onSubmit={handleRegistrationSubmit}
          />
        </div>
      </section>

      {/* Survey Form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Experience Survey</h2>
        <p className="text-gray-600">
          Compact form with rating scales and conditional follow-up
        </p>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-100">
          <ConfigurableForm
            fields={surveyFields}
            layout="vertical"
            resetButtonText="Reset Survey"
            showResetButton={true}
            spacing="6"
            submitButtonText="Submit Survey"
            subtitle="Your feedback helps us build better products"
            title="Help Us Improve"
            onSubmit={handleSurveySubmit}
          />
        </div>
      </section>

      {/* Advanced Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Advanced Features Demonstrated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-3">
              🔗 Conditional Logic
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Business fields show based on account type</li>
              <li>• Follow-up contact method appears conditionally</li>
              <li>• Dynamic form sections</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-green-600 mb-3">
              📋 Field Grouping
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Personal, Account, Business groups</li>
              <li>• Logical form organization</li>
              <li>• Visual separation of concerns</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-purple-600 mb-3">
              ✅ Advanced Validation
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Password strength requirements</li>
              <li>• Pattern matching (username, email)</li>
              <li>• Cross-field validation (password match)</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-orange-600 mb-3">
              🎨 Layout Options
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Two-column grid for registration</li>
              <li>• Single-column for survey</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-red-600 mb-3">🔧 Field Types</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Input (text, email, tel, number, password)</li>
              <li>• Select, Radio, Checkbox, Switch</li>
              <li>• Textarea with custom sizing</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-indigo-600 mb-3">
              ⚙️ Customization
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Custom spacing (sm, md, lg, xl)</li>
              <li>• Custom button text</li>
              <li>• Flexible field descriptions</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
