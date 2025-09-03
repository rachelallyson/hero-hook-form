"use client";

import React from "react";
import { CalendarDate } from "@internationalized/date";
import {
  ConfigurableForm,
  type FormFieldConfig,
} from "@rachelallyson/hero-hook-form";

interface NewFieldsFormData {
  volume: number;
  brightness: number;
  birthDate: CalendarDate | null;
  appointmentDate: CalendarDate | null;
  avatar: FileList | null;
  documents: FileList | null;
}

const newFieldsConfig: FormFieldConfig<NewFieldsFormData>[] = [
  {
    defaultValue: 50,
    description: "Adjust the volume",
    label: "Volume Level",
    name: "volume",
    sliderProps: {
      color: "primary",
      maxValue: 100,
      minValue: 0,
      step: 1,
    },
    type: "slider" as const,
  },
  {
    defaultValue: 75,
    description: "Adjust the brightness",
    label: "Brightness",
    name: "brightness",
    sliderProps: {
      color: "secondary",
      maxValue: 100,
      minValue: 0,
      step: 5,
    },
    type: "slider" as const,
  },
  {
    dateProps: {
      variant: "bordered",
    },
    description: "Select your birth date",
    label: "Date of Birth",
    name: "birthDate",
    rules: { required: "Date of birth is required" },
    type: "date" as const,
  },
  {
    dateProps: {
      variant: "flat",
    },
    description: "Choose appointment date",
    label: "Appointment Date",
    name: "appointmentDate",
    type: "date" as const,
  },
  {
    accept: "image/*",
    description: "Upload your profile picture",
    fileProps: {
      variant: "bordered",
    },
    label: "Profile Picture",
    multiple: false,
    name: "avatar",
    rules: { required: "Profile picture is required" },
    type: "file" as const,
  },
  {
    accept: ".pdf,.doc,.docx",
    description: "Upload supporting documents",
    fileProps: {
      variant: "flat",
    },
    label: "Documents",
    multiple: true,
    name: "documents",
    type: "file" as const,
  },
];

export default function NewFieldsDemoPage() {
  const handleSubmit = (data: NewFieldsFormData) => {
    console.log("Form submitted:", data);

    // Handle file uploads
    if (data.avatar) {
      console.log("Avatar files:", Array.from(data.avatar));
    }
    if (data.documents) {
      console.log("Document files:", Array.from(data.documents));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Field Types Demo</h1>
          <p className="text-gray-600">
            Explore the new slider, date, and file field types in Hero Hook
            Form.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ConfigurableForm
            columns={2}
            fields={newFieldsConfig}
            layout="grid"
            resetButtonText="Reset Form"
            showResetButton={true}
            spacing="lg"
            submitButtonText="Submit Form"
            subtitle="Experience the latest field components"
            title="New Field Types"
            onSubmit={handleSubmit}
          />
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Field Type Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-blue-900">Slider Fields</h3>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Customizable min/max values</li>
                <li>• Step increments</li>
                <li>• Color variants</li>
                <li>• Real-time value updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Date Fields</h3>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Date picker interface</li>
                <li>• Min/max date constraints</li>
                <li>• Custom placeholders</li>
                <li>• Validation support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900">File Fields</h3>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Single/multiple file upload</li>
                <li>• File type restrictions</li>
                <li>• Custom styling</li>
                <li>• File validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
