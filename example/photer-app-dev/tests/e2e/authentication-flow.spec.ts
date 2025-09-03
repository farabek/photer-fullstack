import { test, expect } from '@playwright/test';

/**
 * 🧪 Полный E2E тест для flow аутентификации
 *
 * Этот тест покрывает весь процесс аутентификации:
 * 1. Переход на страницу входа
 * 2. Заполнение формы
 * 3. Отправка данных
 * 4. Состояние загрузки
 * 5. Переход на профиль
 * 6. Проверка Sidebar
 */

test.describe('🔐 Полный Flow Аутентификации', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу перед каждым тестом
    await page.goto('/');

    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');
  });

  test('✅ Успешный вход в систему с переходом на профиль', async ({
    page,
  }) => {
    // 1. Проверяем, что Sidebar виден на главной странице
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

    // 2. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 3. Проверяем, что Sidebar скрыт на странице входа
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();

    // 4. Заполняем форму входа
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');

    // 5. Нажимаем кнопку входа
    const signInButton = page.locator('button[type="submit"]');
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    // 6. Проверяем состояние загрузки
    await expect(page.locator('text=Вход в систему...')).toBeVisible();
    await expect(page.locator('[data-testid="spinner"]')).toBeVisible();

    // 7. Ждем завершения процесса входа (мокаем API ответ)
    await page.waitForTimeout(1000); // Имитируем время обработки

    // 8. Проверяем переход на профиль
    await expect(page).toHaveURL(/\/profile\/\d+/);

    // 9. Проверяем, что Sidebar снова виден
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

    // 10. Проверяем, что в Sidebar показывается кнопка "Log Out" для авторизованного пользователя
    await expect(page.locator('text=Log Out')).toBeVisible();
  });

  test('❌ Неуспешный вход с неверными данными', async ({ page }) => {
    // 1. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 2. Заполняем форму неверными данными
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // 3. Нажимаем кнопку входа
    const signInButton = page.locator('button[type="submit"]');
    await signInButton.click();

    // 4. Проверяем сообщение об ошибке
    await expect(
      page.locator('text=The email or password are incorrect. Try again please')
    ).toBeVisible();

    // 5. Проверяем, что кнопка снова активна
    await expect(signInButton).toBeEnabled();

    // 6. Проверяем, что мы остались на странице входа
    await expect(page).toHaveURL('/sign-in');
  });

  test('🔒 Валидация формы входа', async ({ page }) => {
    // 1. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 2. Пытаемся отправить пустую форму
    const signInButton = page.locator('button[type="submit"]');
    await signInButton.click();

    // 3. Проверяем, что кнопка заблокирована
    await expect(signInButton).toBeDisabled();

    // 4. Заполняем только email
    await page.fill('input[type="email"]', 'test@example.com');
    await expect(signInButton).toBeDisabled();

    // 5. Заполняем только password
    await page.clear('input[type="email"]');
    await page.fill('input[type="password"]', 'testpassword123');
    await expect(signInButton).toBeDisabled();

    // 6. Заполняем неверный формат email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'testpassword123');
    await expect(signInButton).toBeDisabled();

    // 7. Проверяем сообщения об ошибках валидации
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('🔄 Навигация между страницами аутентификации', async ({ page }) => {
    // 1. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 2. Переходим на страницу регистрации
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('/sign-up');

    // 3. Возвращаемся на страницу входа
    await page.goBack();
    await expect(page).toHaveURL('/sign-in');

    // 4. Переходим на страницу восстановления пароля
    await page.click('text=Forgot Password');
    await expect(page).toHaveURL('/forgot-password');

    // 5. Возвращаемся на главную страницу
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // 6. Проверяем, что Sidebar снова виден
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('📱 Адаптивность на мобильных устройствах', async ({ page }) => {
    // 1. Устанавливаем мобильный viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 3. Проверяем, что форма корректно отображается на мобильном
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 4. Проверяем, что OAuth ссылки видны
    await expect(page.locator('[data-testid="oauth-links"]')).toBeVisible();

    // 5. Возвращаемся на главную страницу
    await page.goto('/');

    // 6. Проверяем, что Sidebar корректно работает на мобильном
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('🎯 Проверка состояния загрузки и редиректа', async ({ page }) => {
    // 1. Переходим на страницу входа
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');

    // 2. Заполняем форму
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');

    // 3. Нажимаем кнопку входа
    const signInButton = page.locator('button[type="submit"]');
    await signInButton.click();

    // 4. Проверяем, что кнопка заблокирована во время загрузки
    await expect(signInButton).toBeDisabled();

    // 5. Проверяем отображение спиннера и сообщения
    await expect(page.locator('[data-testid="spinner"]')).toBeVisible();
    await expect(page.locator('text=Вход в систему...')).toBeVisible();

    // 6. Проверяем, что состояние загрузки сохраняется
    await page.waitForTimeout(500);
    await expect(page.locator('text=Вход в систему...')).toBeVisible();

    // 7. Имитируем успешный ответ API
    await page.waitForTimeout(1000);

    // 8. Проверяем переход на профиль
    await expect(page).toHaveURL(/\/profile\/\d+/);
  });
});

test.describe('🔍 Дополнительные сценарии', () => {
  test('🚪 Выход из системы', async ({ page }) => {
    // 1. Имитируем авторизованного пользователя (переходим на профиль)
    await page.goto('/profile/123');

    // 2. Проверяем, что Sidebar виден
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

    // 3. Нажимаем кнопку выхода
    await page.click('text=Log Out');

    // 4. Подтверждаем выход в модальном окне
    await page.click('text=Yes, Log Out');

    // 5. Проверяем, что произошел редирект на главную страницу
    await expect(page).toHaveURL('/');

    // 6. Проверяем, что в Sidebar показывается кнопка "Sign In"
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('🔐 Проверка защищенных маршрутов', async ({ page }) => {
    // 1. Пытаемся перейти на профиль без авторизации
    await page.goto('/profile/123');

    // 2. Проверяем, что произошел редирект на страницу входа
    await expect(page).toHaveURL('/sign-in');

    // 3. Проверяем, что Sidebar скрыт на странице входа
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();
  });
});
