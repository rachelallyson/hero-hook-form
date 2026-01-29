import React from "react";

import { mount } from "cypress/react";
import { z } from "zod";

import type { Path } from "react-hook-form";

import {
  createCustomFieldConfigForItem,
  createFieldArrayCustomConfig,
  ZodForm,
  type CustomFieldDef,
} from "../index";

describe("createCustomFieldConfigForItem", () => {
  it("returns date config for DATE fieldType", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "DATE",
      name: "Birth Date",
    });

    expect(config).to.deep.include({
      type: "date",
      label: "Birth Date",
      name: "customFieldValues.0.value",
    });
    expect((config as { dateProps?: { granularity?: string } }).dateProps).to.deep.include({
      granularity: "day",
    });
  });

  it("returns input config for SHORT_TEXT fieldType", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "SHORT_TEXT",
      name: "Short Text",
    });

    expect(config).to.deep.include({
      type: "input",
      label: "Short Text",
      name: "customFieldValues.0.value",
    });
  });

  it("returns textarea config for LONG_TEXT fieldType", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "LONG_TEXT",
      name: "Description",
    });

    expect(config).to.deep.include({
      type: "textarea",
      label: "Description",
      name: "customFieldValues.0.value",
    });
  });

  it("returns number input config for NUMBER fieldType", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "NUMBER",
      name: "Age",
    });

    expect(config).to.deep.include({
      type: "input",
      label: "Age",
      name: "customFieldValues.0.value",
    });
    expect((config as { inputProps?: { type?: string } }).inputProps).to.deep.include({
      type: "number",
    });
  });

  it("returns select config for DROPDOWN with string options", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "DROPDOWN",
      name: "Choice",
      options: "Option A\nOption B\nOption C",
    });

    expect(config).to.deep.include({
      type: "select",
      label: "Choice",
      name: "customFieldValues.0.value",
    });
    expect(
      (config as { options?: { label: string; value: string }[] }).options,
    ).to.deep.equal([
      { label: "Option A", value: "Option A" },
      { label: "Option B", value: "Option B" },
      { label: "Option C", value: "Option C" },
    ]);
  });

  it("returns select config for DROPDOWN with array options", () => {
    const config = createCustomFieldConfigForItem("customFieldValues.0.value", {
      fieldType: "DROPDOWN",
      name: "Choice",
      options: [
        { label: "One", value: "1" },
        { label: "Two", value: "2" },
      ],
    });

    expect(config).to.deep.include({
      type: "select",
      label: "Choice",
      name: "customFieldValues.0.value",
    });
    expect(
      (config as { options?: { label: string; value: string }[] }).options,
    ).to.deep.equal([
      { label: "One", value: "1" },
      { label: "Two", value: "2" },
    ]);
  });
});

describe("createFieldArrayCustomConfig with getItemFieldConfig", () => {
  const customFieldValuesSchema = z.object({
    customFieldValues: z.array(
      z.object({
        customFieldId: z.string(),
        id: z.string().optional(),
        value: z.union([z.string(), z.number()]).optional(),
      }),
    ),
  });

  type CustomFieldValuesFormData = z.infer<typeof customFieldValuesSchema>;

  const fieldDefs: (CustomFieldDef & { id: string })[] = [
    { id: "f1", fieldType: "SHORT_TEXT", name: "Short Text Field" },
    {
      id: "f2",
      fieldType: "DROPDOWN",
      name: "Choice",
      options: "Alpha\nBeta\nGamma",
    },
  ];

  it("throws when neither renderItem nor getItemFieldConfig is provided", () => {
    const invalidOptions = {
      name: "customFieldValues" as const,
      defaultItem: () => ({ customFieldId: "", value: "" }),
    };

    expect(() =>
      createFieldArrayCustomConfig<CustomFieldValuesFormData>(
        invalidOptions as any,
      ),
    ).to.throw("createFieldArrayCustomConfig: provide either getItemFieldConfig or renderItem");
  });

  it("renders one field per array item via getItemFieldConfig and createCustomFieldConfigForItem", () => {
    const onSubmit = cy.stub().callsFake(async (data: CustomFieldValuesFormData) => {
      expect(data.customFieldValues).to.have.length(2);
      expect(data.customFieldValues[0]).to.deep.include({
        customFieldId: "f1",
        value: "typed short",
      });
      expect(data.customFieldValues[1]).to.deep.include({
        customFieldId: "f2",
        value: "Beta",
      });
    });

    mount(
      <ZodForm<CustomFieldValuesFormData>
        config={{
          schema: customFieldValuesSchema,
          defaultValues: {
            customFieldValues: [
              { customFieldId: "f1", value: "" },
              { customFieldId: "f2", value: "" },
            ],
          },
          fields: [
            createFieldArrayCustomConfig<CustomFieldValuesFormData>({
              label: "Custom Fields",
              name: "customFieldValues",
              renderAddButton: () => null,
              getItemFieldConfig: ({ field, index }) => {
                const def = fieldDefs.find((f) => f.id === field.customFieldId);
                if (!def) return null;
                const { id: _id, ...rest } = def;

                return createCustomFieldConfigForItem(
                  `customFieldValues.${index}.value` as Path<CustomFieldValuesFormData>,
                  rest as CustomFieldDef,
                );
              },
              defaultItem: () => ({ customFieldId: "f1", value: "" }),
            }),
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    cy.get("form").should("exist");

    // Two custom fields: Short Text and Choice (labels may be label or span in HeroUI)
    cy.contains("Short Text Field").should("exist");
    cy.contains("Choice").should("exist");

    // One text input (SHORT_TEXT); select trigger is a button (not type=submit)
    cy.get('input[type="text"]').should("exist");
    cy.get("form").find('button[type="button"]').should("exist");

    // Fill short text (input near Short Text Field label)
    cy.contains("Short Text Field").parent().find("input").type("typed short");

    // Open select and choose Beta (trigger opens listbox; click the option)
    cy.get("form").find('button[type="button"]').click();
    cy.get('[role="listbox"]').contains("Beta").click();

    // Submit and wait for async handler
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.wrap(null).then(() => {
      expect(onSubmit).to.have.been.calledOnce;
    });
  });

  it("renders DATE and NUMBER custom fields via getItemFieldConfig", () => {
    const schema = z.object({
      customFieldValues: z.array(
        z.object({
          customFieldId: z.string(),
          value: z.union([z.string(), z.number()]).optional(),
        }),
      ),
    });

    type FormData = z.infer<typeof schema>;

    const defs: (CustomFieldDef & { id: string })[] = [
      { id: "d1", fieldType: "DATE", name: "Joined On" },
      { id: "n1", fieldType: "NUMBER", name: "Count" },
    ];

    mount(
      <ZodForm<FormData>
        config={{
          schema,
          defaultValues: {
            customFieldValues: [
              { customFieldId: "d1", value: undefined },
              { customFieldId: "n1", value: undefined },
            ],
          },
          fields: [
            createFieldArrayCustomConfig<FormData>({
              label: "Custom",
              name: "customFieldValues",
              renderAddButton: () => null,
              getItemFieldConfig: ({ field, index }) => {
                const def = defs.find((f) => f.id === field.customFieldId);
                if (!def) return null;
                const { id: _id, ...rest } = def;

                return createCustomFieldConfigForItem(
                  `customFieldValues.${index}.value` as Path<FormData>,
                  rest as CustomFieldDef,
                );
              },
              defaultItem: () => ({ customFieldId: "d1", value: undefined }),
            }),
          ],
        }}
        onSubmit={cy.stub().resolves()}
      />,
    );

    cy.contains("Joined On").should("exist");
    cy.contains("Count").should("exist");
    cy.get('input[type="number"]').should("exist");
  });
});
