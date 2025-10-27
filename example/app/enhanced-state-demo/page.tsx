"use client";

import React from "react";
import { z } from "zod";
import { 
  ZodForm, 
  createAdvancedBuilder,
  FormStatus,
  FormToast,
  useEnhancedFormState 
} from "@rachelallyson/hero-hook-form";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  subscribe: z.boolean().optional(),
});

type ContactForm = z.infer<typeof contactFormSchema>;

const contactFormFields = createAdvancedBuilder<ContactForm>()
  .field("input", "name", "Full Name", { placeholder: "Enter your full name" })
  .field("input", "email", "Email Address", { type: "email", placeholder: "Enter your email" })
  .field("select", "priority", "Priority", [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ])
  .field("textarea", "message", "Message", { 
    placeholder: "Enter your message",
    rows: 4,
  })
  .field("checkbox", "subscribe", "Subscribe to newsletter")
  .build();

export default function EnhancedStateDemo() {
  const [showToast, setShowToast] = React.useState(false);
  const [toastPosition, setToastPosition] = React.useState<"top-right" | "top-left" | "bottom-right" | "bottom-left">("top-right");

  const handleSubmit = async (data: ContactForm) => {
    console.log("Contact form submitted:", data);
    
    // Simulate different scenarios
    const random = Math.random();
    
    if (random < 0.3) {
      // Simulate network error
      throw new Error("Network error. Please check your connection and try again.");
    } else if (random < 0.6) {
      // Simulate validation error
      throw new Error("Server validation failed. Please check your input.");
    } else {
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const handleSuccess = (data: ContactForm) => {
    console.log("Form submitted successfully:", data);
    setShowToast(true);
  };

  const handleError = (error: any) => {
    console.error("Form submission error:", error);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enhanced Form State Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating loading states, success feedback, and error handling
        </p>
      </div>

      {/* Toast Position Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Toast Position</h3>
        <div className="flex gap-2 flex-wrap">
          {(["top-right", "top-left", "bottom-right", "bottom-left"] as const).map((position) => (
            <button
              key={position}
              onClick={() => setToastPosition(position)}
              className={`px-3 py-1 rounded text-sm ${
                toastPosition === position
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {position.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ZodForm
          config={{
            schema: contactFormSchema,
            fields: contactFormFields,
          }}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
          title="Contact Us"
          subtitle="Send us a message with enhanced state management"
          columns={1}
          layout="vertical"
          showResetButton={true}
          errorDisplay="inline"
        />
      </div>

      {/* Enhanced State Features */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Enhanced State Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Loading States</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Submit button shows loading spinner</li>
              <li>• Form fields are disabled during submission</li>
              <li>• Loading indicator in form status</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Success Feedback</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Success message with checkmark</li>
              <li>• Auto-reset after 3 seconds</li>
              <li>• Optional toast notifications</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Error Handling</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Comprehensive error messages</li>
              <li>• Server-side error integration</li>
              <li>• Dismissible error states</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">State Tracking</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Touched and dirty field tracking</li>
              <li>• Error count monitoring</li>
              <li>• Form submission history</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast Demo */}
      {showToast && (
        <FormToast
          state={{
            status: "success",
            isSubmitting: false,
            isSuccess: true,
            isError: false,
            touchedFields: new Set<string>(),
            dirtyFields: new Set<string>(),
            hasErrors: false,
            errorCount: 0,
            handleSuccess: () => {},
            handleError: () => {},
            reset: () => {},
          }}
          onDismiss={() => setShowToast(false)}
          position={toastPosition}
          duration={5000}
        />
      )}

      {/* Testing Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Success Flow:</strong> Fill out the form completely and submit to see success state.</p>
          <p><strong>Error Flow:</strong> Submit with incomplete data to see validation errors.</p>
          <p><strong>Network Error:</strong> Submit multiple times to trigger simulated network errors.</p>
          <p><strong>Toast Demo:</strong> Complete a successful submission to see the toast notification.</p>
        </div>
      </div>
    </div>
  );
}
