"use client";

import React from "react";
import { z } from "zod";
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";

// Schema for a question form with multiple choice options
const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT"]),
  // Always define the choices array in schema - it will be conditionally shown
  choices: z
    .array(
      z.object({
        choiceText: z.string().min(1, "Choice text is required"),
        isCorrect: z.boolean().optional(),
      }),
    )
    .optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionFormDemo() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Question Form Demo</h1>
        <p className="text-muted-foreground">
          Demonstrates memory-safe conditional field arrays for multiple choice
          questions.
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <ZodForm<QuestionFormData>
          config={{
            schema: questionSchema,
            fields: [
              // Basic question fields
              FormFieldHelpers.input("questionText", "Question Text", "text", {
                placeholder: "Enter your question",
              }),

              FormFieldHelpers.select("questionType", "Question Type", [
                { label: "Single Choice", value: "SINGLE_CHOICE" },
                { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
                { label: "Text Answer", value: "TEXT" },
              ]),

              // ❌ OLD PROBLEMATIC APPROACH (causes memory leaks):
              // FormFieldHelpers.conditional(
              //   'choices',
              //   data => data.questionType === 'MULTIPLE_CHOICE',
              //   {
              //     type: 'fieldArray',
              //     name: 'choices',
              //     label: 'Choices',
              //     fields: [
              //       FormFieldHelpers.input('choiceText', 'Choice'),
              //       FormFieldHelpers.checkbox('isCorrect', 'Correct Answer'),
              //     ],
              //   }
              // ),

              // ✅ NEW MEMORY-SAFE APPROACH:
              FormFieldHelpers.conditionalFieldArray(
                "choices",
                (data) => data.questionType === "MULTIPLE_CHOICE",
                "Answer Choices",
                [
                  FormFieldHelpers.input("choiceText", "Choice Text", "text", {
                    placeholder: "Enter choice text",
                  }),
                  FormFieldHelpers.checkbox(
                    "isCorrect",
                    "Correct Answer (for single choice)",
                  ),
                ],
                {
                  min: 2,
                  max: 6,
                  addButtonText: "+ Add Choice",
                  removeButtonText: "Remove Choice",
                  defaultItem: () => ({
                    choiceText: "",
                    isCorrect: false,
                  }),
                },
              ),
            ],
          }}
          submitButtonText="Create Question"
          onSubmit={(data) => {
            console.log("Form submitted:", data);
            alert(
              `Question submitted!\n\nType: ${data.questionType}\nChoices: ${data.choices?.length || 0}`,
            );
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Memory-Safe Implementation ✅
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Uses <code>FormFieldHelpers.conditionalFieldArray()</code>
            </li>
            <li>• Field array is always registered but conditionally rendered</li>
            <li>• No register/unregister cycles that cause memory leaks</li>
            <li>• Compatible with Cypress Electron renderer memory limits</li>
            <li>• Perfect for multiple choice questions and dynamic forms</li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">
            ❌ Old Problematic Approach (Memory Leaks)
          </h3>
          <pre className="text-xs text-red-800 bg-red-100 p-2 rounded overflow-x-auto">
{`FormFieldHelpers.conditional(
  'choices',
  data => data.questionType === 'MULTIPLE_CHOICE', // 👈 Constant re-evaluation
  {
    type: 'fieldArray', // 👈 Register/unregister cycles
    name: 'choices',
    fields: [/* ... */],
  }
)`}
          </pre>
          <p className="text-sm text-red-800 mt-2">
            This causes memory leaks in Cypress due to constant field registration/unregistration cycles.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ New Memory-Safe Solution
          </h3>
          <pre className="text-xs text-green-800 bg-green-100 p-2 rounded overflow-x-auto">
{`FormFieldHelpers.conditionalFieldArray(
  'choices',
  data => data.questionType === 'MULTIPLE_CHOICE',
  'Answer Choices',
  [
    FormFieldHelpers.input('choiceText', 'Choice Text'),
    FormFieldHelpers.checkbox('isCorrect', 'Correct Answer'),
  ],
  {
    min: 2,
    max: 6,
    defaultItem: () => ({ choiceText: '', isCorrect: false }),
  }
)`}
          </pre>
          <p className="text-sm text-green-800 mt-2">
            Always-registered field arrays prevent memory accumulation in Cypress tests.
          </p>
        </div>
      </div>
    </div>
  );
}
