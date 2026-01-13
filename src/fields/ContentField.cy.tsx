import React from "react";
import { mount } from "cypress/react";
import { z } from "zod";
import { ZodForm, FormFieldHelpers, createBasicFormBuilder } from "../index";

interface TestFormData {
  firstName: string;
  lastName: string;
}

const testSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

describe("ContentField", () => {
  it("should render content field with title and description", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            {
              type: "content",
              title: "Personal Information",
              description: "Please provide your personal details below.",
            },
            {
              type: "input",
              name: "firstName",
              label: "First Name",
            },
            {
              type: "input",
              name: "lastName",
              label: "Last Name",
            },
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    // Check if content field renders
    cy.contains("Personal Information").should("exist");
    cy.contains("Please provide your personal details below.").should("exist");
    
    // Check if form fields still render
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });

  it("should render content field with custom render function", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            {
              type: "content",
              render: () => (
                <div className="custom-content">
                  <h2 className="text-2xl font-bold">Custom Header</h2>
                  <p>This is custom content between fields</p>
                </div>
              ),
            },
            {
              type: "input",
              name: "firstName",
              label: "First Name",
            },
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    // Check if custom content renders
    cy.contains("Custom Header").should("exist");
    cy.contains("This is custom content between fields").should("exist");
    
    // Check if form field still renders
    cy.contains("First Name").should("exist");
  });

  it("should render content field with only title", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            {
              type: "content",
              title: "Section Header",
            },
            {
              type: "input",
              name: "firstName",
              label: "First Name",
            },
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    cy.contains("Section Header").should("exist");
    cy.contains("First Name").should("exist");
  });

  it("should render content field with className", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            {
              type: "content",
              title: "Styled Header",
              className: "my-custom-class",
            },
            {
              type: "input",
              name: "firstName",
              label: "First Name",
            },
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    cy.contains("Styled Header")
      .parent()
      .should("have.class", "my-custom-class");
  });

  it("should work with multiple content fields", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            {
              type: "content",
              title: "Section 1",
            },
            {
              type: "input",
              name: "firstName",
              label: "First Name",
            },
            {
              type: "content",
              title: "Section 2",
            },
            {
              type: "input",
              name: "lastName",
              label: "Last Name",
            },
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    cy.contains("Section 1").should("exist");
    cy.contains("Section 2").should("exist");
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });

  it("should work with FormFieldHelpers.content()", () => {
    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            FormFieldHelpers.content("Helper Header", "Helper description"),
            FormFieldHelpers.input("firstName", "First Name", "text"),
            FormFieldHelpers.content(null, null, {
              render: () => <div className="helper-custom">Helper Custom Content</div>,
            }),
            FormFieldHelpers.input("lastName", "Last Name", "text"),
          ],
        }}
        onSubmit={async () => {}}
      />
    );

    cy.contains("Helper Header").should("exist");
    cy.contains("Helper description").should("exist");
    cy.contains("Helper Custom Content").should("exist");
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });

  it("should work with BasicFormBuilder.content()", () => {
    const fields = createBasicFormBuilder<TestFormData>()
      .content("Builder Header", "Builder description")
      .input("firstName", "First Name", "text")
      .content(null, null, {
        render: () => <div className="builder-custom">Builder Custom Content</div>,
      })
      .input("lastName", "Last Name", "text")
      .build();

    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields,
        }}
        onSubmit={async () => {}}
      />
    );

    cy.contains("Builder Header").should("exist");
    cy.contains("Builder description").should("exist");
    cy.contains("Builder Custom Content").should("exist");
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });
});
