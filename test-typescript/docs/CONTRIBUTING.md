# Contributing to Next.js Boilerplate

Thank you for your interest in contributing to Next.js Boilerplate! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Documentation](#documentation)
- [Testing](#testing)
- [Release Process](#release-process)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@your-org.com](mailto:conduct@your-org.com).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Docker (optional, for containerized development)

### Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/next-boilerplate.git
   cd next-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy

We use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/):

- `main` - Production-ready code
- `dev` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Creating a Feature

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write code following our [coding standards](#coding-standards)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(auth): add OAuth2 integration
fix(ui): resolve button alignment issue
docs: update API documentation
test: add unit tests for user service
```

## 🔀 Pull Request Process

### Before Submitting

1. **Ensure tests pass**

   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   npm run type-check
   ```

2. **Update documentation**

   - Update README.md if needed
   - Add/update API documentation
   - Update CHANGELOG.md

3. **Check performance**
   ```bash
   npm run analyze
   npm run lighthouse
   ```

### PR Template

When creating a PR, please include:

- **Description**: What changes were made and why
- **Type**: Feature, Bug Fix, Documentation, etc.
- **Testing**: How was this tested?
- **Breaking Changes**: Any breaking changes?
- **Screenshots**: For UI changes
- **Checklist**: Complete the PR checklist

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing may be required
4. **Approval**: Maintainer approval needed to merge

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Try the latest version** to ensure it's not already fixed

### Bug Reports

Use the bug report template and include:

- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

### Feature Requests

Use the feature request template and include:

- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Any other relevant information

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Keep it up-to-date
- Follow the existing style

### Documentation Types

- **API Documentation**: Auto-generated from TypeScript
- **Component Documentation**: Storybook stories
- **Architecture Documentation**: System design docs
- **User Documentation**: Getting started guides

## 🧪 Testing

### Test Requirements

- **Unit Tests**: Required for new features
- **Integration Tests**: For API endpoints
- **E2E Tests**: For critical user flows
- **Visual Tests**: For UI components

### Writing Tests

```typescript
// Example unit test
describe("UserService", () => {
  it("should create a new user", async () => {
    const userData = { name: "John Doe", email: "john@example.com" };
    const user = await userService.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

### Test Coverage

- Maintain at least 80% code coverage
- Focus on critical business logic
- Test edge cases and error conditions

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** in package.json
2. **Update CHANGELOG.md**
3. **Create release PR**
4. **Merge to main**
5. **Create GitHub release**
6. **Publish to npm**

## 🏗️ Coding Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use meaningful type names
- Avoid `any` type

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Use proper prop types
- Follow React best practices

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Write self-documenting code

### File Organization

```
src/
├── components/         # Reusable UI components
├── pages/             # Next.js pages
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── services/          # API services
└── styles/            # Global styles
```

## 🛠️ Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📞 Getting Help

- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)
- 📖 **Documentation**: [docs.your-site.com](https://docs.your-site.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/next-boilerplate/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/your-org/next-boilerplate/discussions)

## 🙏 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Next.js Boilerplate! 🎉
