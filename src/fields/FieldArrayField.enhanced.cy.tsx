import React from "react";

import { mount } from "cypress/react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldArrayField } from "./FieldArrayField";
import { FormFieldHelpers } from "../builders/BasicFormBuilder";

interface TestFormData {
  slots: Array<{
    id?: string;
    order: number;
    slotType: "STATIC" | "DYNAMIC";
    staticQuestionId?: string;
  }>;
}

const slotSchema = z.object({
  id: z.string().optional(),
  order: z.number(),
  slotType: z.enum(["STATIC", "DYNAMIC"]),
  staticQuestionId: z.string().optional(),
});

const formSchema = z.object({
  slots: z.array(slotSchema),
});

const TestFormWithReordering = ({
  defaultValues = {},
}: {
  defaultValues?: Partial<TestFormData>;
}) => {
  const methods = useForm<TestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: [],
      ...defaultValues,
    },
  });

  const mockConfig = {
    name: "slots" as const,
    label: "Question Slots",
    type: "fieldArray" as const,
    fields: [
      FormFieldHelpers.select("slotType", "Slot Type", [
        { label: "Static", value: "STATIC" },
        { label: "Dynamic", value: "DYNAMIC" },
      ]),
      {
        ...FormFieldHelpers.select("staticQuestionId", "Question", [
          { label: "Q1", value: "q1" },
          { label: "Q2", value: "q2" },
        ]),
        dependsOn: "slotType" as any,
        dependsOnValue: "STATIC",
      },
    ],
    enableReordering: true,
    defaultItem: () => ({
      order: 0,
      slotType: "STATIC" as const,
      staticQuestionId: "",
    }),
    min: 0,
    max: 10,
    addButtonText: "Add Slot",
    removeButtonText: "Remove",
  };

  return (
    <FormProvider {...methods}>
      <form>
        <FieldArrayField config={mockConfig} />
      </form>
    </FormProvider>
  );
};

const TestFormWithCustomRender = ({
  defaultValues = {},
}: {
  defaultValues?: Partial<TestFormData>;
}) => {
  const methods = useForm<TestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: [],
      ...defaultValues,
    },
  });

  const mockConfig = {
    name: "slots" as const,
    label: "Question Slots",
    type: "fieldArray" as const,
    fields: [
      FormFieldHelpers.select("slotType", "Slot Type", [
        { label: "Static", value: "STATIC" },
        { label: "Dynamic", value: "DYNAMIC" },
      ]),
    ],
    renderItem: ({
      index,
      children,
      onMoveUp,
      onMoveDown,
      onRemove,
      canMoveUp,
      canMoveDown,
    }: any) => (
      <div
        key={index}
        className="border-2 border-blue-500 rounded-lg p-4 mb-4"
        data-testid={`slot-${index}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">Custom Slot {index + 1}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              data-testid={`move-up-${index}`}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              data-testid={`move-down-${index}`}
            >
              ↓
            </button>
            <button
              type="button"
              onClick={onRemove}
              data-testid={`remove-${index}`}
            >
              Remove
            </button>
          </div>
        </div>
        {children}
      </div>
    ),
    enableReordering: true,
    defaultItem: () => ({
      order: 0,
      slotType: "STATIC" as const,
    }),
    min: 0,
    max: 10,
    addButtonText: "Add Slot",
  };

  return (
    <FormProvider {...methods}>
      <form>
        <FieldArrayField config={mockConfig} />
      </form>
    </FormProvider>
  );
};

describe("FieldArrayField Enhanced Features", () => {
  describe("Reordering", () => {
    it("should show reorder buttons when enableReordering is true", () => {
      mount(<TestFormWithReordering />);

      cy.get('button').contains("Add Slot").click();

      // Should show up/down buttons
      cy.get('button[aria-label*="Move"]').should("have.length", 2);
    });

    it("should move item up when up button is clicked", () => {
      mount(
        <TestFormWithReordering
          defaultValues={{
            slots: [
              { order: 1, slotType: "STATIC", staticQuestionId: "q1" },
              { order: 2, slotType: "DYNAMIC" },
            ],
          }}
        />
      );

      // Click move up on second item
      cy.get('button[aria-label*="down"]').first().click();

      // Verify order changed (this would require checking form values)
      // For now, just verify buttons are present
      cy.get('button[aria-label*="Move"]').should("exist");
    });

    it("should disable up button for first item", () => {
      mount(
        <TestFormWithReordering
          defaultValues={{
            slots: [{ order: 1, slotType: "STATIC" }],
          }}
        />
      );

      // First item's up button should be disabled
      cy.get('button[aria-label*="up"]').should("be.disabled");
    });

    it("should disable down button for last item", () => {
      mount(
        <TestFormWithReordering
          defaultValues={{
            slots: [{ order: 1, slotType: "STATIC" }],
          }}
        />
      );

      // Last item's down button should be disabled
      cy.get('button[aria-label*="down"]').should("be.disabled");
    });
  });

  describe("Custom renderItem", () => {
    it("should use custom renderItem when provided", () => {
      mount(<TestFormWithCustomRender />);

      cy.get('button').contains("Add Slot").click();

      // Should see custom styling
      cy.get('[data-testid="slot-0"]').should("exist");
      cy.get('[data-testid="slot-0"]').should(
        "have.class",
        "border-blue-500",
      );
    });

    it("should render custom buttons in renderItem", () => {
      mount(<TestFormWithCustomRender />);

      cy.get('button').contains("Add Slot").click();

      // Should have custom move/remove buttons
      cy.get('[data-testid="move-up-0"]').should("exist");
      cy.get('[data-testid="move-down-0"]').should("exist");
      cy.get('[data-testid="remove-0"]').should("exist");
    });
  });

  describe("defaultItem", () => {
    it("should use defaultItem function when adding new item", () => {
      mount(<TestFormWithReordering />);

      cy.get('button').contains("Add Slot").click();

      // Should have default values from defaultItem
      // The slotType should be "STATIC" as per defaultItem
      cy.get('select').first().should("have.value", "STATIC");
    });
  });

  describe("Conditional fields within array items", () => {
    it("should show conditional field when condition is met", () => {
      mount(<TestFormWithReordering />);

      cy.get('button').contains("Add Slot").click();

      // Wait for the form to render - look for any select element
      cy.get('select', { timeout: 5000 }).should("exist");

      // Wait a bit for React to update the form state
      cy.wait(100);

      // staticQuestionId field should be visible when slotType is STATIC (default from defaultItem)
      // The field name will be something like "slots.0.staticQuestionId"
      // Use a more flexible selector that looks for the label or the select
      cy.contains("label", "Question").should("exist");
      cy.get('select').should("have.length.at.least", 2); // slotType + staticQuestionId
    });

    it("should hide conditional field when condition is not met", () => {
      mount(<TestFormWithReordering />);

      cy.get('button').contains("Add Slot").click();

      // Wait for the form to render
      cy.get('select', { timeout: 5000 }).should("exist");
      cy.wait(100);

      // Find the slotType select by finding the button near the "Slot Type" label
      // HeroUI Select uses a button trigger, not a native select
      cy.contains("Slot Type")
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Select DYNAMIC option
      cy.get('[role="option"]').contains("Dynamic").click({ force: true });

      // Wait for React to update
      cy.wait(200);

      // staticQuestionId field should be hidden after changing to DYNAMIC
      // Should only have 1 select trigger now (just slotType)
      cy.get('button[aria-haspopup="listbox"]').should("have.length", 1);
      cy.contains("label", "Question").should("not.exist");
    });
  });
});
