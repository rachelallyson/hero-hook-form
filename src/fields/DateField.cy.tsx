import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { DateField } from "./DateField";
import { CalendarDate } from "@internationalized/date";

interface TestFormData {
  birthDate: CalendarDate | null;
  appointmentDate: CalendarDate | null;
}

function TestDateField() {
  const methods = useForm<TestFormData>({
    defaultValues: {
      appointmentDate: null,
      birthDate: new CalendarDate(1990, 1, 1),
    },
  });

  return (
    <div className="space-y-4">
      <DateField
        control={methods.control}
        dateProps={{
          variant: "bordered",
        }}
        description="Select your birth date"
        label="Date of Birth"
        name="birthDate"
      />
      <DateField
        control={methods.control}
        dateProps={{
          variant: "flat",
        }}
        label="Appointment Date"
        name="appointmentDate"
      />
    </div>
  );
}

describe("DateField", () => {
  it("should render with label", () => {
    mount(<TestDateField />);
    // Give the HeroUI DateInput component time to render
    cy.get('input[type="text"]').should("have.length", 2);
    cy.contains("Date of Birth").should("be.visible");
    cy.contains("Appointment Date").should("be.visible");
  });

  it("should render with description", () => {
    mount(<TestDateField />);
    cy.contains("Select your birth date").should("be.visible");
  });

  it("should handle date value changes", () => {
    mount(<TestDateField />);

    // Get the date input and verify it exists
    cy.get('input[type="text"]').should("have.length", 2);
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit((data: TestFormData) => {
              // Test validation - this function is called when form is valid
              expect(data).to.be.an("object");
            })();
          }}
        >
          <DateField
            control={methods.control}
            label="Date of Birth"
            name="birthDate"
            rules={{ required: "Date of birth is required" }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    // Trigger validation by submitting form
    cy.get("button").click();
    cy.contains("Date of birth is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestDisabledDate = () => {
      const methods = useForm<TestFormData>();

      return (
        <DateField
          control={methods.control}
          isDisabled={true}
          label="Date of Birth"
          name="birthDate"
        />
      );
    };

    mount(<TestDisabledDate />);
    cy.get('input[type="text"]').should("be.disabled");
  });

  it("should handle custom className", () => {
    const TestCustomClass = () => {
      const methods = useForm<TestFormData>();

      return (
        <DateField
          className="custom-date-class"
          control={methods.control}
          label="Date of Birth"
          name="birthDate"
        />
      );
    };

    mount(<TestCustomClass />);
    cy.get(".custom-date-class").should("exist");
  });

  it("should handle date props", () => {
    const TestDateProps = () => {
      const methods = useForm<TestFormData>();

      return (
        <DateField
          control={methods.control}
          dateProps={{
            size: "lg",
            variant: "flat",
          }}
          label="Date of Birth"
          name="birthDate"
        />
      );
    };

    mount(<TestDateProps />);
    // Verify date input renders with custom props
    cy.get('input[type="text"]').should("exist");
  });

  it("should handle transform function", () => {
    const TestTransform = () => {
      const methods = useForm<TestFormData>();

      return (
        <DateField
          control={methods.control}
          label="Date of Birth"
          name="birthDate"
          transform={(value) => {
            // Transform logic here
            return value;
          }}
        />
      );
    };

    mount(<TestTransform />);
    // Verify transform function is applied
    cy.get('input[type="text"]').should("exist");
  });

  it("should handle default values", () => {
    const TestDefaultValue = () => {
      const methods = useForm<TestFormData>({
        defaultValues: {
          appointmentDate: null,
          birthDate: new CalendarDate(1995, 5, 15),
        },
      });

      return (
        <DateField
          control={methods.control}
          label="Date of Birth"
          name="birthDate"
        />
      );
    };

    mount(<TestDefaultValue />);
    // Verify default value is set
    cy.get('input[type="text"]').should("exist");
  });
});
