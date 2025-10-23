# Changelog

All notable changes to this project will be documented in this file.

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
