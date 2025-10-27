import React from "react";

import { mount } from "cypress/react";
import { useForm, FormProvider } from "react-hook-form";

import { DynamicSectionField } from "./DynamicSectionField";

interface TestFormData {
  showSection: boolean;
  field1: string;
  field2: string;
}

const TestForm = ({ defaultValues = {} }: { defaultValues?: Partial<TestFormData> }) => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      showSection: false,
      field1: "",
      field2: "",
      ...defaultValues,
    },
  });

  const mockFields = [
    {
      name: "field1" as const,
      label: "Field 1",
      type: "input" as const,
      inputProps: { type: "text", placeholder: "Enter value 1" },
    },
    {
      name: "field2" as const,
      label: "Field 2",
      type: "input" as const,
      inputProps: { type: "text", placeholder: "Enter value 2" },
    },
  ];

  const mockConfig = {
    name: "showSection" as const,
    type: "dynamicSection" as const,
    condition: (data: Partial<TestFormData>) => data.showSection === true,
    fields: mockFields,
    title: "Dynamic Section",
    description: "This section appears conditionally",
  };

  return (
    <FormProvider {...methods}>
      <form>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="showSection"
            checked={methods.watch("showSection")}
            onChange={(e) => methods.setValue("showSection", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showSection" className="text-sm font-medium text-gray-700">
            Show Dynamic Section
          </label>
        </div>
        <DynamicSectionField config={mockConfig} control={methods.control} />
      </form>
    </FormProvider>
  );
};

describe("DynamicSectionField", () => {
  it("should render section with title and description when condition is met", () => {
    mount(<TestForm defaultValues={{ showSection: true }} />);

    cy.get('h3').contains("Dynamic Section").should("be.visible");
    cy.get('p').contains("This section appears conditionally").should("be.visible");
    cy.get('input[placeholder="Enter value 1"]').should("exist");
    cy.get('input[placeholder="Enter value 2"]').should("exist");
  });

  it("should not render section when condition is not met", () => {
    mount(<TestForm defaultValues={{ showSection: false }} />);

    // The section should not be rendered at all
    cy.get('input[placeholder="Enter value 1"]').should("not.exist");
    cy.get('input[placeholder="Enter value 2"]').should("not.exist");
  });

  it("should update when condition changes", () => {
    mount(<TestForm defaultValues={{ showSection: false }} />);

    // Initially hidden
    cy.get('input[placeholder="Enter value 1"]').should("not.exist");

    // Check the checkbox to show section
    cy.get('input[type="checkbox"]').check();

    // Section should now be visible
    cy.get('h3').contains("Dynamic Section").should("be.visible");
    cy.get('p').contains("This section appears conditionally").should("be.visible");
    cy.get('input[placeholder="Enter value 1"]').should("exist");
    cy.get('input[placeholder="Enter value 2"]').should("exist");

    // Uncheck to hide section
    cy.get('input[type="checkbox"]').uncheck();

    // Section should be hidden again
    cy.get('input[placeholder="Enter value 1"]').should("not.exist");
  });

  it("should render without title and description", () => {
    const TestFormWithoutTitle = () => {
      const methods = useForm<TestFormData>({
        defaultValues: { showSection: true, field1: "", field2: "" },
      });

      const mockFields = [
        {
          name: "field1" as const,
          label: "Field 1",
          type: "input" as const,
          inputProps: { type: "text", placeholder: "Enter value 1" },
        },
        {
          name: "field2" as const,
          label: "Field 2",
          type: "input" as const,
          inputProps: { type: "text", placeholder: "Enter value 2" },
        },
      ];

      const mockConfig = {
        name: "showSection" as const,
        type: "dynamicSection" as const,
        condition: () => true,
        fields: mockFields,
        title: undefined,
        description: undefined,
      };

      return (
        <FormProvider {...methods}>
          <form>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="showSection2"
                checked={methods.watch("showSection")}
                onChange={(e) => methods.setValue("showSection", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showSection2" className="text-sm font-medium text-gray-700">
                Show Dynamic Section
              </label>
            </div>
            <DynamicSectionField config={mockConfig} control={methods.control} />
          </form>
        </FormProvider>
      );
    };

    mount(<TestFormWithoutTitle />);

    // Should not have title and description
    cy.get('h3').should("not.exist");
    cy.get('p').should("not.exist");
    // But should have the fields
    cy.get('input[placeholder="Enter value 1"]').should("exist");
    cy.get('input[placeholder="Enter value 2"]').should("exist");
  });

  it("should apply custom className", () => {
    mount(<TestForm defaultValues={{ showSection: true }} />);

    // The dynamic section should be rendered with its content
    cy.get('h3').contains("Dynamic Section").should("be.visible");
  });
});
