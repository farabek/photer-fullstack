// src/app/(auth)/sign-in/page.tsx

'use client';

import { ReactElement } from 'react';
import LogIn from '@/features/auth/sign-in/ui/LogIn';

export default function Page(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <LogIn />
    </div>
  );
}
