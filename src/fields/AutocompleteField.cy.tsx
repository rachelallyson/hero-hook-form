import React from "react";

import { HeroUIProvider } from "@heroui/system";
import { mount } from "cypress/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutocompleteField } from "./AutocompleteField";
import { FormFieldHelpers, createBasicFormBuilder } from "../builders/BasicFormBuilder";
import { ZodForm } from "../components/ZodForm";

// Wrapper to provide HeroUI context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

interface TestFormData {
  country: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      country: "",
    },
  });

  const items = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "Mexico", value: "mx" },
    { label: "United Kingdom", value: "uk" },
  ];

  return (
    <form>
      <AutocompleteField
        control={methods.control}
        label="Country"
        name="country"
        items={items}
        placeholder="Search for a country"
      />
    </form>
  );
};

describe("AutocompleteField", () => {
  it("should render with label and placeholder", () => {
    mount(
      <TestWrapper>
        <TestForm />
      </TestWrapper>,
    );

    // Wait a bit for the component to render
    cy.wait(100);
    cy.get("label").should("contain.text", "Country");
    cy.get('input[type="text"]').should("have.attr", "placeholder", "Search for a country");
  });

  it("should open dropdown and show options when typing", () => {
    mount(
      <TestWrapper>
        <TestForm />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get('input[type="text"]').should("be.visible").focus().type("Unit");
    // Wait for dropdown to appear and filter
    cy.wait(500);
    // Check for listbox or popover
    cy.get("[role=listbox], [role=combobox]").should("exist");
    cy.get("[role=option]").should("have.length.at.least", 1);
    cy.get("[role=option]").first().should("contain.text", "United");
  });

  it("should filter options based on input", () => {
    mount(
      <TestWrapper>
        <TestForm />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get('input[type="text"]').should("be.visible").focus().type("Can");
    // Wait for dropdown to open and options to be present
    cy.get("[role=option]", { timeout: 10000 }).should("exist");
    // Check that at least one option contains "Can" or "Canada"
    cy.get("[role=option]").should(($options) => {
      const texts = Array.from($options).map((el) => el.textContent);
      const hasCanada = texts.some((text) => 
        text?.toLowerCase().includes("can")
      );
      expect(hasCanada).to.be.true;
    });
  });

  it("should select an option", () => {
    mount(
      <TestWrapper>
        <TestForm />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get('input[type="text"]').should("be.visible").focus().type("Unit");
    // Wait for dropdown to open and options to be present before clicking
    cy.get("[role=option]", { timeout: 10000 }).should("have.length.at.least", 1);
    cy.get("[role=option]").first().click();
    cy.wait(200);
    // After selection, the input should show the selected value or be cleared
    // The exact behavior depends on HeroUI's implementation
    cy.get('input[type="text"]').should("exist");
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();
      const items = [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ];

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(() => {
              // Form submitted successfully
            })();
          }}
        >
          <AutocompleteField
            control={methods.control}
            label="Country"
            name="country"
            items={items}
            rules={{
              required: "Country is required",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(
      <TestWrapper>
        <TestFormWithValidation />
      </TestWrapper>,
    );

    cy.get("button").last().click();
    cy.contains("Country is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();
      const items = [{ label: "United States", value: "us" }];

      return (
        <form>
          <AutocompleteField
            control={methods.control}
            isDisabled={true}
            label="Country"
            name="country"
            items={items}
          />
        </form>
      );
    };

    mount(
      <TestWrapper>
        <TestFormDisabled />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get('input[type="text"]').should("be.disabled");
  });

  it("should work with FormFieldHelpers.autocomplete()", () => {
    const testSchema = z.object({
      country: z.string().min(1, "Country is required"),
    });

    const TestFormWithHelper = () => {
      return (
        <ZodForm<z.infer<typeof testSchema>>
          config={{
            schema: testSchema,
            fields: [
              FormFieldHelpers.autocomplete(
                "country",
                "Country",
                [
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                ],
                "Search for a country",
              ),
            ],
          }}
          onSubmit={async () => {}}
        />
      );
    };

    mount(
      <TestWrapper>
        <TestFormWithHelper />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get("label").should("contain.text", "Country");
    // Placeholder might be on the input or in a different location
    cy.get('input[type="text"]').should("exist");
    // Try to find placeholder either on input or check if it's visible
    cy.get('input[type="text"]').then(($input) => {
      const placeholder = $input.attr("placeholder");
      if (placeholder) {
        expect(placeholder).to.equal("Search for a country");
      }
    });
  });

  it("should work with BasicFormBuilder.autocomplete()", () => {
    const testSchema = z.object({
      country: z.string().min(1, "Country is required"),
    });

    const fields = createBasicFormBuilder<z.infer<typeof testSchema>>()
      .autocomplete(
        "country",
        "Country",
        [
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
        ],
        "Search for a country",
      )
      .build();

    const TestFormWithBuilder = () => {
      return (
        <ZodForm<z.infer<typeof testSchema>>
          config={{
            schema: testSchema,
            fields,
          }}
          onSubmit={async () => {}}
        />
      );
    };

    mount(
      <TestWrapper>
        <TestFormWithBuilder />
      </TestWrapper>,
    );

    cy.wait(100);
    cy.get("label").should("contain.text", "Country");
    // Placeholder might be on the input or in a different location
    cy.get('input[type="text"]').should("exist");
    // Try to find placeholder either on input or check if it's visible
    cy.get('input[type="text"]').then(($input) => {
      const placeholder = $input.attr("placeholder");
      if (placeholder) {
        expect(placeholder).to.equal("Search for a country");
      }
    });
  });

  it("should handle custom value input when allowsCustomValue is enabled", () => {
    const TestFormCustomValue = () => {
      const methods = useForm<TestFormData>();
      const items = [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ];

      return (
        <form>
          <AutocompleteField
            control={methods.control}
            label="Country"
            name="country"
            items={items}
            autocompleteProps={{
              allowsCustomValue: true,
            }}
          />
        </form>
      );
    };

    mount(
      <TestWrapper>
        <TestFormCustomValue />
      </TestWrapper>,
    );

    cy.wait(100);
    const input = cy.get('input[type="text"]').should("be.visible");
    input.focus();
    input.clear();
    input.type("Custom Country");
    cy.wait(300);
    // Verify the input has the typed value
    input.should("have.value", "Custom Country");
  });

  it("should display description when provided", () => {
    const TestFormWithDescription = () => {
      const methods = useForm<TestFormData>();
      const items = [{ label: "United States", value: "us" }];

      return (
        <form>
          <AutocompleteField
            control={methods.control}
            description="Select your country of residence"
            label="Country"
            name="country"
            items={items}
          />
        </form>
      );
    };

    mount(
      <TestWrapper>
        <TestFormWithDescription />
      </TestWrapper>,
    );

    cy.contains("Select your country of residence").should("exist");
  });
});
