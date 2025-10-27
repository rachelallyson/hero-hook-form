import React from "react";

import { mount } from "cypress/react";
import { useForm, FormProvider } from "react-hook-form";

import { ConditionalField } from "./ConditionalField";

interface TestFormData {
  showField: boolean;
  conditionalInput: string;
}

const TestForm = ({ defaultValues = {} }: { defaultValues?: Partial<TestFormData> }) => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      showField: false,
      conditionalInput: "",
      ...defaultValues,
    },
  });

  const mockField = {
    name: "conditionalInput" as const,
    label: "Conditional Input",
    type: "input" as const,
    inputProps: { type: "text", placeholder: "Enter value" },
  };

  const mockConfig = {
    name: "conditionalField" as const,
    type: "conditional" as const,
    condition: (data: Partial<TestFormData>) => data.showField === true,
    field: mockField,
  };

  return (
    <FormProvider {...methods}>
      <form>
        <input
          type="checkbox"
          checked={methods.watch("showField")}
          onChange={(e) => methods.setValue("showField", e.target.checked)}
        />
        <label>Show Conditional Field</label>
        <ConditionalField config={mockConfig} control={methods.control} />
      </form>
    </FormProvider>
  );
};

describe("ConditionalField", () => {
  it("should render child field when condition is met", () => {
    mount(<TestForm defaultValues={{ showField: true }} />);

    cy.get('input[placeholder="Enter value"]').should("exist");
    cy.get('label').contains("Conditional Input").should("be.visible");
  });

  it("should not render child field when condition is not met", () => {
    mount(<TestForm defaultValues={{ showField: false }} />);

    cy.get('input[placeholder="Enter value"]').should("not.exist");
    cy.get('label').contains("Conditional Input").should("not.exist");
  });

  it("should update when condition changes", () => {
    mount(<TestForm defaultValues={{ showField: false }} />);

    // Initially hidden
    cy.get('input[placeholder="Enter value"]').should("not.exist");

    // Check the checkbox to show field
    cy.get('input[type="checkbox"]').check();

    // Field should now be visible
    cy.get('input[placeholder="Enter value"]').should("exist");
    cy.get('label').contains("Conditional Input").should("be.visible");

    // Uncheck to hide field
    cy.get('input[type="checkbox"]').uncheck();

    // Field should be hidden again
    cy.get('input[placeholder="Enter value"]').should("not.exist");
  });

  it("should apply custom className", () => {
    mount(<TestForm defaultValues={{ showField: true }} />);

    // The conditional field should be rendered with its content
    cy.get('input[placeholder="Enter value"]').should("exist");
  });
});
