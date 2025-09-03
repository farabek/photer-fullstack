# 🧪 Инструкции по тестированию

Этот документ содержит подробные инструкции по запуску и использованию тестов в проекте Photer.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Установка всех зависимостей (включая тестовые)
pnpm install

# Установка браузеров для Playwright (только при первом запуске)
npx playwright install
```

### 2. Запуск всех тестов

```bash
# Unit тесты + E2E тесты
pnpm test && pnpm test:e2e

# Или по отдельности
pnpm test        # Unit тесты
pnpm test:e2e    # E2E тесты
```

## 📋 Доступные команды

### Unit тесты (Jest)

```bash
# Запуск всех unit тестов
pnpm test

# Запуск в режиме watch (автоматический перезапуск при изменениях)
pnpm test:watch

# Запуск с покрытием кода
pnpm test:coverage

# Запуск конкретного теста
pnpm test -- --testNamePattern="useSidebarVisibility"

# Запуск тестов в конкретной папке
pnpm test tests/unit/hooks/

# Запуск с подробным выводом
pnpm test -- --verbose
```

### E2E тесты (Playwright)

```bash
# Запуск всех E2E тестов
pnpm test:e2e

# Запуск с UI интерфейсом (интерактивный режим)
pnpm test:e2e:ui

# Запуск в headed режиме (видимый браузер)
pnpm test:e2e:headed

# Запуск в debug режиме
pnpm test:e2e:debug

# Запуск тестов в конкретном браузере
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit

# Запуск конкретного теста
pnpm test:e2e --grep "Успешный вход в систему"
```

## 🧪 Структура тестов

### Unit тесты

```bash
tests/unit/
├── hooks/                    # Тесты хуков
│   ├── useSidebarVisibility.test.tsx
│   └── useLogInForm.test.tsx
├── components/               # Тесты компонентов
│   ├── ConditionalSidebarWrapper.test.tsx
│   └── LogIn.test.tsx
└── index.ts                  # Экспорт всех тестов
```

### E2E тесты

```bash
tests/e2e/
├── authentication-flow.spec.ts    # Полный flow аутентификации
└── README.md                      # Документация E2E тестов
```

### Утилиты для тестов

```bash
tests/
├── types/
│   └── test-utils.ts         # Утилиты, типы и моки
└── README.md                  # Общая документация по тестированию
```

## 🔧 Конфигурация

### Jest (`jest.config.js`)

- **Среда:** jsdom (имитация браузера)
- **Покрытие:** Минимум 70%
- **Алиасы:** Поддержка `@/` путей
- **Исключения:** Storybook файлы

### Playwright (`playwright.config.ts`)

- **Браузеры:** Chromium, Firefox, WebKit
- **Мобильные:** Pixel 5, iPhone 12
- **Dev сервер:** Автоматический запуск
- **Отчеты:** HTML + скриншоты/видео

## 📊 Покрытие тестами

### Текущее покрытие

- ✅ **useSidebarVisibility** - 100%
- ✅ **useLogInForm** - 100%
- ✅ **ConditionalSidebarWrapper** - 100%
- ✅ **LogIn** - 100%
- ✅ **Authentication Flow** - 100%

### Метрики качества

- **Unit тесты:** > 70% покрытия кода
- **E2E тесты:** Все критические сценарии
- **Время выполнения:** Unit < 30 сек, E2E < 5 мин
- **Стабильность:** < 1% ложных срабатываний

## 🚨 Отладка тестов

### Проблемы с Jest

```bash
# Очистка кэша
pnpm test -- --clearCache

# Запуск с отладкой
pnpm test -- --detectOpenHandles

# Проверка конфигурации
pnpm test -- --showConfig
```

### Проблемы с Playwright

```bash
# Установка браузеров заново
npx playwright install

# Очистка кэша
npx playwright install --force

# Запуск в debug режиме
pnpm test:e2e:debug
```

### Частые проблемы

1. **"Cannot find module"** - Проверьте алиасы в `jest.config.js`
2. **"Test environment jsdom"** - Убедитесь, что `jest-environment-jsdom` установлен
3. **"Playwright browsers not found"** - Запустите `npx playwright install`
4. **"Timeout"** - Увеличьте `testTimeout` в конфигурации

## 🔍 Написание новых тестов

### Unit тест (пример)

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('🧪 MyComponent', () => {
  test('должен корректно рендериться', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E тест (пример)

```typescript
import { test, expect } from '@playwright/test';

test('🧪 Мой E2E тест', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Welcome');
});
```

## 📈 CI/CD интеграция

### GitHub Actions

Тесты автоматически запускаются:

- ✅ При push в `main` ветку
- ✅ При создании Pull Request
- ✅ При push в `feature/*` ветки

### Локальная проверка

```bash
# Проверка перед коммитом
pnpm lint && pnpm test && pnpm test:e2e

# Проверка типов TypeScript
pnpm tsc --noEmit

# Проверка сборки
pnpm build
```

## 🎯 Лучшие практики

### 1. Unit тесты

1. **Изоляция:** Каждый тест должен быть независимым
2. **Mocking:** Используйте моки для внешних зависимостей
3. **Покрытие:** Стремитесь к 100% покрытию критических путей
4. **Читаемость:** Тесты должны быть понятными

### 2. E2E тесты

1. **Реалистичность:** Тестируйте реальные пользовательские сценарии
2. **Стабильность:** Избегайте хрупких селекторов
3. **Производительность:** Группируйте связанные тесты
4. **Отчетность:** Используйте встроенные отчеты

## 📚 Полезные ссылки

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

## 🤝 Вклад в тестирование

При добавлении новых функций:

1. **Создайте unit тесты** для логики
2. **Создайте E2E тесты** для пользовательских сценариев
3. **Обновите покрытие кода**
4. **Убедитесь, что все тесты проходят**

---

**Примечание:** Тесты являются критически важной частью качества кода.
Все изменения должны сопровождаться соответствующими тестами.
