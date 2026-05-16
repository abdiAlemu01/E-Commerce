# Contributing to E-Commerce Platform

Thank you for considering contributing to our e-commerce platform! This document provides guidelines and instructions for contributing.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### 1. Fork the Repository
Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/ecommerce-platform.git
cd ecommerce-platform
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/original-owner/ecommerce-platform.git
```

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Keep Your Fork Updated
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request
Go to the original repository and click "New Pull Request"

## Coding Standards

### JavaScript/Node.js

#### General Rules
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use async/await instead of callbacks

#### Naming Conventions
- **Variables**: camelCase (`userName`, `productList`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Functions**: camelCase (`getUserData`, `calculateTotal`)
- **Classes**: PascalCase (`UserController`, `ProductService`)
- **Files**: camelCase (`userController.js`, `productService.js`)

#### Code Style
```javascript
// Good
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error('User not found');
  }
};

// Bad
function getUserById(id) {
  return User.findById(id).then(user => {
    return user;
  }).catch(err => {
    throw new Error('User not found');
  });
}
```

### React/JSX

#### Component Structure
```javascript
// Good
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
```

#### Hooks Rules
- Only call hooks at the top level
- Only call hooks from React functions
- Use custom hooks for reusable logic

#### Component Naming
- Use PascalCase for components
- Use descriptive names
- Suffix with component type if needed (`UserList`, `ProductCard`)

### CSS/Tailwind

#### Class Ordering
1. Layout (display, position, flex, grid)
2. Box model (width, height, margin, padding)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Misc (cursor, transition)

```jsx
// Good
<div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-md">

// Bad
<div className="shadow-md bg-white flex p-4 rounded-lg w-full items-center justify-between">
```

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(auth): add email verification

Implement email verification system with token generation
and expiration handling.

Closes #123

fix(cart): resolve quantity update issue

Fixed bug where cart quantity wasn't updating correctly
when user clicked increment button multiple times.

Fixes #456

docs(readme): update installation instructions

Added detailed steps for Redis installation on Windows.
```

### Rules
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when relevant

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update API documentation

2. **Write Tests**
   - Add unit tests for new features
   - Ensure all tests pass
   - Aim for >80% code coverage

3. **Check Code Quality**
   - Run linter: `npm run lint`
   - Fix any warnings or errors
   - Format code consistently

4. **Test Thoroughly**
   - Test in development environment
   - Test edge cases
   - Test error handling

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
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)

## Related Issues
Closes #(issue number)
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline must pass
   - Code coverage must meet threshold
   - No linting errors

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Make requested changes

3. **Merge**
   - Squash and merge for feature branches
   - Rebase and merge for hotfixes

## Testing

### Backend Testing

#### Unit Tests
```javascript
import { expect } from 'chai';
import { calculateTotal } from '../utils/cart.js';

describe('Cart Utils', () => {
  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 20, quantity: 1 },
      ];
      const total = calculateTotal(items);
      expect(total).to.equal(40);
    });
  });
});
```

#### Integration Tests
```javascript
import request from 'supertest';
import app from '../server.js';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
  });
});
```

### Frontend Testing

#### Component Tests
```javascript
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    const product = { name: 'Test Product', price: 99.99 };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

## Project Structure

### Backend
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
```

### Frontend
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── features/       # Feature modules
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   └── App.jsx         # Root component
```

## Questions?

Feel free to:
- Open an issue for bugs
- Start a discussion for questions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**
