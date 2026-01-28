"use client";

import React, { useState, useCallback } from "react";
import { z } from "zod";
import {
  ZodForm,
  createAdvancedBuilder,
  createFieldArrayBuilder,
  useDebouncedValidation,
  usePerformanceMonitor,
  debounce,
  throttle,
} from "@rachelallyson/hero-hook-form";

const performanceFormSchema = z.object({
  address: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  experience: z
    .array(
      z.object({
        company: z.string(),
        duration: z.string(),
        position: z.string(),
      }),
    )
    .optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

type PerformanceForm = z.infer<typeof performanceFormSchema>;

const performanceFormFields = createAdvancedBuilder<PerformanceForm>()
  .field({ type: "input", name: "firstName", label: "First Name" })
  .field({ type: "input", name: "lastName", label: "Last Name" })
  .field({ type: "input", name: "email", label: "Email", props: { type: "email" } })
  .field({ type: "input", name: "phone", label: "Phone", props: { type: "tel" } })
  .field({ type: "input", name: "address", label: "Address" })
  .field({ type: "input", name: "city", label: "City" })
  .field({ type: "input", name: "state", label: "State" })
  .field({ type: "input", name: "zip", label: "ZIP Code" })
  .field({ type: "input", name: "country", label: "Country" })
  .field({ type: "textarea", name: "bio", label: "Bio", props: { rows: 4 } })
  .field({
    type: "stringArray",
    name: "skills",
    label: "Skills",
    props: { addButtonText: "Add Skill", placeholder: "Enter a skill" },
  })
  .fieldArray(
    "experience",
    "Work Experience",
    createFieldArrayBuilder<PerformanceForm, "experience">("experience")
      .field({ type: "input", name: "company", label: "Company" })
      .field({ type: "input", name: "position", label: "Position" })
      .field({ type: "input", name: "duration", label: "Duration" })
      .build(),
    {
      addButtonText: "Add Experience",
      max: 5,
      min: 0,
      removeButtonText: "Remove Experience",
    },
  )
  .build();

// Performance monitoring component
function PerformanceMonitor() {
  const { renderCount, resetRenderCount } = usePerformanceMonitor(
    "PerformanceMonitor",
    true,
  );

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="font-semibold text-yellow-900 mb-2">
        Performance Monitor
      </h3>
      <p className="text-sm text-yellow-800">Render count: {renderCount}</p>
      <button
        onClick={resetRenderCount}
        className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-900 rounded text-sm hover:bg-yellow-300"
      >
        Reset Count
      </button>
    </div>
  );
}

// Debounced input component
function DebouncedInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue);
    }, 300),
    [onChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Throttled button component
function ThrottledButton({
  children,
  onClick,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const throttledOnClick = useCallback(
    throttle(() => {
      onClick();
    }, 1000),
    [onClick],
  );

  return (
    <button
      onClick={throttledOnClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

export default function PerformanceDemo() {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number>(Date.now());
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    renderCount: number;
    averageRenderTime: number;
    lastRenderTime: number;
  }>({
    averageRenderTime: 0,
    lastRenderTime: 0,
    renderCount: 0,
  });

  // Track render performance
  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime;

    setPerformanceMetrics((prev) => ({
      averageRenderTime: (prev.averageRenderTime + timeSinceLastRender) / 2,
      lastRenderTime: now,
      renderCount: prev.renderCount + 1,
    }));

    setLastRenderTime(now);
    setRenderCount((prev) => prev + 1);
  });

  const handleSubmit = async (data: PerformanceForm) => {
    console.log("Performance form submitted:", data);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDebouncedChange = (value: string) => {
    console.log("Debounced change:", value);
  };

  const handleThrottledClick = () => {
    console.log("Throttled click at:", new Date().toISOString());
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Performance Optimization Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating memoization, debouncing, throttling, and performance
          monitoring
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Render Count</h3>
            <p className="text-2xl font-bold text-blue-600">{renderCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Average Render Time
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {performanceMetrics.averageRenderTime.toFixed(2)}ms
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Last Render</h3>
            <p className="text-2xl font-bold text-purple-600">
              {performanceMetrics.lastRenderTime}ms ago
            </p>
          </div>
        </div>
      </div>

      {/* Performance Techniques Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debouncing Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Debouncing Demo
          </h3>
          <p className="text-gray-600 mb-4">
            Type in the input below. The onChange event is debounced by 300ms.
          </p>
          <DebouncedInput
            value=""
            onChange={handleDebouncedChange}
            placeholder="Type here to see debouncing in action..."
            label="Debounced Input"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Check the console to see debounced change
              events.
            </p>
          </div>
        </div>

        {/* Throttling Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Throttling Demo
          </h3>
          <p className="text-gray-600 mb-4">
            Click the button rapidly. The click event is throttled to once per
            second.
          </p>
          <ThrottledButton onClick={handleThrottledClick}>
            Throttled Button
          </ThrottledButton>
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> Check the console to see throttled click
              events.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Monitor Component */}
      <PerformanceMonitor />

      {/* Main Form with Performance Optimizations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Optimized Form
        </h2>
        <p className="text-gray-600 mb-6">
          This form uses memoized components, debounced validation, and
          performance optimizations.
        </p>

        <ZodForm
          config={{
            fields: performanceFormFields,
            schema: performanceFormSchema,
          }}
          onSubmit={handleSubmit}
          title="Performance Test Form"
          subtitle="Large form with performance optimizations"
          columns={2}
          layout="grid"
          showResetButton={true}
        />
      </div>

      {/* Performance Features */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Performance Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Memoization</h3>
            <p className="text-sm text-gray-600">
              All field components are memoized with React.memo to prevent
              unnecessary re-renders.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Debounced Validation
            </h3>
            <p className="text-sm text-gray-600">
              Field validation is debounced to reduce API calls and improve
              performance.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Batched Updates
            </h3>
            <p className="text-sm text-gray-600">
              Field updates are batched to reduce the number of re-renders.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Performance Monitoring
            </h3>
            <p className="text-sm text-gray-600">
              Built-in performance monitoring tools for development and
              debugging.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Memory Optimization
            </h3>
            <p className="text-sm text-gray-600">
              Proper cleanup and memory management to prevent memory leaks.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Bundle Optimization
            </h3>
            <p className="text-sm text-gray-600">
              Tree-shakeable exports and optimized bundle size.
            </p>
          </div>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Performance Testing
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Render Count:</strong> Watch the render count increase as
            you interact with the form.
          </p>
          <p>
            <strong>Debouncing:</strong> Type in the debounced input and observe
            the console for delayed events.
          </p>
          <p>
            <strong>Throttling:</strong> Rapidly click the throttled button to
            see rate limiting in action.
          </p>
          <p>
            <strong>Memory:</strong> Open browser dev tools to monitor memory
            usage during form interactions.
          </p>
        </div>
      </div>
    </div>
  );
}
