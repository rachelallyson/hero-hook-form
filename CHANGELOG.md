# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-23

### Added

- Initial release of Hero Hook Form
- Complete form field components for HeroUI integration
  - InputField
  - TextareaField
  - SelectField
  - RadioGroupField
  - CheckboxField
  - SwitchField
  - SliderField
  - DateField
  - FileField
- ConfigurableForm component for rapid form development
- FormProvider for form context management
- ConfigProvider for global configuration defaults
- SubmitButton component with loading states
- Zod integration with ZodForm component
- Dual entrypoint support (default and /react)
- Comprehensive TypeScript support
- Full documentation with examples
- Cypress test suite for all components

### Features

- Strongly-typed field components
- Multiple form layouts (vertical, horizontal, grid)
- Global configuration system
- Validation integration with React Hook Form
- Optional Zod schema validation
- Responsive design support
- Accessibility features from HeroUI
- Tree-shaking support for individual components

### Technical

- Built with TypeScript
- ESM and CommonJS support
- Dual entrypoint architecture
- Comprehensive test coverage
- Full documentation suite
