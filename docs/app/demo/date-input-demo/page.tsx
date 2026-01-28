"use client";

import React from "react";
import { CalendarDate } from "@internationalized/date";
import { z } from "zod";
import {
  ZodForm,
  FormFieldHelpers,
  HeroHookFormProvider,
} from "@rachelallyson/hero-hook-form";

// Schema with date as CalendarDate | null (converted from Date/string in defaultValues)
const dateTestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.any().optional(),
  eventDate: z.any().optional(),
});

type DateTestFormData = z.infer<typeof dateTestSchema>;

// First section: use a normal Date and an ISO string (library converts to CalendarDate)
const defaultBirthDate = new Date(1995, 5, 15); // June 15, 1995 (month is 0-indexed)
const defaultEventDateIso = "2025-03-20"; // ISO string

export default function DateInputDemoPage() {
  const handleSubmit = (data: DateTestFormData) => {
    console.log("Form submitted:", data);
    const birthStr =
      data.birthDate &&
      `${data.birthDate.year}-${String(data.birthDate.month).padStart(2, "0")}-${String(data.birthDate.day).padStart(2, "0")}`;
    const eventStr =
      data.eventDate &&
      `${data.eventDate.year}-${String(data.eventDate.month).padStart(2, "0")}-${String(data.eventDate.day).padStart(2, "0")}`;
    alert(
      `Submitted: name=${data.name}, birthDate=${birthStr ?? "—"}, eventDate=${eventStr ?? "—"}`
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Date Input Demo</h1>
        <p className="text-gray-600">
          Testing date field styling (vs other inputs) and default value
          behavior.
        </p>
      </div>

      {/* With global defaults so date input matches other inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Date + text input with shared styles (HeroHookFormProvider)
        </h2>
        <p className="text-sm text-gray-600">
          Both fields should look the same (variant, size, radius). Birth Date
          uses a <code>new Date()</code> default; Event Date uses an ISO string
          (&quot;2025-03-20&quot;). Both are converted to CalendarDate.
        </p>
        <HeroHookFormProvider
          defaults={{
            common: {
              variant: "faded",
              size: "sm",
              radius: "lg",
              labelPlacement: "inside",
            },
          }}
        >
          <ZodForm<DateTestFormData>
            config={{
              schema: dateTestSchema,
              fields: [
                FormFieldHelpers.input<DateTestFormData>("name", "Name"),
                FormFieldHelpers.date<DateTestFormData>("birthDate", "Birth Date"),
                FormFieldHelpers.date<DateTestFormData>(
                  "eventDate",
                  "Event Date",
                ),
              ],
              defaultValues: {
                name: "Test User",
                birthDate: defaultBirthDate, // Date object
                eventDate: defaultEventDateIso, // ISO string
              },
            }}
            onSubmit={handleSubmit}
            showResetButton
            submitButtonText="Submit"
            resetButtonText="Reset"
          />
        </HeroHookFormProvider>
      </section>

      {/* ZodForm with Date default value */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          ZodForm with Date and ISO string defaults
        </h2>
        <p className="text-sm text-gray-600">
          Start Date uses <code>new Date(2000, 0, 1)</code>; converted to
          CalendarDate internally.
        </p>
        <HeroHookFormProvider
          defaults={{
            common: { variant: "bordered", size: "md", radius: "md" },
          }}
        >
          <ZodForm<StandaloneFormData>
            config={{
              schema: standaloneSchema,
              fields: [
                FormFieldHelpers.input<StandaloneFormData>("notes", "Notes", {
                  placeholder: "Optional notes",
                }),
                FormFieldHelpers.date<StandaloneFormData>(
                  "startDate",
                  "Start Date (default 2000-01-01)",
                ),
              ],
              defaultValues: {
                notes: "",
                startDate: defaultStartDate, // Date object
              },
            }}
            onSubmit={onStandaloneSubmit}
            submitButtonText="Submit"
          />
        </HeroHookFormProvider>
      </section>
    </div>
  );
}

// Standalone section schema and defaults
const standaloneSchema = z.object({
  notes: z.string().optional(),
  startDate: z.any().optional(), // CalendarDate | null (from Date/string)
});

type StandaloneFormData = z.infer<typeof standaloneSchema>;

const defaultStartDate = new Date(2000, 0, 1); // Jan 1, 2000 (month 0-indexed)

function onStandaloneSubmit(data: StandaloneFormData) {
  const d = data.startDate;
  const str = d
    ? `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
    : "—";
  alert(`Start date: ${str}, notes: ${data.notes ?? ""}`);
}
