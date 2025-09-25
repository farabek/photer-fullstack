import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// Helper functions
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional wait for React hydration
}

async function loginUser(page: Page) {
  // Navigate to login page
  await page.goto(`${BASE_URL}/sign-in`);
  await waitForPageLoad(page);

  // Fill login form (adjust selectors based on your form)
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');

  // Wait for redirect after login
  await page.waitForURL(`${BASE_URL}/`);
  await waitForPageLoad(page);
}

test.describe('Carousel Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API intercepts for consistent test data
    await page.route(`${API_URL}/api/v1/posts*`, async route => {
      const mockPosts = {
        items: [
          {
            id: 'test-post-1',
            description: 'Test post 1',
            photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
            owner: {
              id: 'user1',
              userName: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'avatar1.jpg',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'test-post-2',
            description: 'Test post 2',
            photos: ['photo4.jpg', 'photo5.jpg'],
            owner: {
              id: 'user1',
              userName: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'avatar1.jpg',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        totalCount: 2,
      };
      await route.fulfill({ json: mockPosts });
    });
  });

  test.describe('Homepage Carousel (Unauthenticated)', () => {
    test('should display carousel with navigation for multiple photos', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      // Find a post with multiple photos
      const postCard = page.locator('[data-testid="post-card"]').first();
      await expect(postCard).toBeVisible();

      // Click to open modal
      await postCard.click();

      // Wait for modal to open
      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Check carousel elements
      await expect(page.locator('.swiper')).toBeVisible();
      await expect(page.locator('button[aria-label="Previous slide"]')).toBeVisible();
      await expect(page.locator('button[aria-label="Next slide"]')).toBeVisible();

      // Check pagination dots
      await expect(page.locator('.swiper-pagination')).toBeVisible();

      // Check slide indicator
      await expect(page.locator('text=/\\d+ \\/ \\d+/')).toBeVisible();
    });

    test('should navigate between slides using arrow buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      // Open modal with multiple photos
      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Check initial slide indicator
      await expect(page.locator('text=1 / 3')).toBeVisible();

      // Click next button
      await page.click('button[aria-label="Next slide"]');
      await page.waitForTimeout(500); // Wait for transition

      // Check updated slide indicator
      await expect(page.locator('text=2 / 3')).toBeVisible();

      // Click previous button
      await page.click('button[aria-label="Previous slide"]');
      await page.waitForTimeout(500);

      // Should be back to first slide
      await expect(page.locator('text=1 / 3')).toBeVisible();
    });

    test('should navigate using pagination dots', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Click on second pagination dot
      await page.click('.swiper-pagination .swiper-pagination-bullet:nth-child(2)');
      await page.waitForTimeout(500);

      // Should show second slide
      await expect(page.locator('text=2 / 3')).toBeVisible();
    });

    test('should hide navigation for single photo posts', async ({ page }) => {
      // Mock single photo post
      await page.route(`${API_URL}/api/v1/posts*`, async route => {
        const singlePhotoPost = {
          items: [{
            id: 'single-photo-post',
            description: 'Single photo post',
            photos: ['single-photo.jpg'],
            owner: {
              id: 'user1',
              userName: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'avatar1.jpg',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
          totalCount: 1,
        };
        await route.fulfill({ json: singlePhotoPost });
      });

      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Navigation should be hidden for single photo
      await expect(page.locator('button[aria-label="Previous slide"]')).not.toBeVisible();
      await expect(page.locator('button[aria-label="Next slide"]')).not.toBeVisible();
      await expect(page.locator('.swiper-pagination')).not.toBeVisible();

      // Should show single photo indicator
      await expect(page.locator('text=📷 1')).toBeVisible();
    });
  });

  test.describe('Profile Page Carousel (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page);
    });

    test('should display carousel with all user photos on profile page', async ({ page }) => {
      const profileUrl = `${BASE_URL}/profile/user1`;
      await page.goto(profileUrl);
      await waitForPageLoad(page);

      // Click on any post item
      const postItem = page.locator('[data-testid="post-item"]').first();
      await expect(postItem).toBeVisible();
      await postItem.click();

      // Modal should open with virtual post containing all user photos
      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Should show carousel with all photos from all user posts (5 total: 3+2)
      await expect(page.locator('text=1 / 5')).toBeVisible();

      // Should have navigation for multiple photos
      await expect(page.locator('button[aria-label="Previous slide"]')).toBeVisible();
      await expect(page.locator('button[aria-label="Next slide"]')).toBeVisible();
      await expect(page.locator('.swiper-pagination')).toBeVisible();
    });

    test('should preserve carousel state when navigating between slides', async ({ page }) => {
      const profileUrl = `${BASE_URL}/profile/user1`;
      await page.goto(profileUrl);
      await waitForPageLoad(page);

      const postItem = page.locator('[data-testid="post-item"]').first();
      await postItem.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Navigate to middle slide
      await page.click('button[aria-label="Next slide"]');
      await page.click('button[aria-label="Next slide"]');
      await page.waitForTimeout(500);

      await expect(page.locator('text=3 / 5')).toBeVisible();

      // Close and reopen modal
      await page.press('body', 'Escape');
      await expect(modal).not.toBeVisible();

      await postItem.click();
      await expect(modal).toBeVisible();

      // Should start from beginning again
      await expect(page.locator('text=1 / 5')).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Focus on carousel
      await page.focus('.swiper');

      // Use arrow keys to navigate
      await page.press('.swiper', 'ArrowRight');
      await page.waitForTimeout(500);

      await expect(page.locator('text=2 / 3')).toBeVisible();

      await page.press('.swiper', 'ArrowLeft');
      await page.waitForTimeout(500);

      await expect(page.locator('text=1 / 3')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle broken image URLs gracefully', async ({ page }) => {
      // Mock post with broken image URL
      await page.route(`${API_URL}/api/v1/posts*`, async route => {
        const brokenImagePost = {
          items: [{
            id: 'broken-image-post',
            description: 'Post with broken image',
            photos: ['broken-url.jpg', 'another-broken.jpg'],
            owner: {
              id: 'user1',
              userName: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'avatar1.jpg',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
          totalCount: 1,
        };
        await route.fulfill({ json: brokenImagePost });
      });

      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Carousel should still render and be navigable
      await expect(page.locator('.swiper')).toBeVisible();
      await expect(page.locator('text=1 / 2')).toBeVisible();
    });

    test('should not break when clicking navigation rapidly', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Rapidly click next button
      for (let i = 0; i < 10; i++) {
        await page.click('button[aria-label="Next slide"]');
        await page.waitForTimeout(50);
      }

      // Should still be functional and not crash
      await expect(page.locator('.swiper')).toBeVisible();
      await expect(page.locator('text=/\\d+ \\/ \\d+/')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and keyboard support', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Check ARIA labels
      await expect(page.locator('button[aria-label="Previous slide"]')).toBeVisible();
      await expect(page.locator('button[aria-label="Next slide"]')).toBeVisible();

      // Check keyboard accessibility
      await page.press('body', 'Tab');
      await page.press('body', 'Tab');

      // Should be able to reach navigation buttons via tab
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test('should announce slide changes to screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      await waitForPageLoad(page);

      const postCard = page.locator('[data-testid="post-card"]').first();
      await postCard.click();

      const modal = page.locator('[data-testid="post-modal"]');
      await expect(modal).toBeVisible();

      // Click next slide
      await page.click('button[aria-label="Next slide"]');

      // Check that slide indicator updates (screen readers rely on this)
      await expect(page.locator('text=2 / 3')).toBeVisible();
    });
  });
});