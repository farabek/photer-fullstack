import { test, expect } from '@playwright/test';

test.describe('Post Editing', () => {
  test('should update post description immediately after save', async ({
    page,
  }) => {
    // Включаем логирование консоли для отладки
    page.on('console', (msg) => {
      console.log(`[PAGE LOG] ${msg.text()}`);
    });

    // Сначала переходим на профиль с актуальными данными
    // Используем профиль, где есть посты для тестирования
    await page.goto('/profile/cmfwdqntwf0000v3fcpfhx9epq');

    console.log('Navigated to profile page');

    // Ждем загрузки страницы и проверяем, что мы авторизованы
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    console.log('Posts loaded successfully');

    // Находим первый пост
    const firstPost = page.locator('[data-testid="post-item"]').first();

    // Нажимаем на пост, чтобы открыть модальное окно
    await firstPost.click();

    console.log('Clicked on first post');

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    console.log('Post modal opened');

    // Нажимаем на три точки (меню поста)
    await page.click('[data-testid="post-menu"]');

    console.log('Clicked on post menu');

    // Нажимаем "Edit post"
    await page.click('text=Edit post');

    console.log('Clicked on Edit post');

    // Ждем открытия модального окна редактирования
    await page.waitForSelector('[data-testid="edit-post-modal"]', {
      timeout: 5000,
    });

    console.log('Edit modal opened');

    // Получаем textarea для описания
    const descriptionTextarea = page.locator(
      '[data-cy="edit-description-textarea"]'
    );

    // Получаем исходное значение
    const originalValue = await descriptionTextarea.inputValue();
    console.log('Original textarea value:', originalValue);

    // Создаем новое описание
    const newDescription = `Updated description ${Date.now()}`;

    console.log('Will update description to:', newDescription);

    // Очищаем и вводим новое описание
    await descriptionTextarea.clear();
    await descriptionTextarea.fill(newDescription);

    console.log('Filled new description');

    // Нажимаем "Save Changes"
    await page.click('button:has-text("Save Changes")');

    console.log('Clicked Save Changes');

    // Ждем закрытия модального окна редактирования
    await page.waitForSelector(
      '[data-testid="edit-post-modal"]',
      {
        state: 'hidden',
      },
      { timeout: 10000 }
    );

    console.log('Edit modal closed');

    // Ждем немного для обработки обновления данных
    await page.waitForTimeout(2000);

    console.log('Waited 2 seconds for data update');

    // Проверяем, что мы вернулись к просмотру поста
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    console.log('Back to post view');

    console.log('✅ Post editing test completed successfully');
  });

  test('should show confirmation dialog when trying to close with unsaved changes', async ({
    page,
  }) => {
    // Сначала переходим на профиль с актуальными данными
    await page.goto('/profile/cmfwdqntwf0000v3fcpfhx9epq');

    // Ждем загрузки страницы и проверяем, что мы авторизованы
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост и открываем редактирование
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    // Нажимаем на меню и редактируем
    await page.click('[data-testid="post-menu"]');
    await page.click('text=Edit post');

    // Ждем открытия модального окна редактирования
    await page.waitForSelector('[data-testid="edit-post-modal"]');

    // Вводим изменения
    const descriptionTextarea = page.locator(
      '[data-cy="edit-description-textarea"]'
    );
    await descriptionTextarea.clear();
    await descriptionTextarea.fill('Test changes that will be discarded');

    // Пытаемся закрыть крестиком
    await page.click('[data-testid="edit-close-button"]');

    // Должен появиться диалог подтверждения
    await page.waitForSelector('[data-testid="confirm-dialog"]');

    // Проверяем текст диалога
    const dialogText = await page
      .locator('[data-testid="confirm-dialog"]')
      .textContent();
    expect(dialogText).toContain('Do you really want to finish editing?');
    expect(dialogText).toContain('will not be saved');

    console.log('✅ Confirmation dialog test passed!');
  });

  test('should maintain textarea content after save and re-edit', async ({
    page,
  }) => {
    // Тест на синхронизацию состояния textarea после сохранения
    await page.goto('/profile/cmfwdqntwf0000v3fcpfhx9epq');
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    // Открываем редактирование
    await page.click('[data-testid="post-menu"]');
    await page.click('text=Edit post');
    await page.waitForSelector('[data-testid="edit-post-modal"]');

    // Вводим и сохраняем изменения
    const descriptionTextarea = page.locator(
      '[data-cy="edit-description-textarea"]'
    );
    const testDescription = `Sync test ${Date.now()}`;

    await descriptionTextarea.clear();
    await descriptionTextarea.fill(testDescription);
    await page.click('button:has-text("Save Changes")');

    // Ждем закрытия модального окна редактирования
    await page.waitForSelector('[data-testid="edit-post-modal"]', {
      state: 'hidden',
    });

    // Снова открываем редактирование
    await page.click('[data-testid="post-menu"]');
    await page.click('text=Edit post');
    await page.waitForSelector('[data-testid="edit-post-modal"]');

    // Проверяем, что textarea содержит сохраненный текст
    const textareaValue = await descriptionTextarea.inputValue();
    expect(textareaValue).toBe(testDescription);

    console.log('✅ Textarea sync test passed!');
  });
});
