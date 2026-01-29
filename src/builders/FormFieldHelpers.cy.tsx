import React from "react";
import { mount } from "cypress/react";
import { z } from "zod";
import { HeroUIProvider } from "@heroui/system";
import { ZodForm, FormFieldHelpers } from "../index";

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

interface TestFormData {
  name: string;
  email: string;
  message: string;
  country: string;
  gender: string;
  rating: number;
  avatar: FileList | null;
  font: string;
  newsletter: boolean;
  notifications: boolean;
  terms: boolean;
}

describe("FormFieldHelpers - New Helpers", () => {
  describe("radio()", () => {
    const schema = z.object({
      gender: z.string(),
    });

    it("should create radio field config", () => {
      const options = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ];
      const config = FormFieldHelpers.radio("gender", "Gender", options);

      expect(config).to.deep.include({
        type: "radio",
        name: "gender",
        label: "Gender",
        radioOptions: options,
      });
    });

    it("should create radio field config with radioProps", () => {
      const options = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ];
      const config = FormFieldHelpers.radio("gender", "Gender", options, {
        orientation: "horizontal",
      });

      expect(config).to.deep.include({
        type: "radio",
        name: "gender",
        label: "Gender",
        radioOptions: options,
        radioProps: { orientation: "horizontal" },
      });
    });

    it("should render radio field in form", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.radio("gender", "Gender", [
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      // RadioGroupField may render label differently, check for options instead
      cy.contains("Male").should("exist");
      cy.contains("Female").should("exist");
    });
  });

  describe("slider()", () => {
    const schema = z.object({
      rating: z.number(),
    });

    it("should create slider field config", () => {
      const config = FormFieldHelpers.slider("rating", "Rating");

      expect(config).to.deep.include({
        type: "slider",
        name: "rating",
        label: "Rating",
      });
    });

    it("should create slider field config with sliderProps", () => {
      const config = FormFieldHelpers.slider("rating", "Rating", {
        minValue: 1,
        maxValue: 5,
        step: 1,
      });

      expect(config).to.deep.include({
        type: "slider",
        name: "rating",
        label: "Rating",
      });
      expect(config.sliderProps).to.deep.include({
        minValue: 1,
        maxValue: 5,
        step: 1,
      });
    });

    it("should render slider field in form", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [FormFieldHelpers.slider("rating", "Rating")],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Rating").should("exist");
    });
  });

  describe("file()", () => {
    const schema = z.object({
      avatar: z.instanceof(FileList).nullable(),
    });

    it("should create file field config", () => {
      const config = FormFieldHelpers.file("avatar", "Profile Picture");

      expect(config).to.deep.include({
        type: "file",
        name: "avatar",
        label: "Profile Picture",
      });
    });

    it("should create file field config with options", () => {
      const config = FormFieldHelpers.file("avatar", "Profile Picture", {
        accept: "image/*",
        multiple: false,
      });

      expect(config).to.deep.include({
        type: "file",
        name: "avatar",
        label: "Profile Picture",
        accept: "image/*",
        multiple: false,
      });
    });

    it("should create file field config with fileProps", () => {
      const config = FormFieldHelpers.file("avatar", "Profile Picture", {
        accept: "image/*",
        fileProps: { variant: "bordered" },
      });

      expect(config).to.deep.include({
        type: "file",
        name: "avatar",
        label: "Profile Picture",
        accept: "image/*",
      });
      expect(config.fileProps).to.deep.include({ variant: "bordered" });
    });

    it("should render file field in form", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.file("avatar", "Profile Picture", {
                  accept: "image/*",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Profile Picture").should("exist");
      cy.get('input[type="file"]').should("exist");
    });
  });

  describe("fontPicker()", () => {
    const schema = z.object({
      font: z.string(),
    });

    it("should create fontPicker field config", () => {
      const config = FormFieldHelpers.fontPicker("font", "Choose Font");

      expect(config).to.deep.include({
        type: "fontPicker",
        name: "font",
        label: "Choose Font",
      });
    });

    it("should create fontPicker field config with fontPickerProps", () => {
      const config = FormFieldHelpers.fontPicker("font", "Choose Font", {
        showFontPreview: true,
        loadAllVariants: false,
      });

      expect(config).to.deep.include({
        type: "fontPicker",
        name: "font",
        label: "Choose Font",
        fontPickerProps: {
          showFontPreview: true,
          loadAllVariants: false,
        },
      });
    });
  });
});

describe("FormFieldHelpers - Prop Support", () => {
  describe("input() with inputProps", () => {
    const schema = z.object({
      email: z.string().email(),
    });

    it("should support inputProps with placeholder", () => {
      const config = FormFieldHelpers.input(
        "email",
        "Email",
        "email",
        {
          placeholder: "Enter your email",
        },
      );

      expect(config.inputProps).to.deep.include({
        type: "email",
        placeholder: "Enter your email",
      });
    });

    it("should support inputProps with classNames", () => {
      const config = FormFieldHelpers.input("email", "Email", "email", {
        classNames: { input: "custom-input" },
      });

      expect(config.inputProps?.classNames).to.deep.equal({
        input: "custom-input",
      });
    });

    it("should render input with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.input("email", "Email", "email", {
                  placeholder: "Enter your email",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.get('input[type="email"]').should(
        "have.attr",
        "placeholder",
        "Enter your email",
      );
    });
  });

  describe("textarea() with textareaProps", () => {
    const schema = z.object({
      message: z.string(),
    });

    it("should support textareaProps with placeholder", () => {
      const config = FormFieldHelpers.textarea(
        "message",
        "Message",
        "Enter message",
        {
          minRows: 3,
        },
      );

      expect(config.textareaProps).to.deep.include({
        placeholder: "Enter message",
        minRows: 3,
      });
    });

    it("should render textarea with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.textarea("message", "Message", "Enter message", {
                  minRows: 3,
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.get("textarea").should("have.attr", "placeholder", "Enter message");
    });
  });

  describe("select() with selectProps", () => {
    const schema = z.object({
      country: z.string(),
    });

    const options = [
      { label: "US", value: "us" },
      { label: "CA", value: "ca" },
    ];

    it("should support selectProps", () => {
      const config = FormFieldHelpers.select("country", "Country", options, {
        placeholder: "Select a country",
      });

      expect(config.selectProps).to.deep.include({
        placeholder: "Select a country",
      });
    });

    it("should render select with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.select("country", "Country", options, {
                  placeholder: "Select a country",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Country").should("exist");
    });
  });

  describe("checkbox() with checkboxProps", () => {
    const schema = z.object({
      newsletter: z.boolean(),
    });

    it("should support checkboxProps", () => {
      const config = FormFieldHelpers.checkbox("newsletter", "Newsletter", {
        color: "primary",
        size: "lg",
      });

      expect(config.checkboxProps).to.deep.include({
        color: "primary",
        size: "lg",
      });
    });

    it("should render checkbox with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.checkbox("newsletter", "Newsletter", {
                  color: "primary",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Newsletter").should("exist");
    });
  });

  describe("switch() with switchProps", () => {
    const schema = z.object({
      notifications: z.boolean(),
    });

    it("should support switchProps", () => {
      const config = FormFieldHelpers.switch(
        "notifications",
        "Notifications",
        "Enable notifications",
        {
          color: "primary",
          size: "lg",
        },
      );

      expect(config.switchProps).to.deep.include({
        color: "primary",
        size: "lg",
      });
      expect(config.description).to.equal("Enable notifications");
    });

    it("should render switch with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.switch("notifications", "Notifications", undefined, {
                  color: "primary",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Notifications").should("exist");
    });
  });

  describe("autocomplete() with autocompleteProps", () => {
    const schema = z.object({
      country: z.string(),
    });

    const items = [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
    ];

    it("should support autocompleteProps", () => {
      const config = FormFieldHelpers.autocomplete(
        "country",
        "Country",
        items,
        "Search countries",
        {
          allowsCustomValue: true,
        },
      );

      expect(config.autocompleteProps).to.deep.include({
        placeholder: "Search countries",
        allowsCustomValue: true,
      });
    });

    it("should render autocomplete with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.autocomplete("country", "Country", items, "Search", {
                  allowsCustomValue: true,
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Country").should("exist");
    });

    it("should support dynamic options via getOptions getter", () => {
      const getOptions = () => items;
      const config = FormFieldHelpers.autocomplete(
        "country",
        "Country",
        getOptions,
        "Search countries",
      );

      expect(config.getOptions).to.equal(getOptions);
      expect(config.options).to.be.undefined;
    });

    it("should render autocomplete with getOptions (dynamic items)", () => {
      const dynamicItems = [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ];
      const getOptions = () => dynamicItems;

      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.autocomplete("country", "Country", getOptions, "Search"),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      cy.contains("label", "Country").should("exist");
      cy.get("input").first().click();
      cy.contains("United States").should("exist");
      cy.contains("Canada").should("exist");
    });
  });

  describe("date() with dateProps", () => {
    const schema = z.object({
      birthDate: z.any(),
    });

    it("should support dateProps", () => {
      const config = FormFieldHelpers.date("birthDate", "Birth Date", {
        placeholder: "Select date",
      });

      expect(config.dateProps).to.deep.include({
        placeholder: "Select date",
      });
    });

    it("should render date field with custom props", () => {
      mount(
        <TestWrapper>
          <ZodForm
            config={{
              schema,
              fields: [
                FormFieldHelpers.date("birthDate", "Birth Date", {
                  placeholder: "Select date",
                }),
              ],
              onSubmit: () => {},
            }}
          />
        </TestWrapper>,
      );

      // DateField renders as text input, check for input existence
      cy.get('input[type="text"]').should("exist");
    });
  });
});
