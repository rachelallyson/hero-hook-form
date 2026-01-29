"use client";

import type { Path } from "react-hook-form";
import React, { useState } from "react";
import { z } from "zod";

import {
  createCustomFieldConfigForItem,
  createFieldArrayCustomConfig,
  FormFieldHelpers,
  ZodForm,
  type CustomFieldDef,
} from "@rachelallyson/hero-hook-form";

const customFieldValuesSchema = z.object({
  customFieldValues: z.array(
    z.object({
      customFieldId: z.string(),
      id: z.string().optional(),
      value: z.union([z.string(), z.number()]).optional(),
    }),
  ),
  title: z.string().min(1, "Title is required"),
});

type CustomFieldValuesFormData = z.infer<typeof customFieldValuesSchema>;

const fieldDefs: (CustomFieldDef & { id: string })[] = [
  { id: "f1", fieldType: "SHORT_TEXT", name: "Short Text Field" },
  {
    id: "f2",
    fieldType: "DROPDOWN",
    name: "Choice",
    options: "Alpha\nBeta\nGamma",
  },
];

export default function CustomFieldArrayDemo() {
  const [submittedData, setSubmittedData] =
    useState<CustomFieldValuesFormData | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Custom Field Array (getItemFieldConfig)
        </h1>
        <p className="text-default-600">
          ZodForm with createFieldArrayCustomConfig and getItemFieldConfig +
          createCustomFieldConfigForItem. Each array item renders one control by
          type (SHORT_TEXT, DROPDOWN).
        </p>
      </div>

      <ZodForm<CustomFieldValuesFormData>
        config={{
          schema: customFieldValuesSchema,
          defaultValues: {
            customFieldValues: [
              { customFieldId: "f1", value: "" },
              { customFieldId: "f2", value: "" },
            ],
            title: "",
          },
          fields: [
            FormFieldHelpers.input("title", "Form Title"),
            createFieldArrayCustomConfig<CustomFieldValuesFormData>({
              label: "Custom Fields",
              name: "customFieldValues",
              renderAddButton: () => null,
              getItemFieldConfig: ({ field, index }) => {
                const def = fieldDefs.find((f) => f.id === field.customFieldId);
                if (!def) return null;
                const { id: _id, ...rest } = def;

                return createCustomFieldConfigForItem(
                  `customFieldValues.${index}.value` as Path<CustomFieldValuesFormData>,
                  rest as CustomFieldDef,
                );
              },
              defaultItem: () => ({ customFieldId: "f1", value: "" }),
            }),
          ],
        }}
        onSubmit={async (data) => {
          setSubmittedData(data);
        }}
      />

      {submittedData && (
        <div
          className="mt-6 p-4 rounded-lg bg-success-100 border border-success-200"
          data-testid="submit-success"
        >
          <h2 className="text-lg font-semibold text-success-800">
            Form submitted
          </h2>
          <pre className="mt-2 text-sm text-success-700 overflow-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
