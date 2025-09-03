"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React from "react";
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  country: string;
  newsletter: boolean;
  terms: boolean;
}

interface SettingsFormData {
  theme: string;
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

const contactFields: FormFieldConfig<ContactFormData>[] = [
  {
    label: "First Name",
    name: "firstName",
    rules: { required: "First name is required" },
    type: "input",
  },
  {
    label: "Last Name",
    name: "lastName",
    rules: { required: "Last name is required" },
    type: "input",
  },
  {
    inputProps: { type: "email" },
    label: "Email",
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
    inputProps: { type: "tel" },
    label: "Phone",
    name: "phone",
    rules: { required: "Phone is required" },
    type: "input",
  },
  {
    label: "Message",
    name: "message",
    rules: { required: "Message is required" },
    textareaProps: { minRows: 3, placeholder: "Your message..." },
    type: "textarea",
  },
  {
    label: "Country",
    name: "country",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Australia", value: "au" },
    ],
    rules: { required: "Please select a country" },
    type: "select",
  },
  {
    label: "Subscribe to newsletter",
    name: "newsletter",
    type: "checkbox",
  },
  {
    label: "I agree to the terms and conditions",
    name: "terms",
    rules: { required: "You must agree to the terms" },
    type: "checkbox",
  },
];

const settingsFields: FormFieldConfig<SettingsFormData>[] = [
  {
    defaultValue: "light",
    label: "Theme",
    name: "theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
    type: "radio",
  },
  {
    defaultValue: "en",
    label: "Language",
    name: "language",
    options: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "French", value: "fr" },
    ],
    type: "select",
  },
  {
    defaultValue: true,
    label: "Enable Notifications",
    name: "notifications",
    type: "switch",
  },
  {
    defaultValue: false,
    label: "Auto Save",
    name: "autoSave",
    type: "switch",
  },
];

export default function ComprehensiveDemoPage() {
  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    alert(`Thank you ${data.firstName}! Your message has been sent.`);
  };

  const handleSettingsSubmit = (data: SettingsFormData) => {
    console.log("Settings form submitted:", data);
    alert(`Settings saved! Theme: ${data.theme}, Language: ${data.language}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hero Hook Form Demo</h1>
        <p className="text-gray-600">
          Comprehensive testing of all form field types and layouts
        </p>
      </div>

      {/* Contact Form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact Form</h2>
        <p className="text-gray-600">Single column form with all field types</p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ConfigurableForm
            fields={contactFields}
            layout="vertical"
            showResetButton={true}
            subtitle="We'd love to hear from you"
            title="Get in Touch"
            onSubmit={handleContactSubmit}
          />
        </div>
      </section>

      {/* Settings Form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Settings Form</h2>
        <p className="text-gray-600">Two column form with default values</p>
        <div className="bg-blue-50 p-6 rounded-lg">
          <ConfigurableForm
            columns={2}
            fields={settingsFields}
            layout="grid"
            showResetButton={true}
            subtitle="Customize your experience"
            title="User Settings"
            onSubmit={handleSettingsSubmit}
          />
        </div>
      </section>

      {/* Package Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Package Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-3">🔧 Field Types</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Input (text, email, tel)</li>
              <li>• Textarea with custom sizing</li>
              <li>• Select dropdown</li>
              <li>• Radio button groups</li>
              <li>• Checkboxes</li>
              <li>• Switch toggles</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-green-600 mb-3">✅ Validation</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Required field validation</li>
              <li>• Pattern matching (email)</li>
              <li>• Custom validation rules</li>
              <li>• Real-time error display</li>
              <li>• Form submission handling</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-purple-600 mb-3">🎨 Layouts</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vertical single column</li>
              <li>• Grid multi-column</li>
              <li>• Responsive design</li>
              <li>• Custom spacing</li>
              <li>• Form titles and subtitles</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
