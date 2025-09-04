// src/app/providers/StoreWrapper.tsx
'use client';

import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/shared/state/store';
import { AuthInitializer } from './AuthInitializer';

export default function StoreWrapper({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
