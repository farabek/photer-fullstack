// src/app/not-found.tsx
'use client';

import Link from 'next/link';
import { ReactElement } from 'react';

export default function NotFoundPage(): ReactElement {
  return (
    <main className="bg-dark-900 text-light-100 mx-auto flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-4">
      {/* 60px — это высота Header */}
      <h1 className="mb-4 text-3xl font-bold">404 — Страница не найдена</h1>
      <p className="text-light-900 mb-6 text-center">
        Такой страницы не существует или она была удалена.
      </p>
      <Link
        href="/"
        className="bg-accent-500 text-light-100 hover:bg-accent-700 rounded px-6 py-2 transition"
      >
        Вернуться на главную
      </Link>
    </main>
  );
}
