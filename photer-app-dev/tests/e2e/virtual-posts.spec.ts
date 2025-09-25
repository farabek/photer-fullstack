import { test, expect } from '@playwright/test';

test.describe('Virtual Posts', () => {
  test('should display virtual posts with actual descriptions on homepage', async ({
    page,
  }) => {
    // Включаем логирование консоли для отладки
    page.on('console', (msg) => {
      console.log(`[VIRTUAL POSTS LOG] ${msg.text()}`);
    });

    // Переходим на главную страницу
    await page.goto('/');

    console.log('Navigated to homepage');

    // Ждем загрузки виртуальных постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    console.log('Virtual posts loaded');

    // Находим первый виртуальный пост
    const firstVirtualPost = page.locator('[data-testid="post-item"]').first();

    // Проверяем, что пост имеет описание (не пустое и не дефолтное)
    const postDescription = await firstVirtualPost
      .locator('[data-testid="post-description"]')
      .textContent();

    console.log('Virtual post description:', postDescription);

    // Проверяем, что описание не является дефолтным "Фото пользователя"
    expect(postDescription).not.toContain('Фото пользователя');
    expect(postDescription).toBeTruthy();
    expect(postDescription?.length).toBeGreaterThan(0);

    console.log('✅ Virtual post description test passed!');
  });

  test('should open virtual posts without API errors for unauthorized users', async ({
    page,
  }) => {
    // Переходим на главную страницу без авторизации
    await page.goto('/');

    console.log('Navigated to homepage as unauthorized user');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост
    const firstPost = page.locator('[data-testid="post-item"]').first();

    // Кликаем на пост
    await firstPost.click();

    console.log('Clicked on virtual post');

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    console.log('Post modal opened successfully');

    // Проверяем, что нет ошибки в консоли
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Ждем немного, чтобы убедиться, что нет ошибок
    await page.waitForTimeout(2000);

    // Проверяем, что не было ошибок API
    const apiErrors = errors.filter(
      (error) =>
        error.includes('404') ||
        error.includes('Failed to fetch') ||
        error.includes('Network Error')
    );

    expect(apiErrors.length).toBe(0);

    console.log('✅ Virtual post opening test passed!');
  });

  test('should hide edit/delete buttons for virtual posts from homepage', async ({
    page,
  }) => {
    // Переходим на главную страницу
    await page.goto('/');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост и открываем его
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    console.log('Post modal opened');

    // Проверяем, что кнопки редактирования и удаления отсутствуют
    const editButton = page
      .locator('[data-testid="post-menu"]')
      .locator('..')
      .locator('text=Edit post');
    const deleteButton = page
      .locator('[data-testid="post-menu"]')
      .locator('..')
      .locator('text=Delete post');

    await expect(editButton).not.toBeVisible();
    await expect(deleteButton).not.toBeVisible();

    console.log('✅ Virtual post buttons test passed!');
  });

  test('should show comments and edit options for virtual posts from profile', async ({
    page,
  }) => {
    // Переходим на профиль с виртуальными постами
    await page.goto('/profile/cmfwdqntwf0000v3fcpfhx9epq');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост (виртуальный пост с профиля)
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    // Проверяем, что кнопка редактирования присутствует (для виртуального поста с профиля)
    const editButton = page
      .locator('[data-testid="post-menu"]')
      .locator('..')
      .locator('text=Edit post');
    await expect(editButton).toBeVisible();

    console.log('✅ Profile virtual post edit button test passed!');
  });

  test('should prevent editing virtual posts from homepage', async ({
    page,
  }) => {
    // Переходим на главную страницу
    await page.goto('/');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

    // Находим первый пост и открываем его
    const firstPost = page.locator('[data-testid="post-item"]').first();
    await firstPost.click();

    // Ждем открытия модального окна
    await page.waitForSelector('[data-testid="post-menu"]', { timeout: 5000 });

    // Проверяем, что меню поста отсутствует или не содержит опций редактирования
    const postMenu = page.locator('[data-testid="post-menu"]');
    await expect(postMenu).not.toBeVisible();

    console.log('✅ Prevent virtual post editing test passed!');
  });
});
