// src/app/(auth)/sign-up/page.tsx
'use client';

import { ReactElement } from 'react';
import SignUpForm from '@/features/auth/sign-up/ui/SignUpForm';

export default function Page(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}
