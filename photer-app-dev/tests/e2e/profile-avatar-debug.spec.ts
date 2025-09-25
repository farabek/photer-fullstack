import { test, expect } from '@playwright/test';

test.describe('Profile Avatar Debug', () => {
  test('should visually inspect profile page with avatar issue', async ({ page }) => {
    // Переходим на страницу профиля с проблемой
    await page.goto('/profile/cmfovo66m0000v39816a2gwg7');

    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');

    // Ждем загрузки компонента профиля
    await page.waitForSelector('[data-testid="profile-card"], .flex.gap-9', { timeout: 10000 });

    // Делаем скриншот всей страницы для анализа
    await page.screenshot({
      path: 'tests/e2e/screenshots/profile-page-full.png',
      fullPage: true
    });

    // Делаем скриншот только области профиля
    const profileArea = page.locator('.flex.gap-9').first();
    await profileArea.screenshot({
      path: 'tests/e2e/screenshots/profile-area.png'
    });

    // Проверяем наличие аватара
    const avatarImage = page.locator('img[alt="avatar"]');
    await expect(avatarImage).toBeVisible();

    // Делаем скриншот аватара
    await avatarImage.screenshot({
      path: 'tests/e2e/screenshots/avatar-element.png'
    });

    // Получаем src аватара для анализа
    const avatarSrc = await avatarImage.getAttribute('src');
    console.log('Avatar src:', avatarSrc);

    // Проверяем, загружается ли изображение
    const avatarResponse = await page.evaluate(async (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ loaded: true, width: img.width, height: img.height });
        img.onerror = () => resolve({ loaded: false, error: 'Failed to load' });
        img.src = src;
      });
    }, avatarSrc);

    console.log('Avatar load result:', avatarResponse);

    // Проверяем счетчики публикаций
    const publicationsText = page.locator('text=Publications').locator('..').locator('strong');
    const publicationsCount = await publicationsText.textContent();
    console.log('Publications count:', publicationsCount);

    // Проверяем, что счетчик не равен 0
    expect(publicationsCount).not.toBe('0');

    // Проверяем наличие постов на странице
    const posts = page.locator('[data-testid="post-item"], .post-item');
    const postsCount = await posts.count();
    console.log('Visible posts count:', postsCount);

    // Делаем финальный скриншот со всеми данными
    await page.screenshot({
      path: 'tests/e2e/screenshots/profile-final-state.png',
      fullPage: true
    });
  });

  test('should capture console logs for debugging', async ({ page }) => {
    // Собираем все консольные логи
    const logs: string[] = [];

    page.on('console', (msg) => {
      const logMessage = `[${msg.type()}] ${msg.text()}`;
      logs.push(logMessage);
      console.log(logMessage);
    });

    // Переходим на страницу
    await page.goto('/profile/cmfovo66m0000v39816a2gwg7');
    await page.waitForLoadState('networkidle');

    // Ждем немного для всех логов
    await page.waitForTimeout(3000);

    // Сохраняем логи в файл для анализа
    const fs = require('fs');
    const path = require('path');

    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(logsDir, 'profile-console-logs.txt'),
      logs.join('\n'),
      'utf8'
    );

    console.log(`Captured ${logs.length} console messages`);
  });
});