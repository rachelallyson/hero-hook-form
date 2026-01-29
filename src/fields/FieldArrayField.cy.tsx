import React from "react";

import { mount } from "cypress/react";
import { useForm, FormProvider } from "react-hook-form";

import { FieldArrayField } from "./FieldArrayField";

interface TestFormData {
  items: Array<{
    name: string;
    email: string;
  }>;
}

const TestForm = ({ defaultValues = {} }: { defaultValues?: Partial<TestFormData> }) => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      items: [],
      ...defaultValues,
    },
  });

  const mockFieldConfigs = [
    {
      name: "name" as const,
      label: "Name",
      type: "input" as const,
      inputProps: { type: "text", placeholder: "Enter name" },
    },
    {
      name: "email" as const,
      label: "Email",
      type: "input" as const,
      inputProps: { type: "email", placeholder: "Enter email" },
    },
  ];

  const mockConfig = {
    name: "items" as const,
    label: "Items",
    type: "fieldArray" as const,
    fields: mockFieldConfigs,
    min: 0,
    max: 5,
    addButtonText: "Add Item",
    removeButtonText: "Remove",
    defaultItem: () => ({ name: "", email: "" }),
  };

  return (
    <FormProvider {...methods}>
      <form>
        <FieldArrayField config={mockConfig} />
      </form>
    </FormProvider>
  );
};

describe("FieldArrayField", () => {
  it("should render field array with add button", () => {
    mount(<TestForm />);

    cy.get('button').contains("Add Item").should("be.visible");
  });

  it("should add new item when add button is clicked", () => {
    mount(<TestForm />);

    cy.get('button').contains("Add Item").click();

    cy.get('h4').contains("Items #1").should("be.visible");
    cy.get('input[placeholder="Enter name"]').should("exist");
    cy.get('input[placeholder="Enter email"]').should("exist");
  });

  it("should remove item when remove button is clicked", () => {
    mount(<TestForm />);

    // Add item first
    cy.get('button').contains("Add Item").click();
    cy.get('h4').contains("Items #1").should("be.visible");

    // Verify we have one item
    cy.get('h4').should("have.length", 1);

    // Remove item - use more specific selector
    cy.get('button[aria-label*="Remove"]').click();

    // Wait for item to be removed - check that no h4 elements exist
    cy.get('h4').should("not.exist");
  });

  it("should add multiple items", () => {
    mount(<TestForm />);

    // Add multiple items
    cy.get('button').contains("Add Item").click();
    cy.get('button').contains("Add Item").click();
    cy.get('button').contains("Add Item").click();

    // Verify all items were added
    cy.get('h4').contains("Items #1").should("be.visible");
    cy.get('h4').contains("Items #2").should("be.visible");
    cy.get('h4').contains("Items #3").should("be.visible");
  });

  it("should respect maximum limit", () => {
    mount(<TestForm />);

    // Add items up to maximum (5)
    for (let i = 0; i < 5; i++) {
      cy.get('button').contains("Add Item").click();
    }

    // Should not be able to add more
    cy.get('button').contains("Add Item").should("not.exist");
  });

  it("should fill and validate field array items", () => {
    mount(<TestForm />);

    // Add item
    cy.get('button').contains("Add Item").click();

    // Fill fields
    cy.get('input[placeholder="Enter name"]').type("John Doe");
    cy.get('input[placeholder="Enter email"]').type("john@example.com");

    // Verify values
    cy.get('input[placeholder="Enter name"]').should("have.value", "John Doe");
    cy.get('input[placeholder="Enter email"]').should("have.value", "john@example.com");
  });
});
