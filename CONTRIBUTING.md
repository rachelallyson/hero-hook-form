# Contributing to Hero Hook Form

Thank you for your interest in contributing to Hero Hook Form! This guide will help you get started with development, testing, and contributing to the project.

## Development Setup

### Prerequisites

- **Node.js**: >=18.0.0
- **npm**: >=8.0.0 (or yarn/pnpm)
- **Git**: Latest version

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rachelallyson/hero-hook-form.git
   cd hero-hook-form
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install peer dependencies**

   ```bash
   npm install @heroui/react react-hook-form zod @hookform/resolvers
   ```

### Development Environment

1. **Start development build**

   ```bash
   npm run dev:build
   ```

2. **Run example app** (in separate terminal)

   ```bash
   cd example
   npm install
   npm run dev
   ```

3. **Open browser**
   - Example app: <http://localhost:3010>
   - Cypress: `npm run cy:open`

## Project Structure

```
hero-hook-form/
├── src/                    # Source code
│   ├── components/         # Core form components
│   ├── fields/            # Individual field components
│   ├── hooks/             # Custom hooks
│   ├── builders/          # Form builders
│   ├── utils/             # Utility functions
│   ├── providers/         # Context providers
│   └── index.ts           # Public exports
├── example/               # Example Next.js app
├── docs/                  # Documentation
├── cypress/               # Cypress tests
└── dist/                  # Built files
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the [Cursor Rules](.cursor/rules/01-repo.md)
- Read [Documentation](docs/index.md) before making changes
- Use TypeScript for all new code
- Add tests for new functionality

### 3. Test Your Changes

```bash
# Run TypeScript check
npm run typecheck

# Run linting
npm run lint

# Run Cypress tests
npm run cy:run

# Run all tests
npm test
```

### 4. Build and Verify

```bash
# Build the package
npm run build

# Verify build output
ls -la dist/
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use `Path<T>` for field names, not `string`
- Export types from `src/index.ts`

### React

- Use functional components with hooks
- Use `React.memo` for field components
- Prefer composition over inheritance
- Use proper TypeScript props

### Form Patterns

- Use configuration-based forms
- Follow established field patterns
- Implement proper error handling
- Use Zod for validation

## Testing

### Component Testing

All components have corresponding Cypress tests:

```bash
# Run component tests
npm run cy:run

# Open Cypress for interactive testing
npm run cy:open
```

### Test Structure

```
src/
├── components/
│   ├── Form.cy.tsx        # Form component tests
│   └── FormField.cy.tsx   # FormField component tests
├── fields/
│   ├── InputField.cy.tsx  # InputField tests
│   └── CheckboxField.cy.tsx # CheckboxField tests
└── hooks/
    └── useFormHelper.cy.tsx # Hook tests
```

### Writing Tests

```tsx
// Example test structure
describe('InputField', () => {
  it('renders with label', () => {
    cy.mount(<InputField name="test" label="Test Field" />);
    cy.get('label').should('contain', 'Test Field');
  });

  it('shows validation error', () => {
    cy.mount(<InputField name="test" label="Test Field" />);
    cy.get('[name="test"]').type('invalid');
    cy.get('[data-testid="test-error"]').should('be.visible');
  });
});
```

### Test Data

Use `data-testid` attributes for reliable testing:

```tsx
<InputField 
  name="email" 
  label="Email"
  inputProps={{ "data-testid": "email-input" }}
/>
```

## Documentation

### Adding Documentation

1. **Update existing docs** in `docs/` directory
2. **Add new guides** for complex features
3. **Update API reference** when adding new exports
4. **Include examples** in documentation

### Documentation Structure

```
docs/
├── index.md              # Main entry point
├── concepts.md           # Core concepts
├── guides/               # How-to guides
│   ├── quickstart.md    # Getting started
│   ├── dynamic-forms.md # Advanced features
│   └── error-handling.md # Error patterns
├── reference/            # API reference
│   ├── config.md        # Configuration
│   └── api/             # Generated API docs
├── recipes/              # Code examples
│   └── examples.md      # Copy-paste snippets
└── troubleshooting.md    # Common issues
```

### Writing Documentation

- Use clear, concise language
- Include code examples
- Link to related sections
- Keep examples runnable
- Update when APIs change

## Release Process

### Version Bumping

We use semantic versioning (semver):

- **Patch** (1.0.1): Bug fixes, documentation updates
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Release Steps

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Run tests** to ensure everything works
4. **Build package** with `npm run build`
5. **Publish** with `npm publish`

### Changelog Format

```markdown
## [2.0.0] - 2025-01-27

### Added
- New feature description
- Another new feature

### Changed
- Breaking change description
- Non-breaking change description

### Fixed
- Bug fix description
- Another bug fix

### Removed
- Deprecated feature removal
```

## Pull Request Process

### Before Submitting

1. **Read the documentation** in `docs/`
2. **Follow the code style** guidelines
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run all tests** and ensure they pass

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Documentation
- [ ] Documentation updated
- [ ] Examples added
- [ ] API reference updated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in example app
4. **Documentation** review
5. **Approval** and merge

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Focus on what's best for the community
- Show empathy towards other community members
- Accept constructive criticism gracefully

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks or political discussions
- Spam or off-topic discussions

## Getting Help

### Documentation

- **Start here**: [docs/index.md](docs/index.md)
- **Quick reference**: [docs/llm-context.md](docs/llm-context.md)
- **API docs**: [docs/reference/api/README.md](docs/reference/api/README.md)

### Community

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Join the community chat

### Common Issues

- **TypeScript errors**: Check field names match form data type
- **Build failures**: Ensure all dependencies are installed
- **Test failures**: Check test setup and data-testid attributes

## Development Tips

### Performance

- Use `React.memo` for field components
- Implement debouncing for expensive operations
- Monitor performance with built-in utilities

### Debugging

- Enable debug mode for form state
- Use browser dev tools for component inspection
- Check console for validation errors

### Best Practices

- Follow established patterns
- Write comprehensive tests
- Document complex functionality
- Consider accessibility
- Optimize for performance

## License

By contributing to Hero Hook Form, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to Hero Hook Form! Your contributions help make the library better for everyone.
