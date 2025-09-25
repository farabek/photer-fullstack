import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
  firstName: 'Test',
  lastName: 'User',
  userName: 'testuser'
};

// Helper functions
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

async function loginUser(page: Page, email: string = TEST_USER.email, password: string = TEST_USER.password) {
  console.log(`Logging in user: ${email}`);

  await page.goto(`${BASE_URL}/sign-in`);
  await waitForPageLoad(page);

  // Fill login form
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);

  // Submit form
  await page.click('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');

  // Wait for redirect
  await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
  await waitForPageLoad(page);
}

async function logoutUser(page: Page) {
  console.log('Logging out user');

  // Look for logout button or profile menu
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  } else {
    // Try to find profile menu first
    const profileMenu = page.locator('[data-testid="profile-menu"], .profile-menu, button:has-text("Profile")').first();
    if (await profileMenu.isVisible()) {
      await profileMenu.click();
      await page.click('button:has-text("Logout"), a:has-text("Logout")');
    }
  }

  await page.waitForURL(`${BASE_URL}/sign-in`);
  await waitForPageLoad(page);
}

test.describe('Critical Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API intercepts if needed
    console.log('Setting up test environment');
  });

  test.describe('Login Flow', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Verify we're on login page
      await expect(page.locator('h1, h2, [data-testid="login-title"]')).toContainText(/sign in/i);

      // Fill and submit login form
      await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
      await page.fill('input[type="password"], input[name="password"]', TEST_USER.password);

      await page.click('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');

      // Should redirect to home page
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Should show authenticated user content
      const authenticatedContent = page.locator('[data-testid="user-avatar"], .user-profile, button:has-text("Profile"), [data-testid="authenticated"]');
      await expect(authenticatedContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Try to login with invalid credentials
      await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');

      await page.click('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');

      // Should show error message
      const errorMessage = page.locator('.error, [data-testid="error"], .text-danger, .text-red');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

      // Should stay on login page
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/sign-in`));
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Try to submit empty form
      await page.click('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');

      // Should show validation errors or form should not submit
      const submitButton = page.locator('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');
      const isDisabled = await submitButton.isDisabled();

      if (!isDisabled) {
        // If button is enabled, there should be validation errors
        const validationErrors = page.locator('.error, [data-testid="validation-error"], .text-danger, .invalid-feedback');
        await expect(validationErrors.first()).toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('Registration Flow', () => {
    test('should navigate to registration from login page', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Find and click registration link
      const registerLink = page.locator('a:has-text("Sign Up"), a:has-text("Register"), [data-testid="register-link"]');
      await expect(registerLink.first()).toBeVisible();

      await registerLink.first().click();

      // Should navigate to registration page
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/sign-up`));

      // Should show registration form
      const registrationForm = page.locator('h1:has-text("Sign Up"), h2:has-text("Register"), [data-testid="registration-form"]');
      await expect(registrationForm.first()).toBeVisible();
    });

    test.skip('should successfully register new user', async ({ page }) => {
      // Skip this test as it requires a working backend and cleanup
      // Implementation would be similar to login test
      await page.goto(`${BASE_URL}/sign-up`);
      await waitForPageLoad(page);

      // Fill registration form with unique data
      const uniqueEmail = `test-${Date.now()}@example.com`;

      await page.fill('input[name="email"], input[type="email"]', uniqueEmail);
      await page.fill('input[name="password"], input[type="password"]', TEST_USER.password);
      await page.fill('input[name="firstName"]', TEST_USER.firstName);
      await page.fill('input[name="lastName"]', TEST_USER.lastName);
      await page.fill('input[name="userName"]', `user${Date.now()}`);

      await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Register")');

      // Should redirect or show success message
      // Implementation depends on app behavior after registration
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route while unauthenticated', async ({ page }) => {
      // Try to access profile page without authentication
      await page.goto(`${BASE_URL}/profile/test-user`);
      await waitForPageLoad(page);

      // Should redirect to login or show unauthorized message
      const currentUrl = page.url();
      const isOnLoginPage = currentUrl.includes('/sign-in') || currentUrl.includes('/login');
      const hasUnauthorizedMessage = await page.locator('text="Unauthorized", text="Please log in", [data-testid="unauthorized"]').isVisible();

      expect(isOnLoginPage || hasUnauthorizedMessage).toBeTruthy();
    });

    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // Login first
      await loginUser(page);

      // Navigate to profile page
      await page.goto(`${BASE_URL}/profile/test-user`);
      await waitForPageLoad(page);

      // Should show profile content (not redirect to login)
      const profileContent = page.locator('[data-testid="profile"], .profile-page, h1:has-text("Profile")');
      const isProfileVisible = await profileContent.first().isVisible({ timeout: 5000 });

      if (!isProfileVisible) {
        // Alternative: check we're not on login page
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('/sign-in');
        expect(currentUrl).not.toContain('/login');
      } else {
        await expect(profileContent.first()).toBeVisible();
      }
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page reloads', async ({ page }) => {
      // Login
      await loginUser(page);

      // Reload the page
      await page.reload();
      await waitForPageLoad(page);

      // Should still be authenticated
      const authenticatedContent = page.locator('[data-testid="user-avatar"], .user-profile, button:has-text("Profile")');
      await expect(authenticatedContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('should successfully logout', async ({ page }) => {
      // Login first
      await loginUser(page);

      // Logout
      await logoutUser(page);

      // Should be redirected to login page
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/sign-in`));

      // Should show login form
      await expect(page.locator('h1:has-text("Sign In"), [data-testid="login-form"]')).toBeVisible();
    });

    test('should prevent access to protected routes after logout', async ({ page }) => {
      // Login and then logout
      await loginUser(page);
      await logoutUser(page);

      // Try to access protected route
      await page.goto(`${BASE_URL}/profile/test-user`);
      await waitForPageLoad(page);

      // Should redirect to login or show unauthorized
      const currentUrl = page.url();
      const isRedirectedToLogin = currentUrl.includes('/sign-in') || currentUrl.includes('/login');

      expect(isRedirectedToLogin).toBeTruthy();
    });
  });

  test.describe('Form Validation and UX', () => {
    test('should show loading state during login', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Fill form
      await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
      await page.fill('input[type="password"], input[name="password"]', TEST_USER.password);

      // Click submit and immediately check for loading state
      const submitButton = page.locator('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');
      await submitButton.click();

      // Should show loading state (disabled button, spinner, or loading text)
      const isDisabledDuringLoading = await submitButton.isDisabled();
      const hasLoadingText = await page.locator('text="Loading", text="Signing in", [data-testid="loading"]').isVisible();
      const hasSpinner = await page.locator('.spinner, [data-testid="spinner"], .loading-spinner').isVisible();

      // At least one loading indicator should be present
      expect(isDisabledDuringLoading || hasLoadingText || hasSpinner).toBeTruthy();
    });

    test('should handle password visibility toggle', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      await passwordInput.fill('testpassword');

      // Look for password visibility toggle
      const toggleButton = page.locator('button[aria-label*="password"], button:has-text("Show"), button:has-text("Hide"), [data-testid="password-toggle"]');

      if (await toggleButton.isVisible()) {
        await toggleButton.click();

        // Password should become visible (type changes to text)
        const inputType = await passwordInput.getAttribute('type');
        expect(inputType).toBe('text');

        // Toggle again
        await toggleButton.click();

        // Should be hidden again
        const hiddenType = await passwordInput.getAttribute('type');
        expect(hiddenType).toBe('password');
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels and ARIA attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Check for proper labels
      const emailLabel = page.locator('label:has-text("Email"), label[for*="email"]');
      const passwordLabel = page.locator('label:has-text("Password"), label[for*="password"]');

      await expect(emailLabel.first()).toBeVisible();
      await expect(passwordLabel.first()).toBeVisible();

      // Check form has proper role
      const form = page.locator('form, [role="form"]');
      await expect(form.first()).toBeVisible();

      // Check submit button is accessible
      const submitButton = page.locator('button[type="submit"], input[type="submit"]');
      await expect(submitButton.first()).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-in`);
      await waitForPageLoad(page);

      // Tab through the form
      await page.keyboard.press('Tab'); // Should focus first input
      await page.keyboard.type(TEST_USER.email);

      await page.keyboard.press('Tab'); // Should focus password input
      await page.keyboard.type(TEST_USER.password);

      await page.keyboard.press('Tab'); // Should focus submit button

      // Submit via keyboard
      await page.keyboard.press('Enter');

      // Should trigger login process
      await expect(page).toHaveURL(`${BASE_URL}/`);
    });
  });
});