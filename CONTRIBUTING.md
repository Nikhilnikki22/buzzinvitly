# Contributing to BuzzInvitly

Thank you for your interest in contributing to BuzzInvitly! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability
- Ethnicity, gender identity and expression
- Level of experience
- Nationality, personal appearance
- Race, religion
- Sexual identity and orientation

### Our Standards

**Positive Behavior**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable Behavior**:
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct reasonably considered inappropriate

### Enforcement

Report violations to conduct@buzzinvitly.com. All reports will be reviewed and investigated.

## Getting Started

### Prerequisites

- Node.js 20+ installed
- PostgreSQL 14+ or Supabase account
- Git installed
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository**
   - Visit https://github.com/buzzinvitly/buzzinvitly
   - Click "Fork" button

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/buzzinvitly.git
   cd buzzinvitly
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/buzzinvitly/buzzinvitly.git
   ```

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up database
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000

## Development Process

### Branch Strategy

**Main Branches**:
- `main` - Production-ready code
- `develop` - Integration branch for features

**Feature Branches**:
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/hotfix-name` - Emergency fixes
- `docs/doc-name` - Documentation updates

### Workflow

1. **Create a branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define types explicitly
- Avoid `any` type

**Example**:
```typescript
// Good
interface Event {
  id: string;
  name: string;
  eventDate: Date;
}

function createEvent(data: Event): Promise<Event> {
  // ...
}

// Bad
function createEvent(data: any) {
  // ...
}
```

### React

- Use functional components
- Use hooks instead of classes
- Keep components small and focused
- Extract reusable logic into hooks

**Example**:
```typescript
// Good
export default function EventCard({ event }: { event: Event }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <h3>{event.name}</h3>
    </div>
  )
}

// Bad
export default class EventCard extends React.Component {
  // ...
}
```

### Naming Conventions

**Files**:
- Components: PascalCase (`EventCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useEvent.ts`)

**Variables**:
- camelCase for variables and functions
- PascalCase for components and types
- UPPER_SNAKE_CASE for constants

**Example**:
```typescript
const MAX_GUESTS = 500
const eventDate = new Date()
function formatEventDate(date: Date): string { }
interface EventProps { }
```

### Code Style

**Formatting**:
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline

Run formatter:
```bash
npm run format
```

**Linting**:
```bash
npm run lint
```

### File Organization

```typescript
// 1. Imports
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

// 2. Types
interface Props {
  event: Event
}

// 3. Constants
const MAX_DESCRIPTION_LENGTH = 500

// 4. Component
export default function EventCard({ event }: Props) {
  // 4a. Hooks
  const [isExpanded, setIsExpanded] = useState(false)

  // 4b. Handlers
  const handleToggle = () => setIsExpanded(!isExpanded)

  // 4c. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Commit Messages

### Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
# Feature
feat(events): add recurring event support

# Bug fix
fix(rsvp): resolve double-submit issue

# Documentation
docs(api): update authentication examples

# Refactor
refactor(auth): extract validation logic

# Breaking change
feat(api)!: change event response format

BREAKING CHANGE: Event API now returns ISO dates
```

### Rules

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Keep subject under 50 characters
- Wrap body at 72 characters
- Reference issues: `Fixes #123`

## Pull Request Process

### Before Submitting

**Checklist**:
- [ ] Code follows style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] New tests added for features
- [ ] Documentation updated
- [ ] Linter passes (`npm run lint`)
- [ ] Type check passes (`npm run type-check`)
- [ ] No merge conflicts
- [ ] Commits follow convention
- [ ] PR description is clear

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
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Linter must pass
   - Build must succeed

2. **Code Review**
   - At least 1 approval required
   - Address review comments
   - Update as needed

3. **Merge**
   - Squash and merge (preferred)
   - Rebase and merge (for clean history)
   - Delete branch after merge

### Review Guidelines

**For Reviewers**:
- Be respectful and constructive
- Explain reasoning for suggestions
- Approve if minor issues only
- Request changes for major issues
- Test the changes locally

**For Authors**:
- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Update PR description if scope changes

## Testing

### Unit Tests

**Write tests for**:
- Utility functions
- React components
- API routes
- Database queries

**Example**:
```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('January 15, 2024')
  })
})
```

**Run tests**:
```bash
npm run test
npm run test:ui
npm run test:coverage
```

### E2E Tests

**Write E2E tests for**:
- Critical user flows
- Authentication
- Event creation
- RSVP submission

**Example**:
```typescript
import { test, expect } from '@playwright/test'

test('user can create event', async ({ page }) => {
  await page.goto('/events/new')
  await page.fill('[name="eventName"]', 'Test Event')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/events\/evt_/)
})
```

**Run E2E tests**:
```bash
npm run test:e2e
npm run test:e2e:ui
```

### Coverage Requirements

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Documentation

### Code Comments

**When to comment**:
- Complex algorithms
- Non-obvious business logic
- Workarounds or hacks
- TODOs (with issue number)

**When NOT to comment**:
- Obvious code
- Self-documenting code
- Outdated comments (remove them)

**Example**:
```typescript
// Good: Explains WHY
// Use exponential backoff to avoid overwhelming the email service
await retryWithBackoff(sendEmail, 3)

// Bad: Explains WHAT (code already shows this)
// Increment counter by 1
counter++
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Adding dependencies
- Changing deployment process

### API Documentation

Update docs/API.md when:
- Adding new endpoints
- Changing request/response format
- Deprecating endpoints
- Adding parameters

### User Documentation

Update docs/USER_GUIDE.md when:
- Adding user-facing features
- Changing UI flows
- Adding new subscription plans
- Changing pricing

## Community

### Communication Channels

**GitHub Discussions**:
- Feature requests
- Questions
- General discussion
- Show and tell

**Discord** (Coming Soon):
- Real-time chat
- Help and support
- Contributor coordination

**Twitter**: [@buzzinvitly](https://twitter.com/buzzinvitly)
- Product updates
- Release announcements

### Getting Help

**Questions**:
- Search existing issues
- Check documentation
- Ask in GitHub Discussions
- Tag with appropriate labels

**Bug Reports**:
- Use issue template
- Provide reproduction steps
- Include environment details
- Add screenshots if visual

**Feature Requests**:
- Search for duplicates
- Explain use case
- Describe expected behavior
- Consider implementation

### Recognition

**Contributors**:
- Listed in README.md
- Mentioned in release notes
- Featured in blog posts
- Invited to contributor Discord

**Types of Contributions**:
- Code contributions
- Documentation improvements
- Bug reports
- Feature suggestions
- Design feedback
- Community support

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Quick Start for Contributors

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/buzzinvitly.git

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Create branch
git checkout -b feature/amazing-feature

# 5. Make changes and test
npm run test
npm run lint

# 6. Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# 7. Open Pull Request
# Go to GitHub and create PR
```

---

**Thank you for contributing to BuzzInvitly! 🎉**

Questions? Contact us at contributors@buzzinvitly.com
