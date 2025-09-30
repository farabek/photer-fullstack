import { test, expect } from '@playwright/test';

test.describe('Comments Synchronization Between Pages', () => {
  // Используем одну сессию для всех тестов
  test.use({ storageState: 'playwright/.auth/user.json' });

  const testUserId = 'cmfwqntwf0000v3fcpfhx9epq'; // Replace with actual test user ID
  let commentText: string;

  test.beforeEach(() => {
    commentText = `Test comment ${Date.now()}`;
  });

  test('🧪 should display comments on both profile and home page modals', async ({
    page,
  }) => {
    console.log('=== TEST: Comments synchronization ===');

    // Step 1: Navigate to profile page
    await page.goto(`/profile/${testUserId}`);
    console.log('✓ Navigated to profile page');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-item"]', {
      timeout: 10000,
    });
    console.log('✓ Posts loaded');

    // Step 2: Open post modal on profile page
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();
    console.log('✓ Opened post modal on profile');

    // Wait for modal to open
    await page.waitForSelector('[data-testid="add-comment-button"]', {
      timeout: 5000,
    });
    console.log('✓ Modal opened with comment form');

    // Step 3: Add a comment on profile page
    await page.click('[data-testid="add-comment-button"]');
    await page.waitForSelector('[data-testid="comment-textarea"]', {
      timeout: 5000,
    });
    await page.fill('[data-testid="comment-textarea"]', commentText);
    console.log(`✓ Entered comment text: "${commentText}"`);

    // Publish comment
    await page.click('[data-testid="publish-comment-button"]');
    console.log('✓ Clicked publish button');

    // Wait for comment form to return to initial state
    await page.waitForSelector('[data-testid="add-comment-button"]', {
      timeout: 10000,
    });
    console.log('✓ Comment published successfully');

    // Step 4: Close modal (ESC key or close button)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000); // Wait for modal to close
    console.log('✓ Closed modal on profile');

    // Step 5: Navigate to home page
    await page.goto('/');
    console.log('✓ Navigated to home page');

    // Wait for public posts to load
    await page.waitForSelector('[data-testid="public-post-item"]', {
      timeout: 10000,
      state: 'visible',
    });
    console.log('✓ Public posts loaded on home page');

    // Step 6: Find and open the same user's post on home page
    // Look for posts from the same user
    const userPosts = page.locator('[data-testid="public-post-item"]');
    const postsCount = await userPosts.count();
    console.log(`✓ Found ${postsCount} public posts`);

    // Click on first post (assuming it's from our test user)
    await userPosts.first().click();
    console.log('✓ Opened post modal on home page');

    // Step 7: Wait for comments to load
    await page.waitForTimeout(2000); // Give time for comments to load

    // Step 8: Verify comment is displayed on home page
    const commentElements = page.locator(
      '[data-testid="view-comment"]'
    );
    const commentTexts = await commentElements.allTextContents();

    console.log('✓ Comments found:', commentTexts);

    // Check if our comment is in the list
    const hasComment = commentTexts.some((text) =>
      text.includes(commentText)
    );

    expect(hasComment).toBeTruthy();
    console.log('✅ TEST PASSED: Comment appears on both profile and home page');
  });

  test('🧪 should hide comment form on home page modal', async ({ page }) => {
    console.log('=== TEST: Comment form visibility on home page ===');

    // Navigate to home page
    await page.goto('/');
    console.log('✓ Navigated to home page');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="public-post-item"]', {
      timeout: 10000,
    });
    console.log('✓ Public posts loaded');

    // Open post modal
    const firstPost = page.locator('[data-testid="public-post-item"]').first();
    await firstPost.click();
    console.log('✓ Opened post modal');

    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);

    // Check that "Add a Comment" form/button is NOT visible
    const addCommentButton = page.locator(
      '[data-testid="add-comment-button"]'
    );
    const isVisible = await addCommentButton.isVisible().catch(() => false);

    expect(isVisible).toBe(false);
    console.log('✅ TEST PASSED: Comment form is hidden on home page');
  });

  test('🧪 should show comment form on profile page modal', async ({
    page,
  }) => {
    console.log('=== TEST: Comment form visibility on profile page ===');

    // Navigate to profile page
    await page.goto(`/profile/${testUserId}`);
    console.log('✓ Navigated to profile page');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-item"]', {
      timeout: 10000,
    });
    console.log('✓ Posts loaded');

    // Open post modal
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();
    console.log('✓ Opened post modal');

    // Check that "Add a Comment" form/button IS visible
    await page.waitForSelector('[data-testid="add-comment-button"]', {
      timeout: 5000,
      state: 'visible',
    });
    console.log('✓ Comment form is visible');

    const addCommentButton = page.locator(
      '[data-testid="add-comment-button"]'
    );
    await expect(addCommentButton).toBeVisible();

    console.log('✅ TEST PASSED: Comment form is visible on profile page');
  });

  test('🧪 should load comments using realPostId for virtual posts', async ({
    page,
  }) => {
    console.log('=== TEST: Comments loading with realPostId ===');

    // Enable console logging to verify API calls
    page.on('console', (msg) => {
      if (msg.text().includes('COMMENTS LIST DEBUG')) {
        console.log(`[PAGE LOG] ${msg.text()}`);
      }
    });

    page.on('request', (request) => {
      if (request.url().includes('/comments')) {
        console.log(`[API REQUEST] ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('/comments')) {
        console.log(
          `[API RESPONSE] ${response.status()} ${response.url()}`
        );
      }
    });

    // Navigate to home page
    await page.goto('/');
    console.log('✓ Navigated to home page');

    // Wait for posts
    await page.waitForSelector('[data-testid="public-post-item"]', {
      timeout: 10000,
    });

    // Open virtual post modal
    await page.locator('[data-testid="public-post-item"]').first().click();
    console.log('✓ Opened virtual post modal');

    // Wait for comments to load
    await page.waitForTimeout(2000);

    // Check that comments section exists (even if empty)
    const commentsSection = page.locator('text=Нет комментариев').or(
      page.locator('[data-testid="view-comment"]')
    );
    await expect(commentsSection.first()).toBeVisible({ timeout: 5000 });

    console.log('✅ TEST PASSED: Comments loaded successfully for virtual post');
  });

  test('🧪 should not make API calls for invalid post IDs', async ({
    page,
  }) => {
    console.log('=== TEST: No invalid API calls ===');

    let has404Error = false;

    // Monitor network responses for 404 errors
    page.on('response', (response) => {
      if (
        response.status() === 404 &&
        response.url().includes('/posts/virtual-')
      ) {
        console.error(
          `[ERROR] 404 on virtual post: ${response.url()}`
        );
        has404Error = true;
      }
    });

    // Navigate to home page
    await page.goto('/');
    await page.waitForSelector('[data-testid="public-post-item"]', {
      timeout: 10000,
    });

    // Open virtual post
    await page.locator('[data-testid="public-post-item"]').first().click();
    await page.waitForTimeout(2000);

    // Verify no 404 errors occurred
    expect(has404Error).toBe(false);

    console.log('✅ TEST PASSED: No 404 errors for virtual posts');
  });

  test('🧪 should display same comments count on both pages', async ({
    page,
  }) => {
    console.log('=== TEST: Comments count consistency ===');

    // Get comments count on profile page
    await page.goto(`/profile/${testUserId}`);
    await page.waitForSelector('[data-testid="post-item"]', {
      timeout: 10000,
    });

    await page.locator('[data-testid="post-item"]').first().click();
    await page.waitForTimeout(2000);

    const profileCommentsCount = await page
      .locator('[data-testid="view-comment"]')
      .count();
    console.log(`✓ Profile page comments count: ${profileCommentsCount}`);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Get comments count on home page
    await page.goto('/');
    await page.waitForSelector('[data-testid="public-post-item"]', {
      timeout: 10000,
    });

    await page.locator('[data-testid="public-post-item"]').first().click();
    await page.waitForTimeout(2000);

    const homeCommentsCount = await page
      .locator('[data-testid="view-comment"]')
      .count();
    console.log(`✓ Home page comments count: ${homeCommentsCount}`);

    // Verify counts match
    expect(homeCommentsCount).toBe(profileCommentsCount);

    console.log('✅ TEST PASSED: Comments count is consistent across pages');
  });
});

test.describe('Comments API Integration', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('🧪 should use correct API endpoint for comment fetching', async ({
    page,
  }) => {
    console.log('=== TEST: API endpoint validation ===');

    const apiCalls: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/comments')) {
        apiCalls.push(request.url());
        console.log(`[API] ${request.method()} ${request.url()}`);
      }
    });

    // Open post on profile
    await page.goto('/profile/cmfwqntwf0000v3fcpfhx9epq');
    await page.waitForSelector('[data-testid="post-item"]', {
      timeout: 10000,
    });
    await page.locator('[data-testid="post-item"]').first().click();
    await page.waitForTimeout(2000);

    // Verify API calls use real post IDs (not virtual IDs)
    const hasVirtualIdInApi = apiCalls.some((url) =>
      url.includes('/posts/virtual-')
    );

    expect(hasVirtualIdInApi).toBe(false);
    console.log('✅ TEST PASSED: API uses real post IDs only');
  });
});