# 🤝 Contributing Guide

Thank you for your interest in contributing to the Flight Search Engine! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flight-search-engine.git
   cd flight-search-engine
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/flight-search-engine.git
   ```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

```bash
cp .env.example .env.local
# Add your API credentials
```

### Start Development Server

```bash
vercel dev
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feat/your-feature-name
```

**Branch naming conventions:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `style/` - Code style changes (formatting, etc.)
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add flight comparison feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feat/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit the PR

## Coding Standards

### TypeScript

**Use TypeScript for all new code:**
```typescript
// ✅ Good
interface Flight {
  id: string;
  price: number;
}

function searchFlights(params: SearchParams): Promise<Flight[]> {
  // Implementation
}

// ❌ Bad
function searchFlights(params) {
  // Implementation
}
```

**Avoid `any` type:**
```typescript
// ✅ Good
function processData(data: Flight[]): void {
  // Implementation
}

// ❌ Bad
function processData(data: any): void {
  // Implementation
}
```

### React Components

**Use functional components with hooks:**
```typescript
// ✅ Good
export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const [selected, setSelected] = useState(false);
  
  return <div>{/* Component JSX */}</div>;
};

// ❌ Bad
export class FlightCard extends React.Component {
  // Class component
}
```

**Props interface:**
```typescript
interface FlightCardProps {
  flight: Flight;
  onSelect?: (id: string) => void;
  selected?: boolean;
}
```

### File Organization

```
feature/
├── index.ts              # Public exports
├── Component.tsx         # Main component
├── Component.test.tsx    # Tests
├── Component.styles.ts   # Styles (if needed)
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── types.ts             # Type definitions
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `types.ts` or `interfaces.ts`
- Tests: `*.test.ts` or `*.test.tsx`

**Variables:**
```typescript
// Constants
const MAX_RESULTS = 50;
const API_BASE_URL = 'https://api.example.com';

// Variables
const flightResults = [];
const isLoading = false;

// Functions
function searchFlights() {}
function handleClick() {}

// Components
const FlightCard = () => {};
const SearchForm = () => {};
```

### Code Style

**Use Prettier for formatting:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Use ESLint for linting:**
```bash
npm run lint
npm run lint:fix
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```bash
feat(search): add price range filter

Add slider component for filtering flights by price range.
Includes min/max price inputs and real-time filtering.

Closes #123

---

fix(api): handle amadeus error 141

Implement fallback to Duffel API when Amadeus returns
error 141 (no results found).

Fixes #456

---

docs(readme): update installation instructions

Add Vercel CLI installation step and clarify
environment variable setup.
```

### Commit Best Practices

1. **One logical change per commit**
2. **Write clear, descriptive messages**
3. **Use present tense** ("add feature" not "added feature")
4. **Reference issues** when applicable
5. **Keep commits atomic** and focused

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

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
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] Self-review completed
```

### Review Process

1. **Automated checks** run on PR
2. **Code review** by maintainers
3. **Address feedback** if requested
4. **Approval** from at least one maintainer
5. **Merge** to main branch

### After Merge

- Delete your feature branch
- Pull latest changes from main
- Celebrate! 🎉

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe('applyFilters', () => {
  it('filters flights by price range', () => {
    const flights = [
      { id: '1', priceTotal: 100 },
      { id: '2', priceTotal: 200 },
      { id: '3', priceTotal: 300 },
    ];
    
    const filters = {
      price: { min: 150, max: 250 }
    };
    
    const result = applyFilters(flights, filters);
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});
```

### Integration Tests

Test component interactions:

```typescript
describe('FlightSearch', () => {
  it('displays results after search', async () => {
    render(<FlightSearchPage />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Origin'), {
      target: { value: 'JFK' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Search'));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('50 flights found')).toBeInTheDocument();
    });
  });
});
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **100% for critical paths**
- **All edge cases covered**

```bash
npm run test:coverage
```

## Questions?

- 📧 Email: dev@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Thank you for contributing!** 🙏
