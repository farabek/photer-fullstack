# Архитектура аутентификации

## Обзор

Система аутентификации использует **гибридный подход с cookies** для обеспечения
безопасности и совместимости с SSR (Server-Side Rendering).

## Архитектура токенов

### accessToken

- **Тип**: Обычный cookie (не httpOnly)
- **Срок жизни**: 5 минут (по умолчанию)
- **Переменная окружения**: `JWT_ACCESS_EXPIRATION_TIME` (дефолт: '5m')
- **Назначение**: Используется для API запросов
- **Почему не httpOnly**: JavaScript должен читать токен для добавления в Authorization header

### refreshToken

- **Тип**: httpOnly cookie
- **Срок жизни**: 7 дней (по умолчанию)
- **Переменная окружения**: `JWT_REFRESH_EXPIRATION_TIME` (дефолт: '7d')
- **Назначение**: Используется только для обновления accessToken
- **Почему httpOnly**: Защищен от XSS атак

## Почему accessToken не httpOnly?

### Проблема с httpOnly

```javascript
// ❌ Не работает
res.cookie('accessToken', token, { httpOnly: true });
// Frontend не может прочитать токен
const token = getCookie('accessToken'); // null
// Результат: 401 Unauthorized
```

### Решение с обычным cookie

```javascript
// ✅ Работает
res.cookie('accessToken', token, { httpOnly: false });
// Frontend может прочитать токен
const token = getCookie('accessToken'); // работает
// Добавляет Authorization header
headers.set('Authorization', `Bearer ${token}`);
```

## Безопасность

### Защитные механизмы

1. **Короткий срок жизни accessToken** (5 мин) - даже если украдут, быстро истечет
2. **Автоматическое обновление** - refreshToken автоматически обновляет accessToken
3. **secure и sameSite флаги** - защита от перехвата и CSRF атак
4. **refreshToken в httpOnly** - защищен от XSS атак
5. **Проактивное обновление** - токен обновляется за 12 секунд до истечения

### SSR совместимость

- **Cookies работают на сервере** - в отличие от localStorage
- **Безопасные функции** - проверяют доступность document
- **Автоматическое управление** - backend устанавливает и обновляет cookies

## Логика работы

### 1. Вход в систему

```javascript
POST / auth / login;
// Backend устанавливает оба cookie
// Frontend получает accessToken в теле ответа
```

### 2. API запросы

```javascript
GET / auth / me;
// baseQuery читает accessToken из cookie
// Добавляет Authorization: Bearer <token>
```

### 3. Обновление токенов

#### Проактивное обновление (AuthInitializer)

```javascript
// Токен обновляется автоматически за 12 секунд до истечения
const leadMs = 12_000; // 12 секунд до истечения
setTimeout(() => {
  fetch('/auth/refresh-token', { credentials: 'include' });
}, delay);
```

#### Реактивное обновление (baseQuery)

```javascript
// Если accessToken истек (401)
POST / auth / refresh - token;
// refreshToken автоматически отправляется в httpOnly cookie
// Backend возвращает новый accessToken
// Устанавливает новый accessToken в обычный cookie
```

### 4. Выход из системы

```javascript
POST / auth / logout;
// Очищает все cookies
// Сбрасывает состояние RTK Query
```

## Файлы архитектуры

### Frontend

- `src/shared/providers/AuthInitializer.tsx` - Проактивное обновление токенов
- `src/shared/lib/baseQuery.ts` - Реактивное обновление токенов при 401 ошибках
- `src/shared/lib/cookies.ts` - Утилиты для работы с cookies
- `src/features/auth/api/authApi.ts` - API endpoints для аутентификации

### Backend

- `apps/gateway/src/auth/auth.controller.ts` - Контроллер аутентификации
- `apps/gateway/src/auth/auth.service.ts` - Сервис аутентификации

## Преимущества

1. **SSR совместимость** - cookies доступны на сервере
2. **Безопасность** - refreshToken защищен httpOnly
3. **Автоматическое управление** - система сама обновляет токены
4. **Простота** - не нужно вручную управлять токенами
5. **Совместимость** - работает с существующими API

## Альтернативы

### localStorage (не подходит для SSR)

```javascript
// ❌ Не работает на сервере
localStorage.setItem('accessToken', token);
```

### Только httpOnly (проблематично)

```javascript
// ❌ JavaScript не может читать
res.cookie('accessToken', token, { httpOnly: true });
```

### Наш гибридный подход (рекомендуемый)

```javascript
// ✅ Оптимальное решение
// accessToken - обычный cookie для JavaScript
// refreshToken - httpOnly для безопасности
```
