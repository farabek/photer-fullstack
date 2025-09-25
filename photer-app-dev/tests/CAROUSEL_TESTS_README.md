# Carousel Tests Documentation

This document describes the comprehensive test suite for the photo carousel functionality in Photer application.

## Overview

The carousel functionality is critical for user experience, allowing users to navigate
through multiple photos in posts. The test suite ensures this functionality remains stable
across different user authentication states and scenarios.

## Test Structure

### 1. Unit Tests

#### **Carousel Component Tests** (`tests/unit/components/Carousel.test.tsx`)

- **Purpose**: Test the base Carousel component logic and rendering
- **Coverage**:
  - Rendering with multiple slides vs single slide
  - Navigation button functionality
  - Pagination dots behavior
  - Indicators display
  - Accessibility features (ARIA labels, keyboard support)
  - Props handling (className, showIndicators, etc.)
  - Edge cases (null/undefined children, empty arrays)

#### **PostItem Component Tests** (`tests/unit/components/PostItem.test.tsx`)

- **Purpose**: Test virtual post creation for profile pages
- **Coverage**:
  - Basic post rendering with photos
  - Virtual post creation with aggregated user photos
  - Modal opening/closing behavior
  - Photo aggregation logic from multiple posts
  - Edge cases (empty photos, null/undefined arrays)
  - Debug logging functionality

### 2. End-to-End Tests

#### **Carousel Functionality Tests** (`tests/e2e/carousel-functionality.spec.ts`)

- **Purpose**: Test complete carousel workflow across authentication states
- **Coverage**:
  - **Homepage Carousel (Unauthenticated)**:
    - Navigation with arrow buttons
    - Pagination dots interaction
    - Slide indicators display
    - Single photo posts (no navigation)
  - **Profile Page Carousel (Authenticated)**:
    - Virtual posts with all user photos
    - Navigation through aggregated photos
    - State preservation across modal open/close
  - **Keyboard Navigation**:
    - Arrow key support
    - Focus management
  - **Error Handling**:
    - Broken image URLs
    - Rapid navigation clicks
  - **Accessibility**:
    - ARIA labels
    - Screen reader announcements
    - Tab navigation

## Running Tests

### Quick Commands

```bash
# Run all carousel tests (unit + integration)
npm run test:carousel

# Run carousel tests in watch mode
npm run test:carousel:watch

# Run only E2E carousel tests
npm run test:e2e:carousel

# Run all tests with coverage
npm run test:coverage
```

### Individual Test Categories

```bash
# Unit tests only
npm test -- --testPathPattern="Carousel|PostItem"

# E2E tests only
npm run test:e2e -- --grep "Carousel Functionality"

# Specific test file
npm test -- Carousel.test.tsx
npm test -- PostItem.test.tsx
```

## CI/CD Integration

### Pre-commit Hooks

The pre-commit hook (`.husky/pre-commit`) automatically runs carousel tests before allowing commits:

```bash
# Unit tests
npm run test -- --testPathPattern="Carousel|PostItem" --silent

# E2E tests (basic smoke test)
npm run test:e2e -- --grep "Carousel Functionality" --reporter=list
```

### GitHub Actions

The CI pipeline (`.github/workflows/carousel-tests.yml`) runs on:

- Push to main/develop branches
- Pull requests to main/develop branches
- Changes to carousel-related files

**Pipeline includes**:

1. **Unit Tests**: Jest tests with coverage reporting
2. **E2E Tests**: Playwright tests with full application setup
3. **Code Quality**: ESLint, TypeScript compilation, Prettier formatting
4. **Summary**: Consolidated test results and reporting

## Test Data & Mocks

### Unit Test Mocks

- **Swiper Components**: Mocked to avoid DOM dependencies
- **Next.js Image**: Simple img element replacement
- **PostModal**: Lightweight mock for testing

### E2E Test Setup

- **API Interception**: Mock post data with controlled photo arrays
- **Authentication Flow**: Automated login/logout sequences
- **Page State Management**: Consistent test data across scenarios

## Key Test Scenarios

### 1. Navigation Testing

```typescript
// Arrow button navigation
await page.click('button[aria-label="Next slide"]');
expect(page.locator('text=2 / 3')).toBeVisible();

// Pagination dots
await page.click('.swiper-pagination .swiper-pagination-bullet:nth-child(2)');
expect(page.locator('text=2 / 3')).toBeVisible();
```

### 2. Virtual Post Testing

```typescript
// Profile page virtual post creation
const virtualPost = createVirtualPostWithAllPhotos();
expect(virtualPost.id).toBe('virtual-profile-user1');
expect(virtualPost.photos).toHaveLength(5); // Aggregated photos
```

### 3. Accessibility Testing

```typescript
// ARIA labels and keyboard support
expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
await page.press('.swiper', 'ArrowRight');
expect(page.locator('text=2 / 3')).toBeVisible();
```

## Debugging Tests

### Enable Debug Logging

Tests include comprehensive console logging for debugging:

- Component rendering states
- Virtual post creation details
- Navigation state changes
- Photo aggregation logic

### Visual Debugging (E2E)

```bash
# Run with browser visible
npm run test:e2e:headed -- --grep "Carousel"

# Debug mode with step-by-step execution
npm run test:e2e:debug -- --grep "Carousel"

# Interactive UI mode
npm run test:e2e:ui
```

## Coverage Goals

- **Unit Tests**: 95%+ coverage for carousel components
- **E2E Tests**: Complete user workflow coverage
- **Edge Cases**: Error states, empty data, broken images
- **Accessibility**: WCAG compliance testing

## Maintenance

### Adding New Tests

1. **Unit Tests**: Add to existing test files or create new ones in `tests/unit/`
2. **E2E Tests**: Extend `carousel-functionality.spec.ts` or create focused test files
3. **Update CI**: Modify workflow if new test patterns are introduced

### Test Dependencies

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: E2E testing framework
- **@testing-library/jest-dom**: Additional Jest matchers

### Performance Considerations

- E2E tests run in parallel where possible
- Unit tests use mocked dependencies for speed
- CI pipeline caches dependencies and build artifacts

## Troubleshooting

### Common Issues

1. **Swiper Mock Issues**: Ensure mock components match real Swiper API
2. **Authentication Flow**: Check login/logout sequences in E2E tests
3. **Photo Loading**: Verify image URLs and loading states
4. **State Management**: Ensure proper cleanup between tests

### Debug Commands

```bash
# Verbose test output
npm test -- --verbose

# Run single test with full output
npm test -- --testNamePattern="should navigate between slides"

# E2E test with trace recording
npm run test:e2e -- --trace on
```

This comprehensive test suite ensures the carousel functionality remains robust and prevents
regressions when adding new features to the Photer application.
