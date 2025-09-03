'use client';
import { ReactElement, Suspense } from 'react';
import { PasswordRecoveryForm } from '@/features/auth/password-recovery/ui/PasswordRecoveryForm';

export default function RecoveryPasswordPage(): ReactElement {
  return (
    <Suspense>
      <PasswordRecoveryForm />
    </Suspense>
  );
}
