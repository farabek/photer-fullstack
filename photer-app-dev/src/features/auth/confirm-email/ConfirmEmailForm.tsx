'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/widgets/card/card';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { useConfirmEmail } from './useConfirmEmail';

// Функция для проверки UUID v4 формата
const isValidUUID = (uuid: string): boolean => {
  // Убираем все пробелы перед проверкой
  const cleanedUuid = uuid.replace(/\s+/g, '');
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(cleanedUuid);
};

export function ConfirmEmailForm() {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  const { confirmEmail, isLoading, error } = useConfirmEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    console.log('🔍 Form submitted with code:', code);
    console.log('🔍 Code length:', code.length);
    console.log('🔍 Code trimmed:', code.trim());

    if (!code.trim()) {
      console.log('❌ Code is empty');
      setLocalError('Введите код подтверждения');
      return;
    }

    // Проверяем формат UUID
    const isValid = isValidUUID(code.trim());
    console.log('🔍 UUID validation result:', isValid);

    if (!isValid) {
      console.log('❌ UUID validation failed');
      setLocalError(
        'Код подтверждения должен быть в формате UUID (например: 550e8400-e29b-41d4-a716-446655440000)'
      );
      return;
    }

    console.log('✅ UUID validation passed, calling confirmEmail');
    const success = await confirmEmail(code.trim());
    if (success) {
      console.log('✅ Email confirmed, redirecting to sign-in');
      router.push('/sign-in?confirmed=true');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Автоматически удаляем все пробелы из кода
    const cleanedValue = value.replace(/\s+/g, '');
    setCode(cleanedValue);
    setLocalError(''); // Очищаем локальную ошибку при изменении

    console.log('🔍 Input changed:', {
      original: value,
      cleaned: cleanedValue,
    });
  };

  return (
    <Card className="m-0-auto mt-6 flex min-h-162 w-[378px] flex-col items-center justify-center">
      <h1 className="h1-text mt-[23px]">Confirm Your Email</h1>

      <div className="mt-6 w-full px-6">
        <p className="mb-6 text-center text-gray-400">
          Мы отправили код подтверждения на ваш email. Проверьте почту и введите
          код ниже для активации аккаунта.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Код подтверждения (UUID)"
            value={code}
            onChange={handleCodeChange}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            errorMessage={localError || error}
            required
          />

          <Button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full"
          >
            {isLoading ? 'Подтверждение...' : 'Подтвердить Email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Не получили код?</p>
          <Button
            variant="text"
            onClick={() => router.push('/resend-link')}
            className="text-sm"
          >
            Отправить код повторно
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="text"
            onClick={() => router.push('/sign-in')}
            className="text-sm"
          >
            Назад к входу
          </Button>
        </div>
      </div>
    </Card>
  );
}
