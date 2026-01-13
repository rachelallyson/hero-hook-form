import React from "react";
import { mount } from "cypress/react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
import { ZodForm, FormFieldHelpers } from "../index";

interface TestFormData {
  showField: boolean;
  conditionalInput?: string;
}

const testSchema = z.object({
  showField: z.boolean(),
  conditionalInput: z.string().optional(),
});

describe("ZodForm with Conditional Fields", () => {
  it("should create conditional field config using FormFieldHelpers.conditional", () => {
    const condition = (data: Partial<TestFormData>) => data.showField === true;
    const field = FormFieldHelpers.input("conditionalInput", "Conditional Input", "text");
    
    // Use conditionalInput as the name since it's the field being conditionally rendered
    const config = FormFieldHelpers.conditional("conditionalInput", condition, field);
    
    expect(config).to.deep.equal({
      type: "conditional",
      name: "conditionalInput",
      condition,
      field,
    });
  });

  it("should work with conditional fields WITHOUT FormProvider wrapper", () => {
    const handleSubmit = async (data: TestFormData) => {
      console.log("Submitted:", data);
    };

    mount(
      <ZodForm<TestFormData>
        config={{
          schema: testSchema,
          fields: [
            FormFieldHelpers.checkbox("showField", "Show Conditional Field"),
            FormFieldHelpers.conditional(
              "conditionalInput",
              (data: Partial<TestFormData>) => data.showField === true,
              FormFieldHelpers.input("conditionalInput", "Conditional Input", "text"),
            ),
          ],
          defaultValues: {
            showField: false,
            conditionalInput: "",
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Check if checkbox label exists
    cy.contains("Show Conditional Field").should("exist");
    
    // Initially, conditional field should not be visible (label won't exist)
    cy.contains("Conditional Input").should("not.exist");

    // Find and check the checkbox (HeroUI checkbox)
    cy.contains("Show Conditional Field").parent().find('input[type="checkbox"]').check({ force: true });

    // Now conditional field label should be visible
    cy.contains("Conditional Input").should("exist");
    
    // Find the input field and type
    cy.contains("Conditional Input").parent().find('input').type("test value");

    // Verify the value
    cy.contains("Conditional Input").parent().find('input').should("have.value", "test value");
  });

  it("should work with conditional fields WITH FormProvider wrapper", () => {
    const TestFormWithProvider = () => {
      const methods = useForm<TestFormData>({
        defaultValues: {
          showField: false,
          conditionalInput: "",
        },
      });

      const handleSubmit = async (data: TestFormData) => {
        console.log("Submitted:", data);
      };

      return (
        <FormProvider {...methods}>
          <ZodForm<TestFormData>
            config={{
              schema: testSchema,
              fields: [
                FormFieldHelpers.checkbox("showField", "Show Conditional Field"),
                FormFieldHelpers.conditional(
                  "conditionalInput",
                  (data: Partial<TestFormData>) => data.showField === true,
                  FormFieldHelpers.input("conditionalInput", "Conditional Input", "text"),
                ),
              ],
            }}
            onSubmit={handleSubmit}
          />
        </FormProvider>
      );
    };

    mount(<TestFormWithProvider />);

    // Check if form renders
    cy.get('form').should("exist");
    
    // Check if checkbox label exists
    cy.contains("Show Conditional Field").should("exist");
    
    // Initially, conditional field should not be visible
    cy.contains("Conditional Input").should("not.exist");

    // Find and check the checkbox
    cy.contains("Show Conditional Field").parent().find('input[type="checkbox"]').check({ force: true });

    // Now conditional field should be visible
    cy.contains("Conditional Input").should("exist");
    
    // Find the input and type
    cy.contains("Conditional Input").parent().find('input').type("test value");

    // Verify the value
    cy.contains("Conditional Input").parent().find('input').should("have.value", "test value");
  });

  it("should work with field arrays WITHOUT FormProvider wrapper", () => {
    const arraySchema = z.object({
      items: z.array(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email"),
        })
      ).min(1, "At least one item is required"),
    });

    const handleSubmit = async (data: z.infer<typeof arraySchema>) => {
      console.log("Submitted:", data);
    };

    mount(
      <ZodForm<z.infer<typeof arraySchema>>
        config={{
          schema: arraySchema,
          fields: [
            {
              type: "fieldArray",
              name: "items",
              label: "Items",
              fields: [
                FormFieldHelpers.input("name", "Name", "text"),
                FormFieldHelpers.input("email", "Email", "email"),
              ],
              min: 1,
              max: 5,
              addButtonText: "Add Item",
              removeButtonText: "Remove",
            },
          ],
          defaultValues: {
            items: [],
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Should show add button
    cy.get('button').contains("Add Item").should("be.visible");

    // Click add button
    cy.get('button').contains("Add Item").click();

    // Should show the field labels
    cy.contains("Name").should("exist");
    cy.contains("Email").should("exist");

    // Fill in the fields using labels
    cy.contains("Name").parent().find('input').type("John Doe");
    cy.contains("Email").parent().find('input').type("john@example.com");

    // Verify values
    cy.contains("Name").parent().find('input').should("have.value", "John Doe");
    cy.contains("Email").parent().find('input').should("have.value", "john@example.com");
  });

  it("should work with date field helper", () => {
    interface DateFormData {
      birthDate: CalendarDate | null;
      appointmentDate: CalendarDate | null;
    }

    const dateSchema = z.object({
      birthDate: z.any().optional(), // CalendarDate is not a native Zod type
      appointmentDate: z.any().optional(),
    });

    const handleSubmit = async (data: DateFormData) => {
      console.log("Submitted:", data);
    };

    mount(
      <ZodForm<DateFormData>
        config={{
          schema: dateSchema,
          fields: [
            FormFieldHelpers.date("birthDate", "Date of Birth"),
            FormFieldHelpers.date("appointmentDate", "Appointment Date", {
              variant: "bordered",
            }),
          ],
          defaultValues: {
            birthDate: null,
            appointmentDate: null,
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Check if date field labels exist
    cy.contains("Date of Birth").should("be.visible");
    cy.contains("Appointment Date").should("be.visible");
    
    // Date inputs should be rendered (HeroUI DateInput renders as text inputs)
    cy.get('input[type="text"]').should("have.length.at.least", 2);
  });

  it("should work with date field helper with validation", () => {
    interface DateFormData {
      birthDate: CalendarDate | null;
    }

    const dateSchema = z.object({
      birthDate: z.any().refine(
        (val) => val !== null && val !== undefined,
        { message: "Date of birth is required" }
      ),
    });

    const handleSubmit = async (data: DateFormData) => {
      console.log("Submitted:", data);
    };

    mount(
      <ZodForm<DateFormData>
        config={{
          schema: dateSchema,
          fields: [
            FormFieldHelpers.date("birthDate", "Date of Birth"),
          ],
          defaultValues: {
            birthDate: null,
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Check if date field label exists
    cy.contains("Date of Birth").should("be.visible");
    
    // Try to submit without filling the date
    cy.get('button[type="submit"]').click();
    
    // Should show validation error
    cy.contains("Date of birth is required").should("exist");
  });

  it("should work with date field helper with default value", () => {
    interface DateFormData {
      birthDate: CalendarDate | null;
    }

    const dateSchema = z.object({
      birthDate: z.any().optional(),
    });

    const handleSubmit = async (data: DateFormData) => {
      console.log("Submitted:", data);
    };

    const defaultDate = new CalendarDate(1990, 1, 15);

    mount(
      <ZodForm<DateFormData>
        config={{
          schema: dateSchema,
          fields: [
            FormFieldHelpers.date("birthDate", "Date of Birth"),
          ],
          defaultValues: {
            birthDate: defaultDate,
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Check if date field label exists
    cy.contains("Date of Birth").should("be.visible");
    
    // Date input should be rendered
    cy.get('input[type="text"]').should("exist");
  });

  it("should work with cy.submitForm() helper", () => {
    const simpleSchema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
    });

    const handleSubmit = cy.stub().as('handleSubmit');

    mount(
      <ZodForm<z.infer<typeof simpleSchema>>
        config={{
          schema: simpleSchema,
          fields: [
            FormFieldHelpers.input("name", "Name", "text"),
            FormFieldHelpers.input("email", "Email", "email"),
          ],
          defaultValues: {
            name: "",
            email: "",
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Fill in the form
    cy.contains("Name").parent().find('input').type("John Doe");
    cy.contains("Email").parent().find('input').type("john@example.com");
    
    // Use the cy.submitForm() helper
    cy.submitForm();
    
    // Verify the form was submitted
    cy.get('@handleSubmit').should('have.been.called');
  });

  it("should work with cy.submitForm() helper and show validation errors", () => {
    const simpleSchema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
    });

    const handleSubmit = cy.stub().as('handleSubmit');

    mount(
      <ZodForm<z.infer<typeof simpleSchema>>
        config={{
          schema: simpleSchema,
          fields: [
            FormFieldHelpers.input("name", "Name", "text"),
            FormFieldHelpers.input("email", "Email", "email"),
          ],
          defaultValues: {
            name: "",
            email: "",
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    // Check if form renders
    cy.get('form').should("exist");
    
    // Try to submit without filling the form using cy.submitForm() helper
    cy.submitForm();
    
    // Should show validation errors
    cy.contains("Name is required").should("exist");
    
    // Form should still exist (validation prevented submission)
    cy.get('form').should("exist");
    
    // onSubmit should not have been called
    cy.get('@handleSubmit').should('not.have.been.called');
  });
});
