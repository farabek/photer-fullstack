module.exports = {
  // Автоматически исправляем markdown файлы перед коммитом
  '**/*.md': ['markdownlint --fix', 'git add'],

  // Проверяем и исправляем TypeScript/JavaScript файлы
  '**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write', 'git add'],

  // Форматируем JSON и YAML файлы
  '**/*.{json,yaml,yml}': ['prettier --write', 'git add'],
};
