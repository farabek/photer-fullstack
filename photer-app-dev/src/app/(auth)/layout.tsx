// src/app/layout.tsx
import { ReactElement, ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return <div className={`flex w-full justify-center`}>{children}</div>;
}
