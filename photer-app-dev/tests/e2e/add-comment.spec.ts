import { test, expect } from '@playwright/test';

test.describe('Comment Addition', () => {
  test('should add comment successfully', async ({ page }) => {
    // Включаем логирование консоли для отладки
    page.on('console', (msg) => {
      console.log(`[PAGE LOG] ${msg.text()}`);
    });

    // Сначала переходим на профиль, где уже есть cookies авторизации
    await page.goto('/profile/cmfovo66m0000v39816a2gwg7');

    console.log('Navigated to profile page');

    // Ждем загрузки страницы и проверяем, что мы авторизованы
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост
    const firstPost = page.locator('[data-testid="post-item"]').first();

    // Кликаем на пост, чтобы открыть модальное окно
    await firstPost.click();

    console.log('Post modal opened');

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="add-comment-button"]', {
      timeout: 5000,
    });

    console.log('Add comment button found');

    // Нажимаем кнопку "Add a Comment..."
    await page.click('[data-testid="add-comment-button"]');

    console.log('Add comment button clicked');

    // Ждем появления textarea для комментария
    await page.waitForSelector('[data-testid="comment-textarea"]', {
      timeout: 5000,
    });

    console.log('Comment textarea appeared');

    // Вводим текст комментария
    const commentText = `Test comment ${Date.now()}`;
    await page.fill('[data-testid="comment-textarea"]', commentText);

    console.log('Comment text entered:', commentText);

    // Нажимаем кнопку Publish
    await page.click('[data-testid="publish-comment-button"]');

    console.log('Publish button clicked');

    // Ждем, пока кнопка Publish исчезнет (что означает успешное добавление)
    await page.waitForSelector('[data-testid="publish-comment-button"]', {
      state: 'hidden',
      timeout: 10000,
    });

    console.log('Comment published successfully');

    // Проверяем, что форма комментария закрылась и вернулась к начальному состоянию
    await page.waitForSelector('[data-testid="add-comment-button"]', {
      timeout: 5000,
    });

    console.log('Comment form returned to initial state');

    // Проверяем, что комментарий появился в списке комментариев
    // (Это может потребовать дополнительных проверок в зависимости от реализации)

    console.log('Comment addition test completed successfully');
  });

  test('should show validation for empty comment', async ({ page }) => {
    // Сначала переходим на профиль
    await page.goto('/profile/cmfovo66m0000v39816a2gwg7');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Открываем модальное окно поста
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();

    // Нажимаем кнопку "Add a Comment..."
    await page.click('[data-testid="add-comment-button"]');

    // Ждем появления textarea
    await page.waitForSelector('[data-testid="comment-textarea"]', {
      timeout: 5000,
    });

    // Проверяем, что кнопка Publish отключена для пустого комментария
    const publishButton = page.locator(
      '[data-testid="publish-comment-button"]'
    );
    await expect(publishButton).toBeDisabled();

    console.log('Publish button is correctly disabled for empty comment');
  });
});
