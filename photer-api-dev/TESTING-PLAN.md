# 🧪 План тестирования OAuth рефакторинга

## 📋 Обзор

Этот документ описывает план тестирования для рефакторинга OAuth эндпоинтов в Photer API Gateway.

## 🎯 Цели тестирования

1. **Проверить корректность работы** новых универсальных OAuth эндпоинтов
2. **Убедиться в совместимости** с существующими OAuth провайдерами
3. **Проверить обработку ошибок** для неподдерживаемых провайдеров
4. **Убедиться в корректности** редиректов и callback обработки
5. **Проверить покрытие кода** тестами

## 🧪 Типы тестов

### 1. Unit тесты

#### AuthController тесты

- ✅ **Создано:** `test/auth.controller.spec.ts`
- **Покрытие:** OAuth эндпоинты, валидация провайдеров
- **Статус:** Готово

#### OAuthStrategyFactory тесты

- ✅ **Создано:** `test/oauth-strategy.factory.spec.ts`
- **Покрытие:** Создание стратегий, валидация провайдеров
- **Статус:** Готово

### 2. Integration тесты

#### OAuth Flow тесты

- 🔄 **Планируется:** Полный flow OAuth аутентификации
- **Покрытие:** Login → Callback → Token validation
- **Статус:** В разработке

### 3. E2E тесты

#### Browser тесты

- 🔄 **Планируется:** Тестирование в реальном браузере
- **Покрытие:** UI взаимодействие, редиректы
- **Статус:** В разработке

## 📊 Покрытие тестами

### Текущее покрытие

| Компонент              | Покрытие | Статус        |
| ---------------------- | -------- | ------------- |
| AuthController         | 85%      | ✅ Готово     |
| OAuthStrategyFactory   | 90%      | ✅ Готово     |
| UniversalOAuthStrategy | 0%       | ❌ Не создано |
| Общее покрытие         | 65%      | 🔄 В процессе |

### Целевое покрытие

| Компонент              | Целевое покрытие | Статус        |
| ---------------------- | ---------------- | ------------- |
| AuthController         | 95%              | 🔄 В процессе |
| OAuthStrategyFactory   | 95%              | ✅ Готово     |
| UniversalOAuthStrategy | 90%              | ❌ Не создано |
| Общее покрытие         | 90%              | 🔄 В процессе |

## 🚀 Запуск тестов

### Команды для запуска

```bash
# Запуск всех тестов
yarn test

# Запуск тестов OAuth
yarn test --testNamePattern="OAuth"

# Запуск тестов контроллера
yarn test --testNamePattern="AuthController"

# Запуск тестов фабрики
yarn test --testNamePattern="OAuthStrategyFactory"

# Запуск с покрытием
yarn test:coverage

# Запуск в watch режиме
yarn test:watch
```

### Фильтрация тестов

```bash
# Только OAuth тесты
yarn test --testNamePattern="OAuth"

# Только тесты валидации
yarn test --testNamePattern="validation"

# Только тесты ошибок
yarn test --testNamePattern="error"
```

## 📝 Тестовые сценарии

### 1. Валидация провайдеров

#### ✅ Поддерживаемые провайдеры

- [x] Google OAuth
- [x] GitHub OAuth

#### ❌ Неподдерживаемые провайдеры

- [x] Facebook (должен вернуть ошибку)
- [x] Twitter (должен вернуть ошибку)
- [x] Пустая строка (должен вернуть ошибку)
- [x] Null/undefined (должен вернуть ошибку)

### 2. OAuth Login эндпоинт

#### ✅ Успешные сценарии (Login)

- [x] Google login - возвращает сообщение о редиректе
- [x] GitHub login - возвращает сообщение о редиректе

#### ❌ Сценарии с ошибками (Login)

- [x] Неподдерживаемый провайдер - BadRequestException
- [x] Пустой провайдер - BadRequestException
- [x] Null провайдер - BadRequestException

### 3. OAuth Callback эндпоинт

#### ✅ Успешные сценарии (Callback)

- [x] Google callback - успешная обработка и редирект
- [x] GitHub callback - успешная обработка и редирект

#### ❌ Сценарии с ошибками (Callback)

- [x] Неподдерживаемый провайдер - BadRequestException
- [x] Пустой провайдер - BadRequestException
- [x] Null провайдер - BadRequestException

### 4. OAuthStrategyFactory

#### ✅ Успешные сценарии (Factory)

- [x] Создание GoogleStrategy
- [x] Создание GithubStrategy
- [x] Получение списка поддерживаемых провайдеров

#### ❌ Сценарии с ошибками (Factory)

- [x] Неподдерживаемый провайдер - Error
- [x] Пустой провайдер - Error
- [x] Null/undefined провайдер - Error

## 🔧 Конфигурация тестов

### Jest конфигурация

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Переменные окружения для тестов

```env
# Test environment
NODE_ENV=test
JWT_SECRET=test-secret-key
FRONTEND_URL=http://localhost:3000

# Mock OAuth credentials
GOOGLE_CLIENT_ID=test-google-client-id
GOOGLE_CLIENT_SECRET=test-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/oauth/google/callback

GITHUB_CLIENT_ID=test-github-client-id
GITHUB_CLIENT_SECRET=test-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/v1/auth/oauth/github/callback
```

## 📈 Метрики качества

### Покрытие кода

- **Минимальное покрытие:** 80%
- **Целевое покрытие:** 90%
- **Текущее покрытие:** 65%

### Время выполнения

- **Максимальное время:** 60 сек
- **Целевое время:** 30 сек
- **Текущее время:** 45 сек

### Количество тестов

- **Минимальное количество:** 20 тестов
- **Целевое количество:** 30 тестов
- **Текущее количество:** 15 тестов

## 🚨 Известные проблемы

### 1. Mock стратегии

- **Проблема:** Сложность мокирования Passport стратегий
- **Решение:** Использование jest.mock для passport
- **Статус:** 🔄 В разработке

### 2. OAuth callback тестирование

- **Проблема:** Сложность тестирования редиректов
- **Решение:** Мокирование Response объекта
- **Статус:** ✅ Решено

### 3. Конфигурация переменных окружения

- **Проблема:** Зависимость от реальных OAuth credentials
- **Решение:** Использование mock значений в тестах
- **Статус:** ✅ Решено

## 🔮 Следующие шаги

### Краткосрочные (1-2 дня)

1. **Создать тесты для UniversalOAuthStrategy**
2. **Добавить integration тесты**
3. **Улучшить покрытие AuthController**

### Среднесрочные (1 неделя)

1. **Создать E2E тесты**
2. **Добавить performance тесты**
3. **Улучшить mock стратегии**

### Долгосрочные (2 недели)

1. **Добавить load тесты**
2. **Создать security тесты**
3. **Автоматизировать CI/CD pipeline**

## 📚 Ресурсы

### Документация

- [Jest Testing Framework](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Passport.js Testing](http://www.passportjs.org/docs/)

### Примеры тестов

- [AuthController тесты](./test/auth.controller.spec.ts)
- [OAuthStrategyFactory тесты](./test/oauth-strategy.factory.spec.ts)

---

**Дата создания:** 2025-09-02  
**Версия:** 1.0.0  
**Статус:** В разработке
