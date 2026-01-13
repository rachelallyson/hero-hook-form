# Improvement Proposals

Based on the component implementation recommendations, here are features we should build or expose to make these patterns easier.

---

## 1. Enhanced FieldArrayConfig with Reordering ⭐ **HIGH PRIORITY**

### Problem

`FieldArrayConfig` doesn't support reordering, forcing users to use `CustomFieldConfig` with manual `useFieldArray` setup for a common use case.

### Solution

Add reordering support to `FieldArrayConfig`:

```tsx
interface FieldArrayConfig<TFieldValues extends FieldValues> {
  // ... existing props
  enableReordering?: boolean; // Default: false
  reorderButtonText?: { up?: string; down?: string };
  renderItem?: (props: {
    index: number;
    field: FieldArrayWithId;
    fields: FieldArrayWithId[];
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    children: React.ReactNode; // The rendered fields
  }) => React.ReactNode;
}
```

### Benefits

- Eliminates need for `CustomFieldConfig` in most array cases
- Consistent API with other field configs
- Built-in reordering UI

### Implementation

Update `FieldArrayField.tsx` to:

1. Use `move()` from `useFieldArray` when `enableReordering` is true
2. Add up/down buttons when enabled
3. Support custom `renderItem` for full control

---

## 2. Helper for CustomFieldConfig with useFieldArray ⭐ **HIGH PRIORITY**

### Problem

Creating `CustomFieldConfig` with `useFieldArray` is verbose and repetitive.

### Solution

Create a helper function:

```tsx
function createFieldArrayCustomConfig<T extends FieldValues>(
  name: Path<T>,
  options: {
    label?: string;
    renderItem: (props: {
      index: number;
      field: FieldArrayWithId;
      fields: FieldArrayWithId[];
      form: UseFormReturn<T>;
      control: Control<T>;
      errors: FieldErrors<T>;
      canMoveUp: boolean;
      canMoveDown: boolean;
      onMoveUp: () => void;
      onMoveDown: () => void;
      onRemove: () => void;
    }) => React.ReactNode;
    renderAddButton?: (props: {
      onAdd: () => void;
      canAdd: boolean;
    }) => React.ReactNode;
    defaultItem?: () => any;
    min?: number;
    max?: number;
    enableReordering?: boolean;
  }
): CustomFieldConfig<T>
```

### Usage

```tsx
const slotsConfig = createFieldArrayCustomConfig("slots", {
  label: "Question Slots",
  enableReordering: true,
  renderItem: ({ index, field, form, control, onMoveUp, onMoveDown, onRemove }) => (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between">
        <span>Slot {index + 1}</span>
        <div className="flex gap-2">
          <Button onPress={onMoveUp}>↑</Button>
          <Button onPress={onMoveDown}>↓</Button>
          <Button onPress={onRemove}>Remove</Button>
        </div>
      </div>
      <SelectField
        name={`slots.${index}.slotType`}
        control={control}
        // ...
      />
    </div>
  ),
});
```

### Benefits

- Reduces boilerplate
- Type-safe
- Consistent pattern

---

## 3. Array Sync Utilities ⭐ **MEDIUM PRIORITY**

### Problem

Edit forms need to compare existing vs new arrays to determine what to delete/update/create. This logic is repetitive.

### Solution

Create utility functions:

```tsx
interface ArraySyncOptions<TItem> {
  existing: TItem[];
  current: TItem[];
  getId: (item: TItem) => string | number | undefined;
}

interface ArraySyncResult<TItem> {
  toDelete: TItem[];
  toUpdate: Array<{ existing: TItem; current: TItem }>;
  toCreate: TItem[];
}

function syncArrays<TItem>(
  options: ArraySyncOptions<TItem>
): ArraySyncResult<TItem>
```

### Usage

```tsx
const { toDelete, toUpdate, toCreate } = syncArrays({
  existing: slots,
  current: data.slots,
  getId: (slot) => slot.id,
});

// Delete removed slots
await Promise.all(toDelete.map(slot => deleteSlot(slot.id)));

// Update existing slots
await Promise.all(
  toUpdate.map(({ existing, current }) =>
    updateSlot(existing.id, current)
  )
);

// Create new slots
await Promise.all(
  toCreate.map(slot => createSlot(slot))
);
```

### Benefits

- Eliminates manual comparison logic
- Type-safe
- Handles edge cases

---

## 4. Enhanced FieldArrayConfig with Custom Item Rendering ⭐ **MEDIUM PRIORITY**

### Problem

`FieldArrayConfig` has a fixed layout. Users can't customize the item container (cards, chips, etc.).

### Solution

Add `renderItem` prop to `FieldArrayConfig`:

```tsx
interface FieldArrayConfig<TFieldValues extends FieldValues> {
  // ... existing props
  renderItem?: (props: {
    index: number;
    field: FieldArrayWithId;
    fields: FieldArrayWithId[];
    children: React.ReactNode; // The rendered field configs
    onRemove: () => void;
    canRemove: boolean;
  }) => React.ReactNode;
}
```

### Usage

```tsx
{
  type: "fieldArray",
  name: "slots",
  label: "Question Slots",
  fields: [
    FormFieldHelpers.select("slotType", "Slot Type", options),
    FormFieldHelpers.select("staticQuestionId", "Question", questions),
  ],
  renderItem: ({ index, children, onRemove }) => (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Chip>Slot {index + 1}</Chip>
        <Button onPress={onRemove}>Remove</Button>
      </div>
      {children}
    </Card>
  ),
}
```

### Benefits

- Custom UI without `CustomFieldConfig`
- Still uses built-in field array management
- More flexible than current implementation

---

## 5. Helper for Single-Field Forms ⭐ **LOW PRIORITY**

### Problem

`ZodForm` works for single fields but feels heavy for simple cases like `MessageInput`.

### Solution

Create a simpler API:

```tsx
function SimpleForm<T extends FieldValues>({
  schema,
  field,
  onSubmit,
  submitButton,
  ...props
}: {
  schema: ZodSchema<T>;
  field: ZodFormFieldConfig<T>;
  onSubmit: (data: T) => Promise<void> | void;
  submitButton?: React.ReactNode;
}) => React.ReactNode
```

### Usage

```tsx
<SimpleForm
  schema={messageSchema}
  field={FormFieldHelpers.input("message", "", {
    placeholder: "Add a note...",
    endContent: <Button type="submit">Send</Button>,
  })}
  onSubmit={handleSubmit}
/>
```

### Benefits

- Simpler API for single-field forms
- Less boilerplate
- Still type-safe

**Note:** This might be overkill since `ZodForm` already works well.

---

## 6. Conditional Field Array Items ⭐ **MEDIUM PRIORITY**

### Problem

Within array items, fields often need to be conditional (e.g., `staticQuestionId` only when `slotType === "STATIC"`). Currently requires manual conditional rendering in `CustomFieldConfig`.

### Solution

Support `dependsOn` with array paths:

```tsx
{
  type: "fieldArray",
  name: "slots",
  fields: [
    FormFieldHelpers.select("slotType", "Slot Type", options),
    {
      ...FormFieldHelpers.select("staticQuestionId", "Question", questions),
      // Support array-relative paths
      dependsOn: "slotType", // Relative to array item
      dependsOnValue: "STATIC",
    },
  ],
}
```

### Benefits

- No need for manual conditional rendering
- Works with `FieldArrayConfig`
- Consistent with other conditional fields

---

## 7. Field Array Item Default Values Helper ⭐ **LOW PRIORITY**

### Problem

`FieldArrayField` tries to infer default values from field configs, but it's limited and doesn't handle complex cases.

### Solution

Add `defaultItem` function to `FieldArrayConfig`:

```tsx
interface FieldArrayConfig<TFieldValues extends FieldValues> {
  // ... existing props
  defaultItem?: () => any; // Function that returns default item
}
```

### Usage

```tsx
{
  type: "fieldArray",
  name: "slots",
  defaultItem: () => ({
    order: 0, // Will be set by form
    slotType: "STATIC",
    staticQuestionId: "",
  }),
  fields: [...],
}
```

### Benefits

- More control over default values
- Handles complex cases
- Type-safe

---

## Priority Summary

### Must Have (High Priority)

1. ✅ **Enhanced FieldArrayConfig with Reordering** - Solves the biggest pain point
2. ✅ **Helper for CustomFieldConfig with useFieldArray** - Reduces boilerplate significantly

### Should Have (Medium Priority)

1. ✅ **Array Sync Utilities** - Very useful for edit forms
2. ✅ **Enhanced FieldArrayConfig with Custom Item Rendering** - More flexibility
3. ✅ **Conditional Field Array Items** - Common pattern

### Nice to Have (Low Priority)

1. ✅ **Helper for Single-Field Forms** - Minor convenience
2. ✅ **Field Array Item Default Values Helper** - Edge case improvement

---

## Implementation Order

1. **Enhanced FieldArrayConfig with Reordering** - Biggest impact, enables most use cases
2. **Helper for CustomFieldConfig with useFieldArray** - Reduces boilerplate for remaining cases
3. **Array Sync Utilities** - Useful for edit forms
4. **Enhanced FieldArrayConfig with Custom Item Rendering** - More flexibility
5. **Conditional Field Array Items** - Common pattern
6. **Field Array Item Default Values Helper** - Edge case
7. **Helper for Single-Field Forms** - Minor convenience

---

## Breaking Changes Consideration

- **Enhanced FieldArrayConfig**: Additive changes only, no breaking changes
- **Helper functions**: New exports, no breaking changes
- **Array Sync Utilities**: New exports, no breaking changes

All proposals are backward compatible.
