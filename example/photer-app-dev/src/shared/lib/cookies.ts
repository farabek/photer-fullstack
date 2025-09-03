/**
 * Утилиты для работы с cookies
 * Поддерживает как клиентскую, так и серверную сторону
 *
 * Архитектура аутентификации:
 * - accessToken: обычный cookie (не httpOnly) - JavaScript может читать для Authorization header
 * - refreshToken: httpOnly cookie - защищен от XSS, используется только для обновления
 *
 * SSR совместимость:
 * - Cookies доступны как на клиенте, так и на сервере
 * - localStorage недоступен на сервере, поэтому используем cookies
 * - Функции безопасно работают в обеих средах
 */

/**
 * Получает значение cookie по имени
 * Работает как на клиенте, так и на сервере
 *
 * Использование:
 * - getCookie('accessToken') - получает токен для Authorization header
 * - getCookie('refreshToken') - не работает (httpOnly cookie)
 *
 * SSR безопасность:
 * - На сервере возвращает null (document недоступен)
 * - На клиенте читает из document.cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // Серверная сторона - document недоступен
    // Возвращаем null, что безопасно для SSR
    return null;
  }

  // Клиентская сторона - читаем из document.cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Устанавливает cookie
 * Работает только на клиенте
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') {
    // Серверная сторона - ничего не делаем
    return;
  }

  let cookieString = `${name}=${value}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Удаляет cookie
 * Работает только на клиенте
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') {
    // Серверная сторона - ничего не делаем
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * Проверяет, доступны ли cookies
 */
export function cookiesAvailable(): boolean {
  return typeof document !== 'undefined';
}
