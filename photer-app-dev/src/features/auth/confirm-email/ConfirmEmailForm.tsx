'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/widgets/card/card';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { useConfirmEmail } from './useConfirmEmail';

export function ConfirmEmailForm() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { confirmEmail, isLoading, error } = useConfirmEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) return;

    const success = await confirmEmail(code);
    if (success) {
      router.push('/sign-in?confirmed=true');
    }
  };

  return (
    <Card className="m-0-auto mt-6 flex min-h-162 w-[378px] flex-col items-center justify-center">
      <h1 className="h1-text mt-[23px]">Confirm Your Email</h1>

      <div className="mt-6 w-full px-6">
        <p className="mb-6 text-center text-gray-400">
          We've sent a confirmation code to your email address. Please enter it
          below to activate your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter confirmation code"
            errorMessage={error}
            required
          />

          <Button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full"
          >
            {isLoading ? 'Confirming...' : 'Confirm Email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Didn't receive the code?</p>
          <Button
            variant="text"
            onClick={() => router.push('/resend-link')}
            className="text-sm"
          >
            Resend confirmation code
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="text"
            onClick={() => router.push('/sign-in')}
            className="text-sm"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </Card>
  );
}
