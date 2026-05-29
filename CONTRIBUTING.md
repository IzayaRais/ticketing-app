# 🤝 Contributing to Ticketing App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors must:

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what benefits the community
- Show empathy and understanding

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- GitHub account
- Basic knowledge of TypeScript and React

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/ticketing-app.git
cd ticketing-app

# 3. Add upstream remote
git remote add upstream https://github.com/IzayaRais/ticketing-app.git

# 4. Install dependencies
npm install
```

### Setup Development Environment

```bash
# 1. Create .env.local
cp .env.example .env.local

# 2. Ask maintainer for dev credentials or setup your own

# 3. Start development server
npm run dev
```

---

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout master
git merge upstream/master

# Create feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests
- `chore/` - Maintenance

### 2. Make Your Changes

- Keep commits small and focused
- Write meaningful commit messages
- Test your changes thoroughly
- Follow coding standards (see below)

### 3. Test Your Changes

```bash
# Run linter
npm run lint
npm run lint -- --fix  # Fix auto-fixable issues

# Build for production
npm run build

# Run development server
npm run dev
```

### 4. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/master
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

---

## 📝 Coding Standards

### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Always define types for function parameters and returns
- Avoid `any` type - use `unknown` if necessary
- Use interfaces for object shapes

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id) {
  // ...
}
```

### React/Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button {...props}>{props.children}</button>;
}
```

### File Organization

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Header.tsx
│   └── index.ts
├── app/                  # Next.js app routes
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
├── lib/                  # Utility functions
│   ├── auth.ts
│   ├── email.ts
│   └── utils.ts
├── types/                # TypeScript types
│   └── index.ts
└── styles/               # Global styles
    └── globals.css
```

### Naming Conventions

- **Files:** `camelCase.ts` or `PascalCase.tsx` for components
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE` for global constants
- **Functions:** `camelCase`
- **Classes:** `PascalCase`
- **Interfaces:** `PascalCase` (prefix with `I` optional)

### Code Formatting

- Use Prettier (configured in project)
- 2-space indentation
- Single quotes for strings (unless template literals)
- Semicolons required
- Max line length: 100 characters

---

## 📌 Commit Messages

Use clear, descriptive commit messages following this format:

```
type(scope): subject

body

footer
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build, dependencies, tooling
- `perf:` - Performance improvements

### Examples

```bash
git commit -m "feat(tickets): add QR code generation"
git commit -m "fix(auth): resolve Google OAuth redirect issue"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(components): simplify Button component logic"
```

---

## 🔄 Pull Requests

### Before Creating a PR

- [ ] Fork and clone repository
- [ ] Create feature branch
- [ ] Make your changes
- [ ] Run `npm run lint` and `npm run build`
- [ ] Test thoroughly
- [ ] Update documentation if needed
- [ ] Rebase on latest upstream/master

### Creating a PR

1. Push your feature branch to your fork
2. Go to the original repository
3. Click "New Pull Request"
4. Select your branch as the source
5. Fill in the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Breaking change

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### PR Review Process

1. **Automated Checks:** GitHub Actions run linting and builds
2. **Code Review:** Maintainers review code
3. **Discussion:** Address feedback and comments
4. **Approval:** PR approved by maintainers
5. **Merge:** PR merged to master

---

## 🐛 Reporting Bugs

### Before Creating an Issue

- Check existing issues for duplicates
- Verify you're using the latest version
- Reproduce the issue consistently

### Bug Report Template

```markdown
## Description
Clear, concise description of the bug

## Steps to Reproduce
1. Do this
2. Then this
3. And this

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [Windows, macOS, Linux]
- Node version: 18.x
- Browser: [Chrome, Firefox, Safari]

## Additional Context
Any other context
```

---

## ✨ Feature Requests

### Before Creating a Feature Request

- Check existing issues for similar requests
- Consider if it aligns with project goals

### Feature Request Template

```markdown
## Description
Clear description of the requested feature

## Use Case
Why this feature is needed and who needs it

## Proposed Solution
How you envision the feature working

## Alternatives Considered
Any alternative approaches

## Additional Context
Any other context or sketches
```

---

## ❓ Questions?

- Check [GitHub Discussions](https://github.com/IzayaRais/ticketing-app/discussions)
- Ask maintainer in issue comments
- Check existing documentation

---

## 🎉 Thank You!

Your contributions help make this project better. We appreciate your effort and look forward to collaborating with you!

---

**Happy Contributing! 🚀**
