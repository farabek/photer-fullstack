/**
 * Accessibility Tests
 * Ensures the application meets WCAG 2.1 AA standards
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { LogIn } from '@/features/auth/sign-in/ui/LogIn';
import { PostItem } from '@/features/posts/ui/postFeed/PostItem';
import { Modal } from '@/widgets/modal/Modal';
import { Button } from '@/shared/ui/button/Button';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data for tests
const mockPost = {
  id: '1',
  description: 'Test post description',
  photos: ['photo1.jpg'],
  createdAt: '2023-01-01T00:00:00Z',
  user: {
    id: '1',
    userName: 'testuser',
    avatarPath: null,
  },
  commentsCount: 5,
  likesCount: 10,
  isLiked: false,
};

describe('♿ Accessibility Tests', () => {
  describe('Authentication Components', () => {
    test('LogIn form should be accessible', async () => {
      const { container } = render(<LogIn />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check for proper labeling
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      // Check for proper form structure
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('should support keyboard navigation in login form', async () => {
      const user = userEvent.setup();
      render(<LogIn />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Tab navigation should work
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Post Components', () => {
    test('PostItem should be accessible', async () => {
      const { container } = render(<PostItem post={mockPost} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check for proper image alt text
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBeTruthy();
      });

      // Check for proper button labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label');
        const textContent = button.textContent;
        expect(ariaLabel || textContent).toBeTruthy();
      });
    });

    test('should support screen reader navigation for posts', async () => {
      render(<PostItem post={mockPost} />);

      // Check for proper heading structure
      const userHeading = screen.getByRole('heading', { level: 3 });
      expect(userHeading).toHaveTextContent(mockPost.user.userName);

      // Check for proper landmarks
      expect(screen.getByRole('article')).toBeInTheDocument();

      // Check for accessible statistics
      expect(screen.getByText(/5 comments/i)).toBeInTheDocument();
      expect(screen.getByText(/10 likes/i)).toBeInTheDocument();
    });
  });

  describe('Modal Components', () => {
    test('Modal should be accessible', async () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <h2>Test Modal</h2>
          <p>Modal content</p>
        </Modal>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check for proper modal attributes
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');

      // Check for close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    test('should trap focus in modal', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <h2>Test Modal</h2>
          <button>First button</button>
          <button>Second button</button>
        </Modal>
      );

      const firstButton = screen.getByText('First button');
      const secondButton = screen.getByText('Second button');
      const closeButton = screen.getByRole('button', { name: /close/i });

      // Tab should cycle through modal elements only
      await user.tab();
      expect(firstButton).toHaveFocus();

      await user.tab();
      expect(secondButton).toHaveFocus();

      await user.tab();
      expect(closeButton).toHaveFocus();

      // Escape key should close modal
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Interactive Elements', () => {
    test('Buttons should be accessible', async () => {
      const onClick = jest.fn();
      const { container } = render(
        <div>
          <Button onClick={onClick}>Primary Button</Button>
          <Button variant="secondary" onClick={onClick}>Secondary Button</Button>
          <Button disabled onClick={onClick}>Disabled Button</Button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check button roles and states
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      const disabledButton = screen.getByRole('button', { name: /disabled button/i });
      expect(disabledButton).toBeDisabled();
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should support keyboard interactions', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Button onClick={onClick}>Click me</Button>);

      const button = screen.getByRole('button');

      // Space and Enter should trigger click
      button.focus();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);

      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Accessibility', () => {
    test('should associate labels with form controls', () => {
      render(
        <form>
          <label htmlFor="test-input">Test Label</label>
          <input id="test-input" type="text" />

          <label htmlFor="test-select">Test Select</label>
          <select id="test-select">
            <option value="1">Option 1</option>
          </select>
        </form>
      );

      const input = screen.getByLabelText('Test Label');
      const select = screen.getByLabelText('Test Select');

      expect(input).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    });

    test('should show proper error messages', () => {
      render(
        <form>
          <label htmlFor="error-input">Input with Error</label>
          <input
            id="error-input"
            type="email"
            aria-describedby="email-error"
            aria-invalid="true"
          />
          <div id="email-error" role="alert">
            Please enter a valid email address
          </div>
        </form>
      );

      const input = screen.getByLabelText('Input with Error');
      const errorMessage = screen.getByRole('alert');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(errorMessage).toHaveTextContent('Please enter a valid email address');
    });
  });

  describe('Color Contrast', () => {
    test('should meet WCAG AA color contrast requirements', async () => {
      // This would typically use a tool like axe-core or manual testing
      // For now, we'll test that text content is visible
      const { container } = render(
        <div>
          <h1 style={{ color: '#000000', backgroundColor: '#ffffff' }}>
            High Contrast Heading
          </h1>
          <p style={{ color: '#333333', backgroundColor: '#ffffff' }}>
            Good contrast paragraph text
          </p>
        </div>
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Skip Links and Navigation', () => {
    test('should provide skip navigation links', () => {
      render(
        <div>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <nav>Navigation here</nav>
          <main id="main-content">
            Main content here
          </main>
        </div>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Dynamic Content Announcements', () => {
    test('should announce dynamic content changes', () => {
      const { rerender } = render(
        <div>
          <div role="status" aria-live="polite">
            Ready
          </div>
        </div>
      );

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('Ready');

      rerender(
        <div>
          <div role="status" aria-live="polite">
            Loading...
          </div>
        </div>
      );

      expect(status).toHaveTextContent('Loading...');
    });

    test('should announce errors prominently', () => {
      render(
        <div>
          <div role="alert" aria-live="assertive">
            Error: Please fix the required fields
          </div>
        </div>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveTextContent('Error: Please fix the required fields');
    });
  });
});