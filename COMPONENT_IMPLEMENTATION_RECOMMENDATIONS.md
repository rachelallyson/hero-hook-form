# Component Implementation Recommendations

This document provides the **best way** to implement each component using all available features in `@rachelallyson/hero-hook-form`.

---

## Overview of Available Features

### Core Components

- **`ZodForm`** - Main form component with Zod validation
- **`FormFieldHelpers`** - Helper functions for creating field configurations
- **`CustomFieldConfig`** - Full control over rendering with form access
- **`FieldArrayConfig`** - Built-in field array support
- **`ConditionalFieldConfig`** - Conditional field rendering
- **`ContentFieldConfig`** - Headers/content between fields

### Field Types Available

- `input`, `textarea`, `select`, `autocomplete`
- `checkbox`, `switch`, `radio`
- `slider`, `date`, `file`, `fontPicker`
- `custom`, `conditional`, `fieldArray`, `dynamicSection`, `content`

### Conditional Rendering Options

1. **`dependsOn` + `dependsOnValue`** - Simple value-based conditional (on any field)
2. **`condition` function** - Complex conditional logic (on any field)
3. **`ConditionalFieldConfig`** - Wrapper for conditional single fields
4. **`DynamicSectionConfig`** - Conditional groups of fields

---

## 1. TemplateSlotsEditor

### Recommended Approach: **CustomFieldConfig with useFieldArray**

**Why:**

- `FieldArrayConfig` doesn't support reordering (no `move()` function exposed)
- `FieldArrayConfig` has limited UI customization (fixed card layout)
- `CustomFieldConfig` gives full control while staying integrated with form validation

### Implementation

```tsx
import { 
  ZodForm, 
  FormFieldHelpers, 
  SelectField,
  type CustomFieldConfig 
} from "@rachelallyson/hero-hook-form";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button, Chip } from "@heroui/react";

// Schema
const slotSchema = z.object({
  id: z.string().optional(),
  order: z.number().min(1),
  slotType: z.enum(["STATIC", "DYNAMIC"]),
  staticQuestionId: z.string().optional(),
});

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "CUSTOM"]),
  department: z.string().optional(),
  slots: z.array(slotSchema).min(1, "At least one slot is required"),
});

// Refined schema for conditional validation
const refinedTemplateSchema = templateSchema.refine(
  (data) => {
    return data.slots.every((slot) => {
      if (slot.slotType === "STATIC") {
        return !!slot.staticQuestionId;
      }
      return true;
    });
  },
  {
    message: "STATIC slots must have a question selected",
    path: ["slots"],
  }
);

// TemplateSlotsEditor as CustomFieldConfig
function createSlotsEditorConfig<T extends { slots: Slot[] }>(
  questions: Question[]
): CustomFieldConfig<T> {
  return {
    type: "custom",
    name: "slots" as any,
    label: "Question Slots",
    render: ({ form, control, errors }) => {
      const { fields, append, remove, move } = useFieldArray({
        control,
        name: "slots" as any,
      });

      const watchedSlots = form.watch("slots") || [];

      return (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const slot = watchedSlots[index];
            const slotErrors = errors.slots?.[index];

            return (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Slot {index + 1}
                    </span>
                    <Chip size="sm" variant="flat">
                      {slot?.slotType || "STATIC"}
                    </Chip>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="light"
                      isDisabled={index === 0}
                      onPress={() => move(index, index - 1)}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      isDisabled={index === fields.length - 1}
                      onPress={() => move(index, index + 1)}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Slot Type Selection */}
                <SelectField
                  name={`slots.${index}.slotType` as any}
                  label="Slot Type"
                  control={control}
                  options={[
                    { label: "Static", value: "STATIC" },
                    { label: "Dynamic", value: "DYNAMIC" },
                  ]}
                />

                {/* Conditional: Question Selection (only for STATIC) */}
                {slot?.slotType === "STATIC" && (
                  <SelectField
                    name={`slots.${index}.staticQuestionId` as any}
                    label="Question"
                    control={control}
                    options={questions.map((q) => ({
                      label: q.text,
                      value: q.id,
                    }))}
                    isInvalid={!!slotErrors?.staticQuestionId}
                    errorMessage={slotErrors?.staticQuestionId?.message}
                  />
                )}

                {/* Hidden order field */}
                <input
                  type="hidden"
                  {...form.register(`slots.${index}.order` as any)}
                  value={index + 1}
                />
              </div>
            );
          })}

          <Button
            variant="bordered"
            onPress={() =>
              append({
                order: fields.length + 1,
                slotType: "STATIC" as const,
                staticQuestionId: "",
              })
            }
          >
            Add Slot
          </Button>
        </div>
      );
    },
  };
}

// Usage in form
function NewCheckInTemplateForm() {
  const questions = useQuestions(); // Your data fetching hook

  return (
    <ZodForm
      config={{
        schema: refinedTemplateSchema,
        fields: [
          FormFieldHelpers.input("name", "Template Name"),
          FormFieldHelpers.select("frequency", "Frequency", [
            { label: "Weekly", value: "WEEKLY" },
            { label: "Bi-weekly", value: "BIWEEKLY" },
            { label: "Monthly", value: "MONTHLY" },
            { label: "Custom", value: "CUSTOM" },
          ]),
          FormFieldHelpers.input("department", "Department"),
          createSlotsEditorConfig(questions),
        ],
      }}
      onSubmit={async (data) => {
        // Create template and slots
        await createTemplate(data);
      }}
    />
  );
}
```

### Alternative: Enhanced FieldArrayConfig (if reordering not needed)

If you don't need reordering, you could use `FieldArrayConfig` with a custom default value function:

```tsx
{
  type: "fieldArray",
  name: "slots",
  label: "Question Slots",
  fields: [
    FormFieldHelpers.select("slotType", "Slot Type", [
      { label: "Static", value: "STATIC" },
      { label: "Dynamic", value: "DYNAMIC" },
    ]),
    // Use dependsOn for conditional question field
    {
      ...FormFieldHelpers.select("staticQuestionId", "Question", questions),
      dependsOn: "slotType" as any,
      dependsOnValue: "STATIC",
    },
  ],
  min: 1,
  addButtonText: "Add Slot",
}
```

**Limitation:** No reordering support, fixed UI layout.

---

## 2. NewCheckInTemplateForm

### Recommended Approach: **ZodForm with CustomFieldConfig for slots**

This is straightforward - use `ZodForm` with the slots editor from above.

### Implementation

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "CUSTOM"]),
  department: z.string().optional(),
  slots: z.array(slotSchema).min(1, "At least one slot is required"),
});

function NewCheckInTemplateForm() {
  const router = useRouter();
  const questions = useQuestions();

  return (
    <ZodForm
      config={{
        schema: templateSchema,
        fields: [
          FormFieldHelpers.input("name", "Template Name"),
          FormFieldHelpers.select("frequency", "Frequency", [
            { label: "Weekly", value: "WEEKLY" },
            { label: "Bi-weekly", value: "BIWEEKLY" },
            { label: "Monthly", value: "MONTHLY" },
            { label: "Custom", value: "CUSTOM" },
          ]),
          FormFieldHelpers.input("department", "Department"),
          createSlotsEditorConfig(questions), // From above
        ],
        defaultValues: {
          slots: [],
        },
      }}
      onSubmit={async (data) => {
        // Create template
        const template = await createTemplate({
          name: data.name,
          frequency: data.frequency,
          department: data.department,
        });

        // Create slots
        await Promise.all(
          data.slots.map((slot, index) =>
            createSlot({
              templateId: template.id,
              order: index + 1,
              slotType: slot.slotType,
              staticQuestionId: slot.staticQuestionId,
            })
          )
        );

        router.push(`/templates/${template.id}`);
      }}
      title="Create Check-In Template"
    />
  );
}
```

---

## 3. EditCheckInTemplateForm

### Recommended Approach: **ZodForm with defaultValues and CustomFieldConfig**

Same pattern as create, but with `defaultValues` populated from existing template.

### Implementation

```tsx
function EditCheckInTemplateForm({ templateId }: { templateId: string }) {
  const router = useRouter();
  const { template, slots } = useTemplate(templateId);
  const questions = useQuestions();

  // Transform existing data for form
  const defaultValues = {
    name: template.name,
    frequency: template.frequency,
    department: template.department,
    slots: slots
      .sort((a, b) => a.order - b.order)
      .map((slot) => ({
        id: slot.id,
        order: slot.order,
        slotType: slot.slotType,
        staticQuestionId: slot.staticQuestionId || "",
      })),
  };

  return (
    <ZodForm
      config={{
        schema: templateSchema,
        fields: [
          FormFieldHelpers.input("name", "Template Name"),
          FormFieldHelpers.select("frequency", "Frequency", [
            { label: "Weekly", value: "WEEKLY" },
            { label: "Bi-weekly", value: "BIWEEKLY" },
            { label: "Monthly", value: "MONTHLY" },
            { label: "Custom", value: "CUSTOM" },
          ]),
          FormFieldHelpers.input("department", "Department"),
          createSlotsEditorConfig(questions),
        ],
        defaultValues,
      }}
      onSubmit={async (data) => {
        // Update template
        await updateTemplate(templateId, {
          name: data.name,
          frequency: data.frequency,
          department: data.department,
        });

        // Sync slots: delete removed, update existing, create new
        const existingSlotIds = new Set(
          slots.map((s) => s.id).filter(Boolean)
        );
        const currentSlotIds = new Set(
          data.slots.map((s) => s.id).filter(Boolean)
        );

        // Delete removed slots
        const toDelete = Array.from(existingSlotIds).filter(
          (id) => !currentSlotIds.has(id)
        );
        await Promise.all(toDelete.map((id) => deleteSlot(id)));

        // Update or create slots
        await Promise.all(
          data.slots.map((slot, index) => {
            if (slot.id && existingSlotIds.has(slot.id)) {
              // Update existing
              return updateSlot(slot.id, {
                order: index + 1,
                slotType: slot.slotType,
                staticQuestionId: slot.staticQuestionId,
              });
            } else {
              // Create new
              return createSlot({
                templateId,
                order: index + 1,
                slotType: slot.slotType,
                staticQuestionId: slot.staticQuestionId,
              });
            }
          })
        );

        router.push(`/templates/${templateId}`);
      }}
      title="Edit Check-In Template"
    />
  );
}
```

---

## 4. MessageInput (MessagingChatInput)

### Recommended Approach: **ZodForm with single input and custom submit button**

For a simple single-field form, `ZodForm` is still the best choice for consistency and validation.

### Implementation

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";
import { Button } from "@heroui/react";

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

function MessageInput({
  selectedMemberId,
  onActivityAdded,
}: {
  selectedMemberId: string | null;
  onActivityAdded: () => void;
}) {
  const { currentUser } = useAuth();

  return (
    <ZodForm
      config={{
        schema: messageSchema,
        fields: [
          {
            ...FormFieldHelpers.input("message", ""),
            inputProps: {
              placeholder: selectedMemberId
                ? "Add a note about this team member..."
                : "Select a team member to add a note",
              endContent: (
                <Button
                  type="submit"
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled={!selectedMemberId}
                  aria-label="Send message"
                >
                  <SendIcon />
                </Button>
              ),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Form will handle submit via Enter key
                }
              },
            },
          },
        ],
        defaultValues: {
          message: "",
        },
      }}
      onSubmit={async (data) => {
        if (!selectedMemberId || !currentUser?.membershipId) return;

        await createActivity({
          createdBy: { id: currentUser.membershipId },
          member: { id: selectedMemberId },
          update: data.message,
        });

        onActivityAdded();
      }}
      // Hide default submit button
      submitButtonText=""
      showResetButton={false}
    />
  );
}
```

### Alternative: Manual form with useForm (if you need more control)

If you need more control over the submit button placement or behavior:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";
import { Button } from "@heroui/react";

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

function MessageInput({ selectedMemberId, onActivityAdded }) {
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!selectedMemberId) return;

    await createActivity({
      createdBy: { id: currentUser.membershipId },
      member: { id: selectedMemberId },
      update: data.message,
    });

    form.reset();
    onActivityAdded();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <InputField
        name="message"
        control={form.control}
        inputProps={{
          placeholder: selectedMemberId
            ? "Add a note..."
            : "Select a team member",
          endContent: (
            <Button
              type="submit"
              isIconOnly
              isDisabled={!selectedMemberId || !form.formState.isValid}
            >
              <SendIcon />
            </Button>
          ),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          },
        }}
      />
    </form>
  );
}
```

**Recommendation:** Use `ZodForm` for consistency unless you have specific UI requirements that can't be met.

---

## Summary Table

| Component | Recommended Approach | Key Features Used |
|-----------|---------------------|-------------------|
| **TemplateSlotsEditor** | `CustomFieldConfig` + `useFieldArray` | Full UI control, reordering, conditional fields |
| **NewCheckInTemplateForm** | `ZodForm` + `CustomFieldConfig` | Single submission, validation, type safety |
| **EditCheckInTemplateForm** | `ZodForm` + `defaultValues` + `CustomFieldConfig` | Atomic updates, validation, existing data |
| **MessageInput** | `ZodForm` with single field | Validation, consistency, auto-reset |

---

## Key Design Patterns

### 1. CustomFieldConfig for Complex Arrays

Use when you need:

- ✅ Reordering (move up/down)
- ✅ Custom UI layout (cards, chips, custom styling)
- ✅ Complex conditional logic within array items
- ✅ Integration with form validation

### 2. FieldArrayConfig for Simple Arrays

Use when you need:

- ✅ Simple add/remove functionality
- ✅ Standard field layouts are acceptable
- ✅ No reordering required

### 3. Conditional Fields

Three options:

- **`dependsOn` + `dependsOnValue`** - Simple value-based (e.g., show field when `slotType === "STATIC"`)
- **`condition` function** - Complex logic (e.g., `(values) => values.slotType === "STATIC" && values.hasQuestion`)
- **`ConditionalFieldConfig`** - Wrapper for conditional single fields

### 4. Single-Field Forms

Even for one field, use `ZodForm` for:

- ✅ Built-in validation
- ✅ Error handling
- ✅ Form reset after submission
- ✅ Consistency with codebase

---

## Best Practices

1. **Always use ZodForm for consistency** - Even simple forms benefit from validation and error handling
2. **Use CustomFieldConfig for complex UIs** - When standard field configs don't meet your needs
3. **Leverage conditional rendering** - Use `dependsOn` for simple cases, `condition` for complex logic
4. **Type safety first** - Let TypeScript guide your field paths and schemas
5. **Reuse field configs** - Create helper functions for repeated patterns (like `createSlotsEditorConfig`)

---

## Migration Notes

If you're currently using a different approach:

- **From `useFieldArray` directly** → Keep using it, but wrap in `CustomFieldConfig` for form integration
- **From separate forms** → Combine into single `ZodForm` with `CustomFieldConfig` for complex sections
- **From manual validation** → Move to Zod schemas with `ZodForm`
- **From `useState` for simple inputs** → Use `ZodForm` for consistency and validation
