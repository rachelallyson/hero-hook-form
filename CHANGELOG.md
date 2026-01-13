# Changelog

All notable changes to this project will be documented in this file.

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

### Fixed

- **Type Safety**: Improved type inference for `FormFieldHelpers.content()` to fix TypeScript "unsafe call" errors

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
