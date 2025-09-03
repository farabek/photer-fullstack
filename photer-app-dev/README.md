# INCTAGRAM

## DEV Environment Configuration

### Before Cloning Repository

If you are using Git on Windows, make sure this setting is disabled:

    git config --global core.autocrlf false

This command will turn off automatic conversion of LF characters to CRLF.

### After Cloning Repository

1. Install all dependencies using this command:

        pnpm install

2. Run DEV server

        pnpm dev

## Code Formatting

Run this command to check for Eslint and Prettier errors:

    pnpm lint

Add `--fix` argument to auto fix all Prettier errors:

    pnpm lint --fix

## Структура проекта

- `app/`: Маршруты и страницы Next.js.
- `entities/`: Бизнес-сущности (например, пользователь, продукт).
- `features/`: Функциональные возможности (например, авторизация).
- `shared/`: Общие модули (UI, API, состояние, типы).
