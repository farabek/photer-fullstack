import { test, expect } from '@playwright/test';

test('Visual verification that posts are now displaying correctly', async ({ page }) => {
  // Переходим на страницу профиля
  await page.goto('/profile/cmfovo66m0000v39816a2gwg7');

  // Ждем загрузки
  await page.waitForLoadState('networkidle');

  // Ждем появления постов
  await page.waitForSelector('img[alt="post image"]', { timeout: 10000 });

  // Проверяем, что есть изображения постов
  const postImages = page.locator('img[alt="post image"]');
  const count = await postImages.count();

  console.log(`Found ${count} post images`);
  expect(count).toBeGreaterThan(0);

  // Делаем скриншот для проверки
  await page.screenshot({
    path: 'tests/e2e/screenshots/posts-working.png',
    fullPage: true
  });

  // Проверяем, что счетчик публикаций показывает 2
  const publicationsText = page.locator('text=Publications').locator('..').locator('strong');
  const publicationsCount = await publicationsText.textContent();
  console.log('Publications count:', publicationsCount);
  expect(publicationsCount).toBe('2');

  console.log('✅ Posts are now displaying correctly!');
});