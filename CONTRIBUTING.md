# Contributing to Hero Hook Form

Thank you for your interest in contributing to Hero Hook Form! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/hero-hook-form.git`
3. **Install** dependencies: `npm install`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes
6. **Test** your changes: `npm test`
7. **Commit** with conventional commits: `git commit -m "feat: add amazing feature"`
8. **Push** to your fork: `git push origin feature/amazing-feature`
9. **Create** a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Local Development

```bash
# Clone and setup
git clone https://github.com/rachelallyson/hero-hook-form.git
cd hero-hook-form
npm install

# Start development build
npm run dev:build

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Testing

We use Cypress for component testing. To run tests:

```bash
# Run all tests
npm run cy:run

# Open Cypress UI
npm run cy:open
```

## 📝 Code Style

### TypeScript

- Use strict TypeScript settings
- Prefer interfaces over types for object shapes
- Use proper generic constraints
- Avoid `any` type - use proper typing instead

### React

- Use functional components with hooks
- Prefer named exports over default exports
- Use proper prop types and interfaces
- Follow React best practices

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## 🧪 Testing Guidelines

### Component Testing

- Test all field components thoroughly
- Test form validation scenarios
- Test accessibility features
- Test responsive behavior
- Use realistic test data

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test basic rendering
  });

  it('should handle user interactions', () => {
    // Test user interactions
  });

  it('should validate input correctly', () => {
    // Test validation
  });

  it('should be accessible', () => {
    // Test accessibility
  });
});
```

## 📚 Documentation

### Code Comments

- Comment complex logic
- Document public APIs
- Use JSDoc for function documentation
- Keep comments up-to-date with code changes

### README Updates

- Update README when adding new features
- Include usage examples
- Document breaking changes
- Keep installation instructions current

## 🔄 Pull Request Process

### Before Submitting

1. **Test** your changes thoroughly
2. **Update** documentation if needed
3. **Ensure** all tests pass
4. **Check** that the build succeeds
5. **Verify** TypeScript compilation

### PR Description

- Describe the problem you're solving
- Explain your solution approach
- Include screenshots for UI changes
- List any breaking changes
- Reference related issues

### Review Process

- All PRs require review
- Address review comments promptly
- Keep PRs focused and small
- Respond to CI failures quickly

## 🐛 Bug Reports

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear description of what you expected to happen.

**Environment:**
- OS: [e.g. macOS, Windows]
- Node.js version: [e.g. 18.0.0]
- Package version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📋 Issue Labels

We use the following labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues

## 🎯 Areas for Contribution

### High Priority

- Performance improvements
- Accessibility enhancements
- Additional field types
- Better error handling
- Enhanced validation

### Medium Priority

- Additional form layouts
- More configuration options
- Better TypeScript types
- Documentation improvements
- Example applications

### Low Priority

- UI theme variations
- Additional utility functions
- Performance monitoring
- Testing improvements

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community

### Communication

- Use clear and concise language
- Ask questions when you need clarification
- Provide constructive feedback
- Be patient with newcomers

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions
- **Documentation**: Check the docs folder first

## 🏆 Recognition

Contributors will be recognized in:

- README contributors section
- Release notes
- GitHub contributors list
- Special mentions for significant contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

Thank you for contributing to Hero Hook Form! 🎉
