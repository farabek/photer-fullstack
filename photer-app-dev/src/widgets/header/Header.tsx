// src/widgets/header/Header.tsx
'use client';

import { ReactElement, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SelectItem } from '../SelectBox/SelectItem';
import { Button } from '@/shared/ui/button/Button';
import { SelectBox } from '../SelectBox/SelectBox';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api/authApi';

type Props = {
  withLoginBtn?: boolean;
};

// Memoized selector for auth user from RTK Query cache
const getMeSelector = authApi.endpoints.getMe.select();
const selectAuthData = createSelector([getMeSelector], (queryState) => ({
  data: queryState.data,
}));

export const Header = ({ withLoginBtn = false }: Props): ReactElement => {
  const [language, setLanguage] = useState<string>('en');
  const pathname = usePathname();
  const authData = useSelector(selectAuthData);
  const userId = authData.data?.userId;

  // Используем данные из RTK Query кэша для проверки авторизации
  const isAuthenticated = !!authData.data;

  // Hide Log In / Sign Up when user is authenticated (on any page)
  const hideAuthButtons = isAuthenticated;
  const showLoginButtons = withLoginBtn && !hideAuthButtons;

  return (
    <header className="bg-dark-900 text-light-100 border-dark-100 sticky top-0 z-50 h-[60px] w-full border-b-2 px-15 py-3 max-md:px-[15px]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Link href={'/'} className="large-text">
          Inctagram
        </Link>
        <div className="flex gap-2">
          <SelectBox
            value={language}
            onValueChange={setLanguage}
            className="bg-dark-900 border-dark-100 w-[163px] max-md:w-[70px] max-md:border-hidden"
          >
            <SelectItem value="en" icon="/icons/uk-flag.png">
              <span className="max-md:hidden">English</span>
            </SelectItem>

            <SelectItem value="ru" icon="/icons/ru-flag.png">
              <span className="max-md:hidden">Русский</span>
            </SelectItem>
          </SelectBox>
          {showLoginButtons && (
            <>
              <Button asChild variant="text" className="w-[100px]">
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
