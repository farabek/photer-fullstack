import { test } from '@playwright/test';

test('Capture console logs for posts debugging', async ({ page }) => {
  // Собираем все консольные логи
  const logs: string[] = [];

  page.on('console', (msg) => {
    const logMessage = `[${msg.type()}] ${msg.text()}`;
    logs.push(logMessage);
    console.log(logMessage);
  });

  // Переходим на страницу
  await page.goto('/profile/cmfovo66m0000v39816a2gwg7');

  // Ждем загрузки контента
  await page.waitForTimeout(5000);

  // Ищем логи с информацией о постах
  const postsListLogs = logs.filter(log => log.includes('POSTS LIST DEBUG'));
  const postItemLogs = logs.filter(log => log.includes('POST ITEM DEBUG'));

  console.log('\n=== POSTS LIST LOGS ===');
  postsListLogs.forEach(log => console.log(log));

  console.log('\n=== POST ITEM LOGS ===');
  postItemLogs.forEach(log => console.log(log));

  console.log(`\nTotal logs captured: ${logs.length}`);
  console.log(`Posts list logs: ${postsListLogs.length}`);
  console.log(`Post item logs: ${postItemLogs.length}`);
});