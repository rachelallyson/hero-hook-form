import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { InputField } from "../fields/InputField";

import { HeroHookFormProvider } from "./ConfigProvider";

interface TestFormData {
  name: string;
  email: string;
}

function TestComponent() {
  const methods = useForm<TestFormData>();

  return (
    <div>
      <InputField control={methods.control} label="Name" name="name" />
      <InputField control={methods.control} label="Email" name="email" />
    </div>
  );
}

function TestWithProvider({
  defaults,
}: {
  defaults?: Record<string, unknown>;
}) {
  return (
    <HeroHookFormProvider defaults={defaults}>
      <TestComponent />
    </HeroHookFormProvider>
  );
}

describe("HeroHookFormProvider", () => {
  it("should render children without defaults", () => {
    mount(<TestWithProvider />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should apply common defaults to fields", () => {
    const defaults = {
      common: {
        color: "primary" as const,
        labelPlacement: "outside" as const,
        radius: "sm" as const,
        size: "md" as const,
        variant: "bordered" as const,
      },
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should apply component-specific defaults", () => {
    const defaults = {
      input: {
        color: "secondary" as const,
        size: "lg" as const,
        variant: "underlined" as const,
      },
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should override common defaults with component-specific defaults", () => {
    const defaults = {
      common: {
        color: "primary" as const,
        size: "md" as const,
        variant: "bordered" as const,
      },
      input: {
        color: "secondary" as const,
        variant: "underlined" as const,
      },
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should handle nested providers", () => {
    const outerDefaults = {
      common: {
        color: "primary" as const,
        size: "md" as const,
      },
    };

    const innerDefaults = {
      common: {
        color: "secondary" as const,
        size: "lg" as const,
      },
    };

    mount(
      <HeroHookFormProvider defaults={outerDefaults}>
        <div>
          <TestComponent />
          <HeroHookFormProvider defaults={innerDefaults}>
            <TestComponent />
          </HeroHookFormProvider>
        </div>
      </HeroHookFormProvider>,
    );

    cy.get("label").should("have.length", 4); // 2 components × 2 fields each
  });

  it("should handle empty defaults object", () => {
    mount(<TestWithProvider defaults={{}} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should handle undefined defaults", () => {
    mount(<TestWithProvider defaults={undefined} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should provide defaults to useHeroHookFormDefaults hook", () => {
    const defaults = {
      checkbox: {
        color: "warning" as const,
      },
      common: {
        color: "success" as const,
        size: "sm" as const,
      },
      input: {
        variant: "flat" as const,
      },
      radioGroup: {
        color: "danger" as const,
      },
      select: {
        variant: "faded" as const,
      },
      submitButton: {
        color: "secondary" as const,
      },
      switch: {
        color: "primary" as const,
      },
      textarea: {
        variant: "bordered" as const,
      },
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should handle partial defaults", () => {
    const defaults = {
      input: {
        variant: "underlined" as const,
      },
      // Missing other component defaults
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should handle common defaults only", () => {
    const defaults = {
      common: {
        color: "primary" as const,
        labelPlacement: "outside" as const,
        radius: "sm" as const,
        size: "md" as const,
        variant: "bordered" as const,
      },
      // No component-specific defaults
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });

  it("should handle component defaults only", () => {
    const defaults = {
      // No common defaults
      input: {
        color: "secondary" as const,
        variant: "underlined" as const,
      },
      textarea: {
        variant: "bordered" as const,
      },
    };

    mount(<TestWithProvider defaults={defaults} />);
    cy.get("label").contains("Name").should("be.visible");
    cy.get("label").contains("Email").should("be.visible");
  });
});
