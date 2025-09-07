# Пошаговое описание процесса при нажатии на кнопку "Profile Settings"

## Обзор

Данный документ описывает полный поток выполнения при нажатии на кнопку "Profile Settings" в приложении Photer,
включая все файлы, функции и логику.

## Шаг 1: Нажатие на кнопку

**Файл:** `photer-app-dev/src/widgets/profile-card/profile-buttons/ProfileButtons.tsx`

```tsx
<Button
  variant={'secondary'}
  onClick={isOwner ? handleProfileSettingsClick : callback}
>
  {isOwner ? 'Profile Settings' : 'Send Message'}
</Button>
```

**Код обработчика:**

```tsx
const handleProfileSettingsClick = () => {
  appLogger.profileSettings('PROFILE_SETTINGS_BUTTON_CLICKED', {
    isOwner,
    timestamp: new Date().toISOString(),
    component: 'ProfileButtons',
  });

  if (callback) {
    callback();
  }
};
```

**Что происходит:**

1. Логируется событие `PROFILE_SETTINGS_BUTTON_CLICKED` через `appLogger`
2. Вызывается `callback` функцию, переданную из родительского компонента

---

## Шаг 2: Вызов callback функции

**Файл:** `photer-app-dev/src/widgets/profile-card/ui/ProfileCard.tsx`

```tsx
<ProfileButtons callback={handleOpenEditProfile} isOwner={isOwner} />
```

**Callback функция:**

```tsx
const handleOpenEditProfile = () => {
  appLogger.profileSettings('PROFILE_SETTINGS_MODAL_OPENING', {
    isOwner,
    isAuthorized,
    profileId,
    hasUser: !!user,
    timestamp: new Date().toISOString(),
  });
  setIsEditProfile(true);
};
```

**Что происходит:**

1. Логируется событие `PROFILE_SETTINGS_MODAL_OPENING`
2. Устанавливается состояние `isEditProfile = true`

---

## Шаг 3: Условный рендеринг модального окна

**Файл:** `photer-app-dev/src/widgets/profile-card/ui/ProfileCard.tsx`

```tsx
if (isEditProfile) {
  appLogger.profileSettings('PROFILE_SETTINGS_MODAL_RENDERED', {
    isOwner,
    isAuthorized,
    profileId,
    hasUser: !!user,
    timestamp: new Date().toISOString(),
  });
  return <EditProfile onClose={handleCloseEditProfile} />;
}
```

**Что происходит:**

1. Логируется событие `PROFILE_SETTINGS_MODAL_RENDERED`
2. Рендерится компонент `EditProfile` с пропсом `onClose={handleCloseEditProfile}`
3. Весь остальной контент `ProfileCard` заменяется на модальное окно

---

## Шаг 4: Монтирование EditProfile компонента

**Файл:** `photer-app-dev/src/features/edit-profile/EditProfile.tsx`

```tsx
export const EditProfile = ({ onClose }: Props): ReactNode => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  // Логируем монтирование EditProfile компонента
  useEffect(() => {
    appLogger.profileSettings('EDIT_PROFILE_MOUNTED', {
      currentTab,
      availableTabs: tabs,
      timestamp: new Date().toISOString(),
    });

    // Логируем размонтирование
    return () => {
      appLogger.profileSettings('EDIT_PROFILE_UNMOUNTED', {
        currentTab,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);
```

**Что происходит:**

1. Инициализируется состояние `currentTab` со значением `'General iformation'`
2. Логируется событие `EDIT_PROFILE_MOUNTED`
3. Устанавливается cleanup функция для логирования размонтирования

---

## Шаг 5: Рендеринг структуры EditProfile

**Файл:** `photer-app-dev/src/features/edit-profile/EditProfile.tsx`

```tsx
return (
  <div className="flex w-full flex-col">
    <ProfileTabs
      tabs={tabs}
      currentTab={currentTab}
      setCurrentTabAction={setCurrentTab}
    />
    <div className="mt-[24px]">{renderTab()}</div>
    <Button
      className="ml-auto mt-[24px] w-[160px]"
      onClick={() => {
        appLogger.profileSettings('EDIT_PROFILE_CANCEL_CLICKED', {
          currentTab,
          timestamp: new Date().toISOString(),
        });
        onClose();
      }}
    >
      Cancel
    </Button>
  </div>
);
```

**Что происходит:**

1. Рендерится контейнер с flexbox layout
2. Рендерится компонент `ProfileTabs` с вкладками
3. Рендерится содержимое текущей вкладки через `renderTab()`
4. Рендерится кнопка "Cancel" с обработчиком закрытия

---

## Шаг 6: Рендеринг вкладок

**Файл:** `photer-app-dev/src/features/edit-profile/profile-tabs/ProfileTabs.tsx`

```tsx
return (
  <div className="flex w-full">
    {tabs.map((tab, index) => (
      <TabsButton
        key={index}
        isActive={tab === currentTab}
        onClick={() => {
          setCurrentTabAction(tab);
        }}
      >
        {tab}
      </TabsButton>
    ))}
  </div>
);
```

**Что происходит:**

1. Рендерятся 4 вкладки: `'General iformation'`, `'Devices'`, `'Account Management'`, `'My payments'`
2. Первая вкладка `'General iformation'` активна по умолчанию

---

## Шаг 7: Рендеринг содержимого вкладки

**Файл:** `photer-app-dev/src/features/edit-profile/EditProfile.tsx`

```tsx
const renderTab = (): ReactNode => {
  switch (currentTab) {
    case 'General iformation':
      return <GeneralInformation />;
    case 'Devices':
      return <Devices />;
    case 'Account Management':
      return <AccountManagement />;
    case 'My payments':
      return <MyPayments />;
    default:
      return <div>Выберите компонент</div>;
  }
};
```

**Что происходит:**

1. Поскольку `currentTab = 'General iformation'`, рендерится компонент `GeneralInformation`

---

## Шаг 8: Рендеринг формы GeneralInformation

**Файл:** `photer-app-dev/src/features/edit-profile/general-iformation/GeneralInformation.tsx`

```tsx
return (
  <div className="flex w-full flex-col">
    <form onSubmit={handleSubmit}>
      <div className="flex">
        <div className="flex-1">
          <AddAvatar avatarUrl={avatarUrl} />
        </div>
        <div className="flex-3">
          <Input
            type="text"
            required
            label="Username"
            errorMessage={errors.username?.message}
            {...register('username')}
            onChange={handleChange}
          />
          <Input
            type="text"
            required
            label="First name"
            errorMessage={errors.firstName?.message}
            {...register('firstName')}
            onChange={handleChange}
          />
          <Input
            type="text"
            required
            label="Last name"
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
            onChange={handleChange}
          />
          {/* ... остальные поля формы */}
        </div>
      </div>
      <div className="border-dark-300 mt-[24px] flex justify-end border-t-[1px] pt-[24px]">
        <Button type="submit" disabled={!isDirty || isError}>
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  </div>
);
```

**Что происходит:**

1. Рендерится форма с полями: Username, First name, Last name, Birth date, Country, City, About me
2. Рендерится компонент `AddAvatar` для загрузки аватара
3. Рендерится кнопка "Save changes" для сохранения изменений

---

## Шаг 9: Логирование изменений вкладки

**Файл:** `photer-app-dev/src/features/edit-profile/EditProfile.tsx`

```tsx
// Логируем изменения вкладки
useEffect(() => {
  appLogger.profileSettings('EDIT_PROFILE_TAB_CHANGED', {
    currentTab,
    timestamp: new Date().toISOString(),
  });
}, [currentTab]);
```

**Что происходит:**

1. При изменении `currentTab` логируется событие `EDIT_PROFILE_TAB_CHANGED`

---

## Итоговый результат

После нажатия на кнопку "Profile Settings" пользователь видит модальное окно с формой редактирования профиля, содержащее:

- **4 вкладки** (General information активна по умолчанию)
- **Форму с полями** для редактирования личной информации
- **Кнопку "Save changes"** для сохранения
- **Кнопку "Cancel"** для закрытия модального окна

## Логирование

Все действия логируются через `appLogger` для отладки и мониторинга:

1. `PROFILE_SETTINGS_BUTTON_CLICKED` - нажатие на кнопку
2. `PROFILE_SETTINGS_MODAL_OPENING` - открытие модального окна
3. `PROFILE_SETTINGS_MODAL_RENDERED` - рендеринг модального окна
4. `EDIT_PROFILE_MOUNTED` - монтирование компонента EditProfile
5. `EDIT_PROFILE_TAB_CHANGED` - изменение вкладки
6. `EDIT_PROFILE_CANCEL_CLICKED` - нажатие на кнопку Cancel
7. `EDIT_PROFILE_UNMOUNTED` - размонтирование компонента

## Связанные файлы

### Frontend компоненты

- `photer-app-dev/src/widgets/profile-card/profile-buttons/ProfileButtons.tsx`
- `photer-app-dev/src/widgets/profile-card/ui/ProfileCard.tsx`
- `photer-app-dev/src/features/edit-profile/EditProfile.tsx`
- `photer-app-dev/src/features/edit-profile/profile-tabs/ProfileTabs.tsx`
- `photer-app-dev/src/features/edit-profile/general-iformation/GeneralInformation.tsx`

### Утилиты

- `photer-app-dev/src/shared/lib/appLogger.ts`

### Документация

- `photer-app-dev/PROFILE-SETTINGS-DEBUG.md`
