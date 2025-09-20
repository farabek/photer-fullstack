# Техническое описание исправления автоматического отображения фотографий

## Обзор проблемы

**Дата:** 2025-09-18  
**Критичность:** Высокая  
**Влияние:** Основной пользовательский опыт приложения

### Описание проблемы

Пользователи не видели загруженные фотографии сразу после создания поста. Требовалась ручная перезагрузка страницы для отображения новых фотографий.

## Детальный анализ проблем

### 1. Отсутствующий placeholder.svg

**Файл:** `photer-app-dev/src/features/posts/ui/postCreate/PhotoPreviewWithNav.tsx`  
**Проблема:** Компонент пытался загрузить несуществующий файл `/placeholder.svg`  
**Решение:** Создан простой SVG placeholder в `photer-app-dev/public/placeholder.svg`

```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#999">Placeholder</text>
</svg>
```

### 2. Неправильная раздача статических файлов

**Файл:** `photer-api-dev/apps/gateway/src/main.ts`  
**Проблема:** Файлы загружались в `uploads/`, но HTTP-запросы возвращали 404 Not Found  
**Причина:** Неправильный путь после компиляции NestJS приложения

```typescript
// Было (неправильно):
app.useStaticAssets(join(__dirname, '../../uploads'));

// Стало (правильно):
app.useStaticAssets(join(__dirname, '../../../uploads'));
```

**Объяснение:** После компиляции NestJS приложения структура директорий изменяется:

- Исходный код: `apps/gateway/src/main.ts`
- Скомпилированный: `dist/apps/gateway/main.js`
- Файлы загрузки: `uploads/` (относительно корня проекта)

### 3. Неправильный порядок установки флага `postCreated`

**Файл:** `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts`  
**Проблема:** Флаг `setPostCreated(true)` вызывался ДО `resetState()`, который сбрасывал весь state

```typescript
// Было (неправильно):
await createPost(formData).unwrap();
dispatch(setPostCreated(true)); // Флаг устанавливается
dispatch(resetState()); // Но сразу сбрасывается!

// Стало (правильно):
await createPost(formData).unwrap();
dispatch(resetState()); // Сначала сбрасываем форму
dispatch(setPostCreated(true)); // Потом устанавливаем флаг
```

### 4. Неправильная логика приоритетов в `usePostsList`

**Файл:** `photer-app-dev/src/features/posts/hooks/feed/usePostsList.ts`  
**Проблема:** SSR данные устанавливались первыми, кэш приходил позже, но SSR данные имели приоритет

```typescript
// Было (неправильно):
if (ssrPosts && ssrPosts.items && ssrPosts.items.length > 0) {
  setPosts(ssrPosts); // SSR данные всегда имели приоритет
} else if (
  postsFromCache &&
  postsFromCache.items &&
  postsFromCache.items.length > 0
) {
  setPosts(postsFromCache);
}

// Стало (правильно):
if (postsFromCache && postsFromCache.items && postsFromCache.items.length > 0) {
  setPosts(postsFromCache); // Кэш имеет приоритет
} else if (
  ssrPosts &&
  ssrPosts.items &&
  ssrPosts.items.length > 0 &&
  !postCreated
) {
  setPosts(ssrPosts); // SSR данные игнорируются если пост был создан
}
```

### 5. Несуществующий метод `refetchTags`

**Файл:** `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts`  
**Проблема:** Использовался несуществующий метод `postsApi.util.refetchTags()`

```typescript
// Было (ошибка):
dispatch(postsApi.util.refetchTags(['Posts'])); // refetchTags не существует

// Стало (правильно):
dispatch(postsApi.util.invalidateTags(['Posts'])); // Только invalidateTags
```

### 6. Недостаточная инвалидация кэша

**Файл:** `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts`  
**Проблема:** Кэш не обновлялся полностью после создания поста

```typescript
// Добавлена многоуровневая инвалидация:
dispatch(postsApi.util.invalidateTags(['Posts']));
dispatch(
  postsApi.util.invalidateTags([{ type: 'Posts', id: 'PROFILE_POSTS_LIST' }]),
);
```

### 7. Отсутствие принудительного обновления кэша

**Файл:** `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts`  
**Проблема:** Инвалидация кэша не гарантировала получение свежих данных

```typescript
// Добавлен принудительный запрос:
if (profileId) {
  console.log('Force refetching profile posts for profileId:', profileId);
  getProfilePosts({ profileId, pageNumber: 1 });
}
```

### 8. Неправильное получение `profileId` из Redux state

**Файл:** `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts`  
**Проблема:** `state.auth.user?.id` не существует в структуре Redux state

```typescript
// Было (ошибка):
const profileId = useSelector((state: RootState) => state.auth.user?.id);

// Стало (правильно):
const profileId = useSelector(
  (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId,
);
```

## Архитектурные изменения

### Система флагов в Redux

Добавлен новый флаг `postCreated` в `postSlice.ts`:

```typescript
// initialState
const initialState: PostCreationState & PostCachedState = {
  // ... существующие поля
  postCreated: false,
};

// reducer
setPostCreated: (state, action: PayloadAction<boolean>) => {
  state.postCreated = action.payload;
},
```

### Улучшенная логика кэширования

Реализована система приоритетов:

1. **Кэш с данными** - высший приоритет
2. **Пустой кэш + postCreated = true** - очистка старых данных
3. **SSR данные + postCreated = false** - fallback для новых пользователей

### Отладочная система

Добавлены подробные логи для диагностики:

```typescript
console.log('usePostsList useEffect Debug:', {
  profileId,
  postCreated,
  postsFromCache: postsFromCache
    ? {
        /* детали */
      }
    : null,
  ssrPosts: ssrPosts
    ? {
        /* детали */
      }
    : null,
  currentPosts: posts
    ? {
        /* детали */
      }
    : null,
  timestamp: new Date().toISOString(),
});
```

## Результаты

### До исправления

- ❌ Фотографии не отображались автоматически
- ❌ Требовалась ручная перезагрузка страницы
- ❌ Плохой пользовательский опыт

### После исправления

- ✅ Фотографии появляются автоматически сразу после создания поста
- ✅ Нет необходимости в ручной перезагрузке
- ✅ Отличный пользовательский опыт
- ✅ Надежная система кэширования
- ✅ Подробная отладочная система

## Технические детали

### Измененные файлы

1. `photer-app-dev/public/placeholder.svg` - создан
2. `photer-api-dev/apps/gateway/src/main.ts` - исправлен путь статических файлов
3. `photer-app-dev/src/features/posts/model/postSlice.ts` - добавлен флаг `postCreated`
4. `photer-app-dev/src/features/posts/lib/post.types.ts` - обновлены типы
5. `photer-app-dev/src/features/posts/hooks/create/usePostDescription.ts` - исправлена логика создания поста
6. `photer-app-dev/src/features/posts/hooks/feed/usePostsList.ts` - переписана логика приоритетов

### Зависимости

- Redux Toolkit Query для кэширования
- NestJS для раздачи статических файлов
- Next.js для SSR
- React для управления состоянием

## Заключение

Проблема была решена комплексно путем исправления 8 взаимосвязанных проблем в разных частях системы. Результат - фотографии теперь отображаются автоматически сразу после создания поста, что значительно улучшает пользовательский опыт приложения.
