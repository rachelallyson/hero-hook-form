# Contributing to Hero Hook Form

Thank you for your interest in contributing to Hero Hook Form! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rachelallyson/hero-hook-form.git
   cd hero-hook-form
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install documentation dependencies:

   ```bash
   cd docs && npm install
   ```

### Development Commands

#### Main Package

```bash
# Build the package
npm run build

# Build in watch mode
npm run dev:build

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm run test

# Run Cypress tests interactively
npm run cy:open

# Run Cypress tests headlessly
npm run cy:run
```

#### Documentation

```bash
# Start documentation development server
npm run docs:dev

# Build documentation
npm run docs:build

# Start production documentation server
npm run docs:start

# Generate API documentation
npm run docs:api
```

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use proper generic constraints
- Follow the established naming conventions

### React

- Use functional components with hooks
- Prefer `React.memo` for performance optimization
- Use proper prop types and interfaces
- Follow accessibility guidelines

### Form Patterns

- Use helper functions for simple field creation
- Use builder patterns for complex forms
- Always include proper validation with Zod schemas
- Handle errors gracefully

## Testing

### Unit Tests

- Write tests for all new functionality
- Use the provided test utilities (`createFormTestUtils`)
- Test both success and error scenarios
- Include edge cases and validation tests

### Integration Tests

- Use Cypress for component testing
- Test form submission and validation
- Test dynamic form behavior
- Test accessibility features

### Test Structure

```tsx
import { createFormTestUtils } from "@rachelallyson/hero-hook-form";

describe("MyComponent", () => {
  it("should handle form submission", async () => {
    const testUtils = createFormTestUtils(form);
    await testUtils.submitForm();
    // Assertions
  });
});
```

## Documentation

### Documentation Workflow

1. **Edit content files**: Modify `.mdx` files in `docs/content/` directory.
2. **Regenerate API docs**: Run `npm run docs:api` (emits Markdown into `docs/content/api/`).
3. **Preview locally**: Run `npm run docs:dev` (Next.js runs in `docs/`).
4. **Build docs**: Run `npm run docs:build` (exports to `docs/out/`).
5. **Serve docs**: Run `npm run docs:start`.
6. **Deploy**: Automated via `.github/workflows/docs.yml` on push to `main`.

### Documentation Structure

- **`docs/content/`** - Source of truth for documentation content
- **`docs/content/api/`** - Auto-generated API documentation (committed to git)
- **`docs/app/`** - Next.js App Router files for Nextra
- **`docs/package.json`** - Separate dependencies for documentation site

### Writing Guidelines

- Use clear, concise language
- Include code examples for all features
- Provide both simple and advanced examples
- Include troubleshooting information
- Follow the established documentation patterns

## Pull Request Process

### Before Submitting

1. **Fork the repository** and create a feature branch
2. **Run all tests** to ensure nothing is broken
3. **Update documentation** if adding new features
4. **Add tests** for new functionality
5. **Update CHANGELOG.md** with your changes

### Pull Request Checklist

- [ ] Code follows the established style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] New features have tests
- [ ] Breaking changes are documented

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(forms): add conditional field support`
- `fix(validation): resolve email validation issue`
- `docs(api): update form builder documentation`
- `test(cypress): add form submission tests`

## Release Process

### Version Bumping

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new version
3. Create a release tag
4. Publish to npm
5. Deploy documentation

## Code Review

### Review Guidelines

- Check for proper TypeScript usage
- Verify test coverage
- Ensure documentation is updated
- Check for accessibility compliance
- Verify performance implications
- Check for breaking changes

### Review Checklist

- [ ] Code quality and style
- [ ] Test coverage and quality
- [ ] Documentation completeness
- [ ] Performance considerations
- [ ] Accessibility compliance
- [ ] Breaking change documentation

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps to reproduce the bug
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Node.js version, browser, etc.
6. **Code example**: Minimal code that reproduces the issue

### Feature Requests

When requesting features, please include:

1. **Use case**: Why this feature is needed
2. **Proposed solution**: How you think it should work
3. **Alternatives**: Other solutions you've considered
4. **Additional context**: Any other relevant information

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the golden rule

### Getting Help

- Check the documentation first
- Search existing issues
- Ask questions in discussions
- Be specific about your problem

## License

By contributing to Hero Hook Form, you agree that your contributions will be licensed under the ISC License.

## Thank You

Thank you for contributing to Hero Hook Form! Your contributions help make the project better for everyone.
