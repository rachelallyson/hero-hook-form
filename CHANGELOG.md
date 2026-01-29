# Changelog

All notable changes to this project will be documented in this file.

## [2.12.0] - 2026-01-28

### Added

- **Custom option layout for autocomplete (renderItem)** – `FormFieldHelpers.autocomplete()` and the builder chain accept an optional 6th param `options?: { renderItem?: (item) => ReactNode }` so each option can show custom content (e.g. name + email + phone). Config supports `renderItem`; `FormField`, `ServerActionForm`, and `AdvancedFormBuilder` pass it through; `AutocompleteField` wraps custom children in `AutocompleteItem` so HeroUI receives valid listbox items. Use with static options or with `getOptions` for dynamic items + custom layout.
- **StringFieldConfig.renderItem** – Optional `renderItem?: (item: { label: string; value: string | number }) => ReactNode` for autocomplete fields.
- **Component tests** – Autocomplete: `renderItem` config and render (static and getOptions + renderItem).

### Fixed

- **AutocompleteField custom children** – Custom `children` (renderItem) are now wrapped in `AutocompleteItem` before passing to HeroUI Autocomplete so the listbox receives valid items and the form renders correctly.

## [2.11.0] - 2026-01-28

### Added

- **Dynamic options for autocomplete** – `FormFieldHelpers.autocomplete()` and the builder chain now accept either a static options array or a getter function `() => options`. Use a getter for API-driven autocomplete (e.g. PCO Person, search-as-you-type): the getter is called each render so items stay in sync with state. Config supports `getOptions`; `FormField`, `ServerActionForm`, and `AdvancedFormBuilder` resolve items from `getOptions()` when present, else `options`. No need for `FormFieldHelpers.custom` when you only need dynamic items.

### Changed

- **FormFieldHelpers.autocomplete** – Third parameter can be `options[]` or `() => options[]`; JSDoc documents dynamic usage with `onInputChange`.
- **StringFieldConfig** – Added optional `getOptions?: () => { label: string; value: string | number }[]` for autocomplete fields.
- **AutocompleteField JSDoc** – Notes dynamic options via getter + `onInputChange`.

## [2.10.0] - 2026-01-28

### Added

- **Shared passthrough prop types** – Centralized `*PassthroughProps` types in `types.ts` (e.g. `InputPassthroughProps`, `AutocompletePassthroughProps`, `CheckboxGroupPassthroughProps`) so field and builder configs use a single definition instead of inline `Omit<ComponentProps<...>>`.
- **`src/utils/fieldHandlers.ts`** – New helpers for field components:
  - `createBlurHandler`, `createValueChangeHandler`, `createSelectionChangeHandler` – Wrap user and form handlers so both run.
  - `extractHandlers` – Pull handler keys out of props and return cleaned `restProps`.
  - `mergeLabelAndDisabled` / `mergeLabelAndDisabledFromRest` – Merge `label` and `isDisabled` from passthrough props with field-level values so `*Props` can override per instance.
  - Per-field helpers: `createFieldHandlers`, `createDateFieldHandlers`, `createSliderFieldHandlers`, `createSelectFieldHandlers`, `createFileFieldHandlers`, `createAutocompleteFieldHandlers`, `createFontPickerFieldHandlers` – Each returns merged rest props plus wrapped handlers for that field type.
- **CheckboxGroupPassthroughProps** – Dedicated type for checkbox group passthrough (`Omit<CheckboxPassthroughProps, "value">`) so the “no value per checkbox” shape is defined once and reused in types, fields, and builders.
- **AutocompleteField: `defaultItems` support** – `autocompleteProps` can include `defaultItems?: Iterable<AutocompleteOption<TValue>>`; field passes it through with correct typing (passthrough type omits `defaultItems` to avoid `Iterable<object>` conflict).

### Changed

- **Field components** – All field components (Input, Textarea, Select, Autocomplete, Checkbox, CheckboxGroup, Switch, RadioGroup, Slider, Date, File, FontPicker) now use the shared passthrough types and handler helpers: they call the appropriate `create*FieldHandlers` (or `createFieldHandlers`), merge label/disabled from rest, and spread the result onto the HeroUI component instead of manually wiring `onBlur` / `onValueChange` / `onSelectionChange` and label/disabled.
- **BasicFormBuilder (FormFieldHelpers)** – Replaced all inline `Omit<ComponentProps<typeof X>, …>` and local `InputPropsType` with imports of the shared passthrough types from `types.ts`; removed `#ui` component imports used only for those types.
- **AdvancedFormBuilder** – Removed `isDisabled` from the object passed into `radioProps` so it is not duplicated there (handled via field level / passthrough).
- **Example Cypress config** – Enabled `experimentalMemoryManagement: true` and `numTestsKeptInMemory: 5` for the example app.

### Fixed

- **ContentField not rendering title/description-only configs** – `FormField` previously rendered `ContentField` only when `render` or `content` was present; it now also renders when `title` or `description` is present, so configs with only a title and/or description display correctly.
- **Field array tests: “Add Item” did nothing** – `FieldArrayField` only appends when `defaultItem` is provided. ZodForm and FieldArrayField Cypress specs now include `defaultItem: () => ({ name: "", email: "" })` in the field array config so add/remove, max limit, and fill/validate tests pass.
- **Autocomplete `defaultItems` type error** – Resolved `Iterable<object>` vs `Iterable<AutocompleteOption<TValue>>` mismatch by omitting `defaultItems` from `AutocompletePassthroughProps` and typing it on the field as `autocompleteProps?: AutocompletePassthroughProps & { defaultItems?: Iterable<AutocompleteOption<TValue>> }`.

## [2.9.2] - 2026-01-28

### Added

- **Date field: Date and ISO string default values** – You can pass a normal JavaScript `Date` or an ISO date string (e.g. `"2025-03-20"`) in `defaultValues` for date fields; the library converts them to `CalendarDate` for HeroUI DateInput.
- **Shared date coercion** – New `toCalendarDateValue()` in `utils/dateCoercion.ts`; used by `DateField` and `ServerActionForm` so date inputs always receive a valid `CalendarDate | null` and no longer throw "Invalid granularity day" for raw `Date` values.
- **ConfigProvider: DateInput common defaults** – Date inputs now receive the same `common` defaults (variant, size, radius, labelPlacement) as Input, Textarea, and Select when using `HeroHookFormProvider` with `defaults.common`.
- **useZodForm** – Merges field-level `defaultValue` from field configs into form `defaultValues`; date values in `config.defaultValues` are converted to `CalendarDate` for date fields.
- **Docs: Date Input Demo** – Demo page showing Date vs ISO string defaults, shared styles via HeroHookFormProvider, and ZodForm with date defaults.

### Fixed

- **Date input default value** – Default values for date fields now work when set via `config.defaultValues`; Date/string values are converted to `CalendarDate`.
- **Date input styling** – DateInput now receives `common` styling from ConfigProvider so it matches other inputs when using `HeroHookFormProvider`.
- **"Invalid granularity day" error** – DateField and ServerActionForm coerce Date/string to CalendarDate before passing to HeroUI DateInput, fixing the console error when defaultValues used raw `Date` or the server wasn’t restarted after package changes.
- **useZodForm config mutation** – Resolver is no longer assigned onto the caller’s config object; a new options object is built instead.
- **Lint** – Removed unused `shouldRenderConditionalField` (FormField), fixed unused catch binding and type params (fieldArrayMemory).

## [2.9.1] - 2026-01-28

### Fixed

- **Cypress Testing: fillInputByLabel clearing behavior**: Fixed issue where `fillInputByLabel` may not properly clear number inputs with default values
  - Refactored to use a single chain ensuring clear operation completes before typing
  - Ensures reliable clearing of all input types, especially number inputs with default values
  - Clearing is now explicitly documented as the default behavior

## [2.9.0] - 2026-01-22

### Added

- **Documentation: Memory-Safe Forms Guide**: Comprehensive guide for preventing Cypress memory leaks
  - Complete migration guide from problematic to memory-safe conditional field arrays
  - Working code examples and best practices
  - Troubleshooting section for memory issues
  - Performance optimization recommendations

- **Examples: Question Form Demo**: Working demonstration of memory-safe conditional field arrays
  - Interactive example showing MULTIPLE_CHOICE question types
  - Before/after code comparisons
  - Real-world implementation patterns
  - Cypress e2e test coverage

- **Enhanced Testing**: Additional test coverage and refinements
  - Question form e2e tests demonstrating memory safety
  - Updated Cypress test patterns for memory optimization
  - Comprehensive validation of conditional field array behavior

### Fixed

- **Test File Naming**: Corrected Cypress test file extensions (`.cy.ts` vs `.spec.ts`)
- **Conditional Rendering**: Improved formatting and error handling in conditional field components

## [2.8.0] - 2026-01-22

### Added

- **Field Array Memory Leak Fixes**: Comprehensive solution for Cypress Electron renderer memory issues
  - `FormFieldHelpers.conditionalFieldArray()` - Memory-safe conditional field arrays that prevent register/unregister cycles
  - `alwaysRegistered` prop for `FieldArrayField` - Keeps fields registered but conditionally renders UI
  - `useLazyFieldRegistration` and `useLazyFieldArrayRegistration` hooks - Lazy registration for better initial memory usage
  - `fieldArrayMemory` utilities - Memory cleanup helpers with garbage collection hints
  - Cypress memory optimizations - `experimentalMemoryManagement` and reduced memory retention

- **Performance Monitoring**: Enhanced field array performance tracking
  - Memory usage monitoring for field array operations
  - Performance metrics collection for long-running tests
  - Garbage collection suggestions for memory-intensive operations

### Fixed

- **Critical Bug Fix: Input Name Attributes**: Fixed missing `name` prop forwarding in `InputField` component
  - `CoercedInput` now properly passes `name={field.name}` to HeroUI Input components
  - Fixes accessibility issues where form inputs had no name attribute in DOM
  - Critical for form automation tools, accessibility compliance, and proper form submission
  - Affects all input types (text, email, password, tel, number, etc.) in ZodForm

### Internal

- **Architecture Cleanup: Simplified HeroUI Integration**: Removed redundant dual-build system and `/react` subpath
  - Eliminated duplicate `react/fields/` components and `tsconfig.react.json`
  - Streamlined to single `#ui` alias approach that works with both individual `@heroui/*` packages and `@heroui/react`
  - `@heroui/react` re-exports all components, making separate configurations unnecessary
  - Cleaner codebase with same functionality and flexibility for users

## [2.7.2] - 2026-01-21

### Fixed

- **Critical Bug Fix: Input Name Attributes**: Fixed missing `name` prop forwarding in `InputField` component
  - `CoercedInput` now properly passes `name={field.name}` to HeroUI Input components
  - Fixes accessibility issues where form inputs had no name attribute in DOM
  - Critical for form automation tools, accessibility compliance, and proper form submission
  - Affects all input types (text, email, password, tel, number, etc.) in ZodForm

### Internal

- **Architecture Cleanup: Simplified HeroUI Integration**: Removed redundant dual-build system and `/react` subpath
  - Eliminated duplicate `react/fields/` components and `tsconfig.react.json`
  - Streamlined to single `#ui` alias approach that works with both individual `@heroui/*` packages and `@heroui/react`
  - `@heroui/react` re-exports all components, making separate configurations unnecessary
  - Cleaner codebase with same functionality and flexibility for users

## [2.7.0] - 2026-01-13

### Added

- **Enhanced FieldArrayConfig**: Added powerful new features for dynamic field arrays
  - `enableReordering` - Enable up/down buttons to reorder array items
  - `reorderButtonText` - Customize reorder button labels (`{ up?: string; down?: string }`)
  - `renderItem` - Custom render function for array items with full control over layout
  - `renderAddButton` - Custom render function for the add button
  - `defaultItem` - Function to create default values when adding new array items
  - Conditional fields now work within array items (automatic path resolution)
  - Example: `{ type: "fieldArray", name: "slots", enableReordering: true, ... }`

- **SimpleForm Component**: New simplified API for single-field forms
  - Perfect for search bars, message inputs, or simple single-field forms
  - Uses `ZodForm` internally for consistent validation and error handling
  - Example: `<SimpleForm schema={schema} field={FormFieldHelpers.input("message", "")} />`

- **syncArrays Utility**: Helper function for syncing arrays in edit forms
  - Determines which items to create, update, or delete based on IDs
  - Useful for edit forms where you need to sync array changes with a database
  - Example: `const { toCreate, toUpdate, toDelete } = syncArrays({ existing, current, getId })`

- **createFieldArrayCustomConfig Helper**: Reduces boilerplate for custom field arrays
  - Creates a `CustomFieldConfig` that uses `useFieldArray` internally
  - Provides structured way to render custom array items with reordering
  - Example: `createFieldArrayCustomConfig({ name: "slots", enableReordering: true, ... })`

### Fixed

- **Conditional Fields in Arrays**: Fixed path resolution for conditional fields within array items
  - Uses `get()` from react-hook-form to correctly resolve nested paths like `"slots.0.slotType"`
  - Conditional fields now work correctly within dynamic field arrays
  - Example: Field with `dependsOn: "slotType"` in array item automatically resolves to `"slots.0.slotType"`

## [2.6.0] - 2026-01-13

### Added

- **Complete Prop Support for All FormFieldHelpers**: All field helpers now accept full component props for complete customization
  - `input()` - Added `inputProps` parameter for full Input component customization
  - `textarea()` - Added `textareaProps` parameter (placeholder still works as shorthand)
  - `select()` - Added `selectProps` parameter
  - `checkbox()` - Added `checkboxProps` parameter
  - `switch()` - Added `switchProps` parameter (description still works as shorthand)
  - `autocomplete()` - Added `autocompleteProps` parameter (placeholder still works as shorthand)
  - `date()` - Improved with proper `DateInput` component typing
  - `slider()` - Improved with proper `Slider` component typing
  - `file()` - Improved with proper `Input` component typing for file inputs
  - `fontPicker()` - Added helper with proper `FontPickerProps` interface typing

- **New Field Helpers**: Added missing helpers for complete coverage
  - `radio()` - Radio group field helper with `radioProps` support
  - `slider()` - Slider field helper with `sliderProps` support
  - `file()` - File upload field helper with `fileProps` support
  - `fontPicker()` - Font picker field helper with `fontPickerProps` support

### Enhanced

- **Improved Type Safety**: Replaced all `Record<string, string | number | boolean>` types with proper component types
  - All helpers now use `Omit<ComponentProps<typeof Component>, ...>` for full type safety
  - Removed all type assertions (`as Record`) - now using proper component types
  - Full IntelliSense support for all component props
  - Type-safe exclusions for form-managed props (value, onChange, label, etc.)

- **Consistent API Pattern**: All helpers now follow the same pattern
  - Simple API for basic cases: `FormFieldHelpers.input("email", "Email", "email")`
  - Full customization when needed: `FormFieldHelpers.input("email", "Email", "email", { classNames: {...}, startContent: <Icon /> })`
  - Backward compatible - all existing code continues to work

### Fixed

- **AdvancedFormBuilder**: Updated to use correct prop names (`maxValue`/`minValue` instead of `max`/`min` for Slider)
- **TypeInferredBuilder**: Updated slider props to use correct prop names
- **FontPicker Types**: Improved type safety with proper `FontPickerProps` interface instead of `Record`

## [2.5.1] - 2026-01-13

### Fixed

- **Conditional Field Helper TypeScript Types**: Fixed type inference issues in `FormFieldHelpers.conditional()`
  - Added default generic type parameter `= FieldValues` for better type compatibility
  - Updated to use type assertion pattern similar to `FormFieldHelpers.content()` for consistency
  - Improved type safety and compatibility with explicit type annotations in condition functions
  - When TypeScript can't infer the type from `Partial<T>`, explicitly specify: `FormFieldHelpers.conditional<YourType>(...)`
  - Removed unused `ConditionalFieldConfig` import

## [2.5.0] - 2026-01-13

### Added

- **AutocompleteField Component**: New autocomplete field component with full React Hook Form integration
  - Supports static option lists via `items` prop
  - Supports async loading via custom `children` render function
  - Handles custom values with `allowsCustomValue` prop
  - Full validation and error handling support
  - Integrated with `FormFieldHelpers.autocomplete()` helper
  - Integrated with `BasicFormBuilder.autocomplete()` method
  - Comprehensive test coverage (10/10 tests passing)
  - Example: `FormFieldHelpers.autocomplete("country", "Country", options, "Search for a country")`

### Dependencies

- Added `@heroui/autocomplete` as optional peer dependency and dev dependency
- Updated UI exports to include Autocomplete and AutocompleteItem components

## [2.4.0] - 2026-01-13

### Added

- **Switch Field Description Support**: Added optional `description` parameter to `FormFieldHelpers.switch()` and `BasicFormBuilder.switch()`
  - Allows adding help text to switch fields for better UX
  - Description is rendered below the switch component
  - Backward compatible - existing code without description continues to work
  - Example: `FormFieldHelpers.switch("notifications", "Enable notifications", "Receive email notifications")`

- **Conditional Field Helper**: Added `FormFieldHelpers.conditional()` helper function for creating conditional fields
  - Simplifies creating fields that show/hide based on form data
  - Works seamlessly with all form types
  - Example: `FormFieldHelpers.conditional("phone", (values) => values.hasPhone === true, FormFieldHelpers.input("phone", "Phone Number", "tel"))`

### Fixed

- **AdvancedFormBuilder Switch Field**: Fixed bug in `AdvancedFormBuilder.switchField()` where:
  - `description` parameter was accepted but not included in the returned config
  - `isDisabled` was incorrectly placed in `switchProps.disabled` instead of at the top level
  - Both properties are now correctly placed at the top level of the field config

### Testing

- Added comprehensive test coverage for switch field description functionality
- Added tests for `FormFieldHelpers.switch()` with and without description
- Added tests for `BasicFormBuilder.switch()` with description
- All tests passing (8/8 tests in SwitchField.cy.tsx)

## [2.3.0] - 2026-01-13

### Removed

- **Breaking Change**: Removed `render` prop from `ZodForm` and `ZodFormConfig`
  - The `render` prop was rarely used and added unnecessary complexity
  - Use `content` field type instead for adding headers, questions, or custom content between fields
  - This simplifies the API and makes it more consistent

### Fixed

- **Type Safety**: Removed all `any` types from `ContentFieldConfig` and `FormFieldHelpers.content()`
  - Replaced with type-safe approach using minimal type assertion
  - Maintains full type safety while allowing compatibility with any form type
  - No breaking changes - all existing code continues to work

## [2.2.2] - 2026-01-13

### Fixed

- **Type Safety**: Removed all `any` types from `ContentFieldConfig` and `FormFieldHelpers.content()`
  - Replaced with type-safe approach using minimal type assertion
  - Maintains full type safety while allowing compatibility with any form type
  - No breaking changes - all existing code continues to work

## [2.2.1] - 2026-01-13

### Fixed

- **Type Safety**: Improved type inference for `FormFieldHelpers.content()` to fix TypeScript "unsafe call" errors
  - Changed return type from `ZodFormFieldConfig<T>` to `ContentFieldConfig<T>` for better type inference
  - Fixes TypeScript compilation errors when using the content helper function

## [2.2.0] - 2026-01-13

### Added

- **Content Field Type**: New `content` field type for adding headers, questions, or custom content between form fields
  - Supports simple title/description rendering
  - Supports custom render functions for full control
  - Works seamlessly with all form types (ZodForm, ConfigurableForm, ServerActionForm)
  - Does not require a schema field name, making it perfect for non-form content
  - Added `FormFieldHelpers.content()` helper function
  - Added `BasicFormBuilder.content()` builder method
  - Comprehensive test coverage with 7 passing tests

### Example Usage

```tsx
// Simple header
{
  type: "content",
  title: "Personal Information",
  description: "Please provide your details below."
}

// Using helper
FormFieldHelpers.content("Section Header", "Description text")

// Using builder
createBasicFormBuilder()
  .input("name", "Name")
  .content("Section Header")
  .input("email", "Email")
  .build()
```

## [2.1.3] - 2026-01-13

### Fixed

- **Cypress Form Submission Helpers**: Improved reliability of `cy.submitForm()` and related submission helpers
  - Added form existence verification before submission
  - Added submit button visibility and enabled state checks
  - Implemented retry logic for better handling of timing issues
  - Fixed `submitAndExpectSuccess()`, `submitAndExpectErrors()`, and `interceptFormSubmission()` helpers
  - Made `expectFieldError()` more flexible by making `errorMessage` parameter optional
  - Fixed TypeScript type compatibility issues in `getFormData()`
  - All helpers now properly wait for forms to be ready before interacting

### Added

- **Test Coverage**: Added comprehensive tests for `cy.submitForm()` helper in ZodForm component tests
  - Tests successful form submission
  - Tests validation error handling with submission helpers

## [2.1.2] - 2026-01-13

### Added

- **Date field helper**: Added `FormFieldHelpers.date()` method for creating date fields in forms
- Supports optional `dateProps` parameter for customizing the date input component
- Comprehensive test coverage for date field functionality

### Fixed

- **ZodForm FormProvider**: Wrapped ZodForm component with FormProvider to ensure form context is properly available
- Fixes issues with form context not being accessible in nested components

## [2.1.1] - 2026-01-12

### Fixed

- **ServerActionForm imports**: Use `#ui` alias for HeroUI imports to support both `@heroui/react` and individual package imports
- Ensures compatibility across different HeroUI installation patterns

## [2.1.0] - 2026-01-12

### Added

#### Next.js Server Actions Support

- **ServerActionForm Component**: New component for seamless integration with Next.js Server Actions
- **Native Form Submission**: Uses native HTML form submission with `FormData` for Server Actions
- **Optional Client-Side Validation**: Can combine client-side Zod validation with server-side validation
- **HeroUI Integration**: Full HeroUI component support with controlled components and hidden inputs
- **Error Handling**: Comprehensive error display for both client and server validation errors
- **Success Messages**: Built-in success message display (with redirect handling documentation)
- **Callbacks**: `onError` and `onSuccess` callbacks for custom handling
- **Default Values**: Support for pre-filling form fields with default values
- **Documentation**: Complete guide at `docs/guides/nextjs-server-actions.md`

## [2.0.0] - 2025-01-27

### 🎉 Major Release - Enhanced Form Experience

This is a major release with significant new features, performance improvements, and some breaking changes. See the [Migration Guide](./docs/migration-v2.md) for upgrade instructions.

### Added

#### Dynamic Form Sections

- **Conditional Fields**: Show/hide fields based on form data with `ConditionalField` component
- **Field Arrays**: Dynamic repeating field groups with `FieldArrayField` component  
- **Dynamic Sections**: Grouped conditional fields with `DynamicSectionField` component
- Builder methods: `conditionalField()`, `fieldArray()`, `dynamicSection()`

#### Enhanced Form State Management

- **Enhanced Form State Hook**: `useEnhancedFormState` with comprehensive state tracking
- **Form Status Component**: `FormStatus` with loading, success, and error states
- **Automatic State Management**: Built-in loading indicators and success feedback
- **Toast Notifications**: Optional toast notifications with `FormToast` component

#### Performance Optimizations

- **Memoized Components**: All field components now use `React.memo` for better performance
- **Debounced Validation**: `useDebouncedValidation` hook for configurable validation delays
- **Performance Utilities**: `usePerformanceMonitor`, `useBatchedFieldUpdates`, and optimization helpers
- **Memory Optimization**: Better memory usage with proper cleanup and memoization

#### Type-Inferred Forms (Alternative API)

- **Type-Inferred Builder**: `TypeInferredBuilder` for automatic schema and field generation
- **Define Inferred Form**: `defineInferredForm` function for single-call form definition
- **Field Type Builders**: Individual field builders with proper type inference
- **Auto-Generated Schemas**: Automatic Zod schema generation from field definitions

#### Enhanced Validation Patterns

- **Cross-Field Validation**: Password confirmation, date ranges, conditional requirements
- **Validation Patterns**: Common patterns for emails, phones, passwords, credit cards
- **Async Validation**: Server-side validation integration with `asyncValidation` helpers
- **Validation Utilities**: Comprehensive validation utilities and error message helpers

#### New Hooks and Utilities

- `useEnhancedFormState`: Comprehensive form state management
- `useDebouncedValidation`: Debounced field validation
- `useInferredForm`: Type-inferred form hook
- `usePerformanceMonitor`: Performance monitoring utilities
- `useBatchedFieldUpdates`: Batched field updates for better performance

### Changed

#### Breaking Changes

- **Field Props**: `isDisabled` → `disabled` for consistency with HeroUI
- **Form State**: Enhanced form state structure with additional properties and methods
- **Field Configuration**: `FormFieldConfig` → `ZodFormFieldConfig` (removed `rules` property)
- **Type Definitions**: Updated type definitions for better TypeScript support

#### API Improvements

- **Consistent Naming**: Standardized prop names across all components
- **Better Type Safety**: Enhanced TypeScript support with better type inference
- **Simplified API**: Cleaner, more intuitive API design
- **Performance**: Significant performance improvements across all components

### Fixed

- **Memory Leaks**: Fixed potential memory leaks in form components
- **Type Safety**: Resolved TypeScript compilation issues
- **Build Process**: Improved build process and bundle optimization
- **Component Re-renders**: Reduced unnecessary re-renders with proper memoization

### Removed

- **Deprecated APIs**: Removed deprecated field prop names
- **Legacy Code**: Cleaned up legacy code and unused utilities
- **Redundant Types**: Simplified type definitions by removing redundant types

## [1.0.2] - 2025-01-27

### Enhanced

- **Font Picker Refactored**: Now uses native [HeroUI Autocomplete component](https://www.heroui.com/docs/components/autocomplete)
- **Better Integration**: Perfect HeroUI design system integration with Autocomplete
- **Enhanced Features**: Built-in search, filtering, keyboard navigation, and accessibility
- **Sections Support**: Organized font categories with `AutocompleteSection`
- **Improved Performance**: Leverages HeroUI's optimized Autocomplete implementation
- **Better UX**: Native HeroUI animations, transitions, and responsive design

### Added

- **Google Fonts Integration**: Access to 1000+ Google Fonts with API key
- **Automatic Font Loading**: Selected fonts are automatically loaded from Google Fonts
- **Fallback Support**: Graceful fallback to local fonts if Google Fonts unavailable
- **Font Previews**: Live font previews in the picker
- **Accessibility Features**: Full ARIA support and keyboard navigation

## [1.0.1] - 2024-12-19

### Added

- **`createZodFormConfig` function**: Missing utility function for creating Zod form configurations
- **Font picker field**: Optional font picker field with `react-fontpicker-ts` integration
- **Comprehensive documentation**: Complete guides for radio buttons, nested fields, and font picker
- **Working examples**: Practical examples demonstrating proper usage

### Fixed

- **Default values handling**: Fixed type casting issues in `createZodFormConfig`
- **Radio button configuration**: Clarified proper usage with `radioOptions` instead of `inputProps.options`
- **Nested field names**: Documented proper schema structure for nested fields like "fonts.scale"
- **Type safety**: Updated `ZodFormConfig` interface to make `schema` required

### Documentation

- [Quick Start Guide](./docs/quick-start.md) - Get started quickly with examples
- [Radio Buttons Guide](./docs/radio-buttons-guide.md) - Complete guide for radio button configuration
- [Nested Fields Guide](./docs/nested-fields-guide.md) - Working with nested field names
- [Input Types Guide](./docs/input-types-guide.md) - Complete reference for all input types
- [Font Picker Guide](./docs/font-picker-guide.md) - Optional font picker field
- [Font Picker Styling](./docs/font-picker-styling.md) - HeroUI integration and styling
- [Fixes Summary](./docs/fixes-summary.md) - Summary of all fixes implemented

### Examples

- `example-settings-form.tsx` - Complete settings form with nested fields and radio buttons
- `example-nested-fields.tsx` - Demonstration of nested field names

## [1.0.0] - 2024-12-18

### Initial Release

- Basic form components with HeroUI integration
- Zod integration support
- TypeScript support
- Form validation and error handling
