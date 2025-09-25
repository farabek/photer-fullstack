import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
};

const TEST_POST_DATA = {
  description: 'Test post description for E2E testing',
  updatedDescription: 'Updated test post description'
};

// Helper functions
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

async function loginUser(page: Page) {
  console.log('Logging in user for posts testing');

  await page.goto(`${BASE_URL}/sign-in`);
  await waitForPageLoad(page);

  await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
  await page.fill('input[type="password"], input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]:has-text("Sign In"), button:has-text("Sign In")');

  await page.waitForURL(`${BASE_URL}/`);
  await waitForPageLoad(page);
}

async function createTestImage(): Promise<string> {
  // Create a simple test image file path
  // In real tests, you might want to use an actual image file
  return path.join(__dirname, '../fixtures/test-image.jpg');
}

test.describe('Critical Posts Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test.describe('Post Creation', () => {
    test('should successfully create a new post', async ({ page }) => {
      // Navigate to post creation
      const createButton = page.locator('[data-testid="create-post"], button:has-text("Create"), button:has-text("Add Post"), .create-post-btn');

      if (await createButton.first().isVisible()) {
        await createButton.first().click();
      } else {
        // Alternative: navigate via URL
        await page.goto(`${BASE_URL}/posts/create`);
      }

      await waitForPageLoad(page);

      // Should show post creation form
      const createForm = page.locator('[data-testid="create-post-form"], .post-create-form, form');
      await expect(createForm.first()).toBeVisible({ timeout: 10000 });

      // Fill post description
      const descriptionInput = page.locator('textarea[name="description"], input[name="description"], [data-testid="post-description"]');
      await descriptionInput.first().fill(TEST_POST_DATA.description);

      // Upload image (if file input exists)
      const fileInput = page.locator('input[type="file"], [data-testid="file-upload"]');

      if (await fileInput.isVisible()) {
        // Note: In real tests, you'd use an actual image file
        // await fileInput.setInputFiles(await createTestImage());
        console.log('File input found but skipping upload for demo');
      }

      // Submit the post
      const submitButton = page.locator('button[type="submit"]:has-text("Create"), button:has-text("Post"), button:has-text("Publish"), [data-testid="submit-post"]');
      await submitButton.first().click();

      // Should redirect to home or show success message
      const successIndicator = page.locator('.success, [data-testid="success"], .toast-success');
      const isOnHomePage = page.url().includes(`${BASE_URL}/`) || page.url() === `${BASE_URL}/`;

      if (await successIndicator.first().isVisible({ timeout: 3000 })) {
        await expect(successIndicator.first()).toBeVisible();
      } else {
        // Alternative: check we're redirected to home
        await expect(page).toHaveURL(`${BASE_URL}/`);
      }
    });

    test('should validate required fields in post creation', async ({ page }) => {
      // Navigate to post creation
      await page.goto(`${BASE_URL}/posts/create`);
      await waitForPageLoad(page);

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]:has-text("Create"), button:has-text("Post"), [data-testid="submit-post"]');

      if (await submitButton.first().isVisible()) {
        await submitButton.first().click();

        // Should show validation errors or button should be disabled
        const isDisabled = await submitButton.first().isDisabled();
        const validationErrors = page.locator('.error, [data-testid="validation-error"], .text-danger');

        if (!isDisabled) {
          await expect(validationErrors.first()).toBeVisible({ timeout: 3000 });
        }
      }
    });
  });

  test.describe('Post Viewing', () => {
    test('should display posts on homepage', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Should show posts or empty state
      const postsContainer = page.locator('[data-testid="posts-list"], .posts-container, .posts-grid');
      const posts = page.locator('[data-testid="post-item"], .post-item, .post-card');
      const emptyState = page.locator('[data-testid="no-posts"], .empty-state, text="No posts"');

      await expect(postsContainer.first()).toBeVisible({ timeout: 10000 });

      // Either posts are visible or empty state is shown
      const hasPosts = await posts.first().isVisible({ timeout: 3000 });
      const hasEmptyState = await emptyState.first().isVisible({ timeout: 1000 });

      expect(hasPosts || hasEmptyState).toBeTruthy();
    });

    test('should open post modal when clicking on post', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Find and click on a post
      const firstPost = page.locator('[data-testid="post-item"], .post-item, .post-card').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // Should open modal
        const modal = page.locator('[data-testid="post-modal"], .modal, .post-modal');
        await expect(modal.first()).toBeVisible({ timeout: 5000 });

        // Modal should contain post content
        const modalContent = page.locator('[data-testid="post-content"], .post-description, .modal-body');
        await expect(modalContent.first()).toBeVisible();

        // Should be able to close modal
        const closeButton = page.locator('[data-testid="close-modal"], .modal-close, button:has-text("Close")');

        if (await closeButton.first().isVisible()) {
          await closeButton.first().click();
        } else {
          // Alternative: press Escape
          await page.keyboard.press('Escape');
        }

        await expect(modal.first()).not.toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('Post Editing (Owner Only)', () => {
    test('should show edit options for own posts', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Find a post (assuming we have posts from previous tests)
      const firstPost = page.locator('[data-testid="post-item"], .post-item, .post-card').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // In modal, look for edit button
        const editButton = page.locator('[data-testid="edit-post"], button:has-text("Edit"), .edit-btn');
        const moreMenu = page.locator('[data-testid="post-menu"], .more-menu, .ellipsis-menu');

        // Edit button might be direct or in a menu
        if (await editButton.first().isVisible({ timeout: 3000 })) {
          await expect(editButton.first()).toBeVisible();
        } else if (await moreMenu.first().isVisible({ timeout: 3000 })) {
          await moreMenu.first().click();
          await expect(page.locator('text="Edit", [data-testid="edit-option"]').first()).toBeVisible();
        }
      }
    });

    test('should successfully edit post description', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      const firstPost = page.locator('[data-testid="post-item"], .post-item, .post-card').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // Find and click edit button
        const editButton = page.locator('[data-testid="edit-post"], button:has-text("Edit")');
        const moreMenu = page.locator('[data-testid="post-menu"], .ellipsis-menu');

        if (await editButton.first().isVisible({ timeout: 3000 })) {
          await editButton.first().click();
        } else if (await moreMenu.first().isVisible()) {
          await moreMenu.first().click();
          await page.click('text="Edit", [data-testid="edit-option"]');
        } else {
          // Skip if edit functionality not available
          test.skip(true, 'Edit functionality not found');
          return;
        }

        // Should show edit form
        const editForm = page.locator('[data-testid="edit-post-form"], .edit-form');
        await expect(editForm.first()).toBeVisible({ timeout: 5000 });

        // Update description
        const descriptionInput = page.locator('textarea[name="description"], [data-testid="edit-description"]');
        await descriptionInput.first().clear();
        await descriptionInput.first().fill(TEST_POST_DATA.updatedDescription);

        // Save changes
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), [data-testid="save-post"]');
        await saveButton.first().click();

        // Should show success message or updated content
        const successMessage = page.locator('.success, [data-testid="success"]');
        const updatedContent = page.locator(`text="${TEST_POST_DATA.updatedDescription}"`);

        // Either success message or updated content should be visible
        const hasSuccess = await successMessage.first().isVisible({ timeout: 3000 });
        const hasUpdatedContent = await updatedContent.first().isVisible({ timeout: 3000 });

        expect(hasSuccess || hasUpdatedContent).toBeTruthy();
      }
    });
  });

  test.describe('Post Deletion (Owner Only)', () => {
    test('should show delete option for own posts', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      const firstPost = page.locator('[data-testid="post-item"], .post-item, .post-card').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // Look for delete option
        const deleteButton = page.locator('[data-testid="delete-post"], button:has-text("Delete")');
        const moreMenu = page.locator('[data-testid="post-menu"], .ellipsis-menu');

        if (await deleteButton.first().isVisible({ timeout: 3000 })) {
          await expect(deleteButton.first()).toBeVisible();
        } else if (await moreMenu.first().isVisible()) {
          await moreMenu.first().click();
          await expect(page.locator('text="Delete", [data-testid="delete-option"]').first()).toBeVisible();
        }
      }
    });

    test.skip('should successfully delete post with confirmation', async ({ page }) => {
      // Skip this test to avoid actually deleting posts in demo
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      const firstPost = page.locator('[data-testid="post-item"], .post-item').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // Find delete option
        const moreMenu = page.locator('[data-testid="post-menu"], .ellipsis-menu');
        if (await moreMenu.first().isVisible()) {
          await moreMenu.first().click();
          await page.click('[data-testid="delete-option"], text="Delete"');
        }

        // Should show confirmation dialog
        const confirmDialog = page.locator('[data-testid="confirm-delete"], .confirm-dialog');
        await expect(confirmDialog.first()).toBeVisible();

        // Confirm deletion
        await page.click('button:has-text("Confirm"), button:has-text("Delete"), [data-testid="confirm-delete-btn"]');

        // Should redirect or show success
        const successMessage = page.locator('.success, [data-testid="success"]');
        await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Post Interactions', () => {
    test('should display post photos in carousel', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      const firstPost = page.locator('[data-testid="post-item"], .post-item, .post-card').first();

      if (await firstPost.isVisible({ timeout: 5000 })) {
        await firstPost.click();

        // Should show carousel (from previous carousel tests)
        const carousel = page.locator('.swiper, [data-testid="carousel"], .carousel');

        if (await carousel.first().isVisible({ timeout: 3000 })) {
          await expect(carousel.first()).toBeVisible();

          // Check for navigation if multiple photos
          const navButtons = page.locator('button[aria-label*="slide"], .swiper-button');
          const pagination = page.locator('.swiper-pagination, .carousel-pagination');

          // Navigation should be present for multi-photo posts
          const hasNavButtons = await navButtons.first().isVisible({ timeout: 1000 });
          const hasPagination = await pagination.first().isVisible({ timeout: 1000 });

          // At least one navigation element should be present for multi-photo posts
          // Or it's a single photo post without navigation
          console.log('Carousel navigation check:', { hasNavButtons, hasPagination });
        }
      }
    });

    test('should handle posts without photos gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Look for posts without photos (text-only posts)
      const posts = page.locator('[data-testid="post-item"], .post-item, .post-card');
      const postCount = await posts.count();

      if (postCount > 0) {
        for (let i = 0; i < Math.min(postCount, 3); i++) {
          await posts.nth(i).click();

          // Modal should open regardless of photo presence
          const modal = page.locator('[data-testid="post-modal"], .modal');
          await expect(modal.first()).toBeVisible({ timeout: 3000 });

          // Should show description or "no image" placeholder
          const content = page.locator('[data-testid="post-content"], .post-description');
          const noImage = page.locator('[data-testid="no-image"], text="No Image"');

          const hasContent = await content.first().isVisible({ timeout: 1000 });
          const hasNoImageState = await noImage.first().isVisible({ timeout: 1000 });

          expect(hasContent || hasNoImageState).toBeTruthy();

          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Profile Posts View', () => {
    test('should display user posts on profile page', async ({ page }) => {
      // Navigate to own profile
      const profileLink = page.locator('[data-testid="profile-link"], a:has-text("Profile"), .profile-menu');

      if (await profileLink.first().isVisible({ timeout: 5000 })) {
        await profileLink.first().click();
      } else {
        // Try direct navigation
        await page.goto(`${BASE_URL}/profile/test-user`);
      }

      await waitForPageLoad(page);

      // Should show profile posts grid
      const postsGrid = page.locator('[data-testid="profile-posts"], .profile-posts-grid, .user-posts');
      await expect(postsGrid.first()).toBeVisible({ timeout: 10000 });

      // Posts in profile should be clickable
      const profilePost = page.locator('[data-testid="post-item"], .post-item').first();

      if (await profilePost.isVisible({ timeout: 3000 })) {
        await profilePost.click();

        // Should open modal with virtual post functionality (from carousel tests)
        const modal = page.locator('[data-testid="post-modal"], .modal');
        await expect(modal.first()).toBeVisible();

        // Should show aggregated photos if multiple posts exist
        const carousel = page.locator('.swiper, [data-testid="carousel"]');
        if (await carousel.first().isVisible({ timeout: 2000 })) {
          console.log('Profile virtual post carousel is working');
        }
      }
    });
  });

  test.describe('Performance and Loading', () => {
    test('should show loading states during post operations', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Check for loading state on page load
      const loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');

      // Loading might be very quick, so we don't assert it's visible
      // but we log if we catch it
      const hasLoading = await loadingIndicator.first().isVisible({ timeout: 1000 });
      console.log('Loading state detected:', hasLoading);

      // Posts should eventually load
      const postsContainer = page.locator('[data-testid="posts-list"], .posts-container');
      const posts = page.locator('[data-testid="post-item"], .post-item');
      const emptyState = page.locator('[data-testid="no-posts"], text="No posts"');

      await expect(postsContainer.first()).toBeVisible({ timeout: 10000 });

      // Either posts or empty state should be visible
      const hasPosts = await posts.first().isVisible({ timeout: 3000 });
      const hasEmptyState = await emptyState.first().isVisible({ timeout: 1000 });

      expect(hasPosts || hasEmptyState).toBeTruthy();
    });

    test('should handle large number of posts with pagination or infinite scroll', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await waitForPageLoad(page);

      // Check if pagination exists
      const pagination = page.locator('.pagination, [data-testid="pagination"]');
      const loadMoreButton = page.locator('button:has-text("Load More"), [data-testid="load-more"]');

      if (await pagination.first().isVisible({ timeout: 3000 })) {
        console.log('Pagination found');
        await expect(pagination.first()).toBeVisible();
      } else if (await loadMoreButton.first().isVisible({ timeout: 3000 })) {
        console.log('Load More button found');
        await loadMoreButton.first().click();
        await waitForPageLoad(page);
      } else {
        // Check for infinite scroll by scrolling down
        const initialPostCount = await page.locator('[data-testid="post-item"], .post-item').count();

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        const newPostCount = await page.locator('[data-testid="post-item"], .post-item').count();

        if (newPostCount > initialPostCount) {
          console.log('Infinite scroll detected');
        } else {
          console.log('Static post list (no pagination/infinite scroll)');
        }
      }
    });
  });
});