# Photer API

Микросервисное приложение для управления фотографиями, построенное на NestJS с использованием Prisma, PostgreSQL, AWS S3 и RabbitMQ.

## Архитектура

Приложение состоит из двух основных сервисов:

- **Gateway** - основной API сервис с аутентификацией и управлением пользователями
- **Storage** - микросервис для обработки и хранения файлов

## Технологии

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, Passport.js, OAuth (Google, GitHub)
- **File Storage**: AWS S3
- **Message Queue**: RabbitMQ
- **Image Processing**: Sharp
- **Documentation**: Swagger/OpenAPI

## Установка

### Быстрый старт (рекомендуется)

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd photer-api-dev
```

2. Убедитесь, что у вас установлен Docker и Docker Compose

3. Запустите скрипт автоматической настройки:

**Для Linux/Mac:**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Для Windows:**

```cmd
start-dev.bat
```

4. Настройте переменные окружения в созданном файле `.env.development`

### Ручная установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd photer-api-dev
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env.development` на основе `env.example`:

```bash
cp env.example .env.development
```

4. Настройте переменные окружения в `.env.development`

5. Запустите инфраструктурные сервисы:

```bash
docker-compose up -d
```

6. Выполните миграции:

```bash
npm run migrate:dev
```

7. Заполните базу тестовыми данными:

```bash
npm run db:seed
```

## Запуск

### Разработка

#### Через терминал:

Запуск Gateway сервиса:

```bash
npm run start:dev:gateway
```

Запуск Storage сервиса:

```bash
npm run start:dev:storage
```

#### Через VS Code/Cursor (рекомендуется):

1. **Откройте терминал:** `Ctrl + `` (обратная кавычка)
2. **Используйте готовые задачи:**
   - `Ctrl + Shift + P` → "Tasks: Run Task"
   - Выберите нужную задачу:
     - `Start Gateway (Dev)` - запуск Gateway сервиса
     - `Start Storage (Dev)` - запуск Storage сервиса
     - `Build All` - сборка проекта
     - `Database Migrate` - миграции БД
     - `Seed Database` - заполнение тестовыми данными
     - `Docker Compose Up` - запуск инфраструктуры
     - `Docker Compose Down` - остановка инфраструктуры

3. **Отладка:**
   - `F5` - запуск отладки Gateway
   - `Ctrl + Shift + D` - панель отладки
   - Выберите конфигурацию: "Debug Gateway" или "Debug Storage"

### Продакшн

Сборка:

```bash
npm run build:all
```

Запуск:

```bash
npm run start:prod:gateway
npm run start:prod:storage
```

## API Документация

После запуска Gateway сервиса, документация Swagger доступна по адресу:

```
http://localhost:3001/api

## Основные эндпоинты

### Аутентификация

- `POST /auth/login` - вход пользователя
- `POST /auth/register` - регистрация пользователя
- `GET /auth/google` - OAuth через Google
- `GET /auth/github` - OAuth через GitHub

### Пользователи

- `GET /users` - получить всех пользователей
- `GET /users/:id` - получить пользователя по ID
- `PATCH /users/:id` - обновить пользователя
- `DELETE /users/:id` - удалить пользователя

### Фотографии

- `GET /photos` - получить фотографии пользователя
- `POST /photos` - создать новую фотографию
- `GET /photos/:id` - получить фотографию по ID
- `PATCH /photos/:id` - обновить фотографию
- `DELETE /photos/:id` - удалить фотографию

### Хранилище

- `POST /storage/upload` - загрузить файл
- `DELETE /storage/:url` - удалить файл

## Структура проекта

```

apps/
├── gateway/ # Основной API сервис
│ ├── src/
│ │ ├── auth/ # Аутентификация
│ │ ├── users/ # Управление пользователями
│ │ ├── photos/ # Управление фотографиями
│ │ ├── storage/ # Локальное хранилище
│ │ └── prisma/ # Prisma сервис
│ └── prisma/ # Схема базы данных
└── storage/ # Микросервис хранилища
└── src/
├── storage/ # Обработка файлов
└── main.ts # Точка входа
.vscode/ # Настройки VS Code/Cursor
├── settings.json # Настройки редактора
├── tasks.json # Готовые задачи
├── launch.json # Конфигурация отладки
└── extensions.json # Рекомендуемые расширения

````

## Тестирование

Запуск тестов:

```bash
npm run test
````

E2E тесты:

```bash
npm run test:e2e:gateway
npm run test:e2e:storage
```

## Лицензия

UNLICENSED
