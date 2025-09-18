import { test, expect } from '@playwright/test';

// Скриншоты вкладок Profile Settings: Devices и Account Management
// Тест:
// 1) Переходит на профиль (или /profile/123)
// 2) Открывает модалку Profile Settings
// 3) Переключается на вкладку Devices, мокает /security/devices и делает скрин
// 4) Переключается на вкладку Account Management и делает скрин

test.describe('📸 Profile Settings screenshots', () => {
  test('Devices and Account Management', async ({ page }) => {
    // 1. Открываем страницу профиля (используем существующий SSR маршрут)
    await page.goto('/profile/123');
    await page.waitForLoadState('networkidle');

    // 2. Открываем модалку настроек профиля через кнопку Profile Settings
    await page.getByRole('button', { name: 'Profile Settings' }).click();

    // 3. Переключаемся на вкладку Devices
    await page.getByRole('button', { name: 'Devices' }).click();

    // Мокаем список устройств, чтобы скрин был стабильным
    await page.route('**/security/devices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            deviceId: 'current-device',
            title: 'Chrome on Windows',
            lastActiveDate: new Date().toISOString(),
            ip: '22.345.345.12',
          },
          {
            deviceId: 'device-2',
            title: 'Apple iMac 27',
            lastActiveDate: '2022-09-22T00:00:00.000Z',
            ip: '22.345.345.12',
          },
        ]),
      });
    });

    // Ждём загрузки Devices (текстовые маркеры из верстки)
    await expect(page.getByText('Current device')).toBeVisible();
    await expect(page.getByText('Active sessions')).toBeVisible();

    // Делаем скриншот области модалки (по текстовому якорю)
    const devicesSection = page.locator('text=Active sessions').first();
    await devicesSection.screenshot({
      path: 'screenshots/profile-settings-devices.png',
    });

    // 4. Переключаемся на вкладку Account Management и снимаем скрин
    await page.getByRole('button', { name: 'Account Management' }).click();
    await expect(page.getByText('Account type:')).toBeVisible();

    const accountSection = page.getByText('Your subscription costs:');
    await accountSection.screenshot({
      path: 'screenshots/profile-settings-account-management.png',
    });
  });
});
