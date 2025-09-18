# ТЗ: Платный аккаунт — Stripe, PayPal

## Обзор

Реализованы UX‑потоки и интеграции для покупки платного аккаунта и управления автопродлением,
а также просмотр истории платежей. Поддержаны Stripe и (опционально) PayPal.

---

## Реализованные сценарии

### UC‑1. Покупка платного аккаунта (Stripe/PayPal)

- Отображение вкладки `Account Management` с выбором:
  - **Account type**: Personal (по умолчанию), Business.
  - **Your subscription costs**: $10 per 1 Day, $50 per 7 Day, $100 per month.
- Кнопки оплаты: **PayPal**, **Stripe** активны только при `Business` и выбранном плане.
- Модальное окно перед оплатой:
  - Текст: “Auto-renewal will be enabled…”.
  - Чекбокс **Agree** (без него кнопка OK недоступна).
  - Для PayPal показывается предупреждение о необходимости billing agreements.
- После OK выполняется `POST /subscriptions` и редирект на URL провайдера.

### UC‑2. Отмена автопродления

- Блок **Current Subscription**:
  - Поле Expire at (дата из бэка).
  - Чекбокс **Auto‑Renewal**:
    - Включение → `POST /subscriptions/enable-auto-renewal`
    - Выключение → `POST /subscriptions/cancel-auto-renewal`
  - Если у пользователя нет активной подписки, бэк вернёт 404 — UI может показать уведомление.

### UC‑3. Покупка дополнительной подписки

- Повтор покупки плана на вкладке `Account Management`.
- Новая подписка создаётся после оплаты (с автопродлением для последней).
- Блок Current Subscription отображает актуальные данные из `GET /subscriptions` (последняя, status/validUntil).

### UC‑4. Просмотр “My payments”

- Таблица “My payments” подключена к `GET /subscriptions/my-payments`:
  - Колонки: Date of Payment, End date of subscription, Price, Subscription Type, Payment Type (иконки Stripe/PayPal).
  - Пагинация, переключатель “Show N on page”.

---

## API

- База для dev: `/api/v1` (проксируется на `http://localhost:3001/api/v1` через `next.config.ts`).
- Авторизация: `Authorization: Bearer <accessToken>` добавляется автоматически в `baseQueryWithReauth`.

### Подписки

- `POST /subscriptions`

  - Body:
    - `subscriptionPeriod`: DAILY | WEEKLY | MONTHLY
    - `paymentProvider`: STRIPE | PAYPAL | PAYME
    - `baseUrl`: `window.location.origin`
  - Возвращает `{ url }` для редиректа на провайдера.

- `GET /subscriptions`

  - Параметры: `pageNumber`, `pageSize`, `sortDirection`, `sortBy` (по умолчанию `createdAt desc`).

- `POST /subscriptions/enable-auto-renewal` — включает автопродление.
- `POST /subscriptions/cancel-auto-renewal` — выключает автопродление.

### Платежи

- `GET /subscriptions/my-payments`
  - Параметры: `pageNumber`, `pageSize`, `sortDirection`, `sortBy` (по умолчанию `dateOfPayment desc`).

### Маппинг планов (UI → API)

- Day → `DAILY`
- Week → `WEEKLY`
- Month → `MONTHLY`

---

## Фронтенд: ключевые файлы

- Вкладки настроек профиля:

  - `src/features/edit-profile/EditProfile.tsx`
  - `src/features/edit-profile/profile-tabs/ProfileTabs.tsx`

- Account Management:

  - `src/features/edit-profile/account-management/AccountManagement.tsx`
    - Блок Current Subscription + чекбокс Auto‑Renewal.
    - Выбор Account Type, плана, модальное подтверждение, запуск оплаты.
    - Предупреждение для PayPal (billing agreements).
  - API: `src/features/edit-profile/api/subscriptionsApi.ts`
    - `createSubscription`, `getSubscriptions`, `getMyPayments`,
      `enableAutoRenewal`, `cancelAutoRenewal`.
    - Поддержан провайдер Payme (включается фиче‑флагом `NEXT_PUBLIC_ENABLE_PAYME`).

- My payments:

  - `src/features/edit-profile/my-payments/MyPayments.tsx`
    - Таблица + пагинация, подключение к API.

- Devices (для полноты раздела настроек):

  - `src/features/edit-profile/devices/Devices.tsx` (список сессий/устройств, завершение).

- База RTK Query:

  - `src/shared/lib/baseApi.ts` (`tagTypes` и базовая конфигурация).
  - `src/shared/lib/baseQuery.ts` (baseUrl, прокси, `Authorization`, refresh‑логика).

- Модальные окна:

  - `src/widgets/modal/Modal.tsx`

- Логи:
  - `src/shared/lib/appLogger.ts` (оставлены диагностические события кликов и состояний).

---

## UX/тексты в UI

- Модальное подтверждение перед оплатой:
  - “Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings”
  - PayPal заметка:
    - “To use auto-renewal with PayPal you must have a PayPal account with billing agreements enabled.”
- Сообщения об ошибке/успехе:
  - (план) после возврата с провайдера: “Payment was successful!” / “Transaction failed, please try again”.

---

## Как проверить вручную (dev)

1. Запуск фронтенда: `pnpm dev`
2. Авторизоваться (получить `accessToken` cookie).
3. Открыть Profile → Profile Settings → вкладка Account Management.
4. Выбрать:
   - Account Type: Business
   - План: Day/Week/Month
   - Нажать Stripe/PayPal/Payme → Agree → OK → редирект на провайдера.
5. Вернуться в приложение, открыть `Account Management` и `My payments`:
   - Чекбокс Auto‑Renewal (вкл/выкл).
   - Таблица платежей с пагинацией.

Примечание (Swagger локально): нажмите Authorize и вставьте токен, иначе будет 401.

---

## Обработка ошибок и крайние случаи

- 401 в Swagger → не передан Bearer‑токен.
- 404 на enable/cancel auto‑renewal → нет активной подписки (ожидаемо).
- PayPal без billing agreements → автопродление может быть недоступно (предупреждение в модалке).
- Payme staging: может требоваться предварительная привязка карты/разрешение на рекуррентные списания в тест‑кабинете.
- Hydration в Sidebar: устранён (isAuthenticated определяется после монтирования клиента).

---

## Что ещё сделать (Next)

- Показ уведомлений “Payment was successful!” / “Transaction failed…” по query‑параметрам
  после возврата с провайдера и обновление `getSubscriptions`.
- Отображение “Next payment” (требуется поле от бэка или расчёт).
- Деактивация автопродления у предыдущей подписки при создании новой — отразить в UI после API‑ответа.
- Доп. валидация для PayPal (проверка состояния аккаунта/agreements до открытия сессии оплаты).
- Локализация текстов.
