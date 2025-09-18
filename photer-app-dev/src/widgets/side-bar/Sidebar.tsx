// src/widgets/side-bar/Sidebar.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import HoverDiv from './HoverDiv';
import { ytSidebarDataset } from './SidebarData';
import SidebarItem from './SidebarItem';
import { cn } from '@/shared/lib/cn';
import { Button, IconSprite, Scrollbar } from '@/shared/ui';
import { authApi } from '@/features/auth/api/authApi';
import { LogoutButton } from '../logout-button/LogoutButton';
import { LogoutModal } from '@/features/auth/ui/login-form/LogoutForm';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/state/store';
import { getCookie } from '@/shared/lib/cookies';
import { appLogger } from '@/shared/lib/appLogger';
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector to avoid returning a new object reference each time
const getMeSelector = authApi.endpoints.getMe.select();
const selectAuthData = createSelector([getMeSelector], (queryState) => ({
  data: queryState.data,
  isLoading: queryState.isLoading,
  error: queryState.error,
}));

export const Sidebar = (): React.JSX.Element | null => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Флаг монтирования клиента для предотвращения гидратационных рассинхронов
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Получаем данные из RTK Query кэша вместо дублирующего запроса
  const hasToken = getCookie('accessToken');

  // Используем мемоизированный селектор для предотвращения лишних рендеров
  const authData = useSelector(selectAuthData);

  // Деструктурируем мемоизированные данные
  const { data, isLoading, error } = authData;

  // 🔍 DIAGNOSTIC LOG: Track component re-renders (только в development)
  const renderCounter = useRef(0);
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 SIDEBAR RENDER:', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'present' : 'null',
      isLoading,
      hasError: !!error,
      hasData: !!data,
      renderCount: renderCounter.current++,
      timestamp: new Date().toISOString(),
    });
  }

  // Определяем, авторизован ли пользователь
  // ВАЖНО: до монтирования клиента считаем неавторизованным, чтобы SSR и клиент совпадали
  // Данные пользователя получаем из кэша RTK Query (загружаются в AuthInitializer)
  const isAuthenticated = isClient ? !!hasToken : false;

  // Логируем монтирование Sidebar
  useEffect(() => {
    console.log('🔍 SIDEBAR useEffect [] - MOUNT:', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      hasData: !!data,
      isLoading,
      hasError: !!error,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
    appLogger.sidebar('SIDEBAR_MOUNTED', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      hasData: !!data,
      isLoading,
      hasError: !!error,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Логируем изменения состояния аутентификации
  useEffect(() => {
    console.log('🔍 SIDEBAR useEffect [auth deps] - AUTH STATE CHANGE:', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      hasData: !!data,
      dataUserId: data?.userId,
      dataEmail: data?.email,
      isLoading,
      hasError: !!error,
      errorMessage: error ? 'Error exists' : 'No error',
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
    appLogger.sidebar('SIDEBAR_AUTH_STATE_CHANGED', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      hasData: !!data,
      dataUserId: data?.userId,
      dataEmail: data?.email,
      isLoading,
      hasError: !!error,
      errorMessage: error ? 'Error exists' : 'No error',
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, [hasToken, data, isLoading, error, isAuthenticated]);

  // Отладочная информация для диагностики проблемы (только в development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Sidebar Debug:', {
      hasToken: !!hasToken,
      tokenValue: hasToken ? 'exists' : 'null',
      data: !!data,
      isLoading,
      error: !!error,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }

  const { isOpen, openModal, closeModal, confirmLogout } = useLogout();

  const handleLogoutModalOpen = () => {
    appLogger.sidebar('SIDEBAR_LOGOUT_MODAL_OPENING', {
      hasToken: !!hasToken,
      hasData: !!data,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
    openModal();
  };

  const handleLogoutModalClose = () => {
    appLogger.sidebar('SIDEBAR_LOGOUT_MODAL_CLOSING', {
      hasToken: !!hasToken,
      hasData: !!data,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
    closeModal();
  };

  const handleSignInClick = () => {
    appLogger.sidebar('SIDEBAR_SIGN_IN_CLICKED', {
      hasToken: !!hasToken,
      hasData: !!data,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
    window.location.href = '/sign-in';
  };

  // 🔒 КОНТРОЛЬ ВИДИМОСТИ SIDEBAR ДЛЯ НЕАВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
  //
  // ✅ РАСКОММЕНТИРОВАТЬ ЭТИ СТРОКИ, чтобы СКРЫТЬ Sidebar для неавторизованных пользователей:
  if (!data) {
    return null;
  }
  //
  // ❌ ЗАКОММЕНТИРОВАТЬ ЭТИ СТРОКИ, чтобы ПОКАЗЫВАТЬ Sidebar для всех пользователей:
  // (текущее состояние - Sidebar показывается всем)

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        'sticky top-[60px] left-0 flex h-[calc(100vh-60px)] w-60 flex-col justify-between border-r-2 border-zinc-700 bg-black text-slate-50 transition-all duration-300',
        {
          'w-[64px]': !isSidebarOpen,
        }
      )}
    >
      {/* Верхняя панель: бургер + стрелка */}
      <section
        className={cn('between flex w-full items-center gap-4 py-4', {
          'justify-end px-5': isSidebarOpen, // отступы только если открыт
          'justify-start pl-3': !isSidebarOpen, // отступы только если открыт
        })}
      >
        <HoverDiv
          className="flex items-center gap-2 rounded-full p-2"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? (
            <IconSprite iconName="arrow-back-outline" />
          ) : (
            <IconSprite iconName="menu-outline" />
          )}
        </HoverDiv>
      </section>

      {/* Центральная часть: пункты меню */}
      {/* <main className="flex-1 overflow-hidden"> */}
      <Scrollbar>
        <nav>
          <ul className="flex flex-1 flex-col gap-1">
            {ytSidebarDataset
              .filter((dataset) => dataset.title !== 'Log Out')
              .map((dataset, index) => (
                <React.Fragment key={index}>
                  {dataset.title && (
                    <li className="w-full px-2">
                      <SidebarItem
                        path={dataset.path}
                        activeIconName={dataset.activeIconName}
                        defaultIconName={dataset.defaultIconName}
                        title={dataset.title}
                        isSidebarOpen={isSidebarOpen}
                      />
                    </li>
                  )}
                  {dataset.title === 'Search' && <div className="h-6" />}
                  {dataset.title === 'Favorites' && <div className="h-10" />}

                  {dataset.nestedItems &&
                    isSidebarOpen &&
                    dataset.nestedItems.length > 0 && (
                      <ul className="mt-4 w-full border-t border-zinc-600 px-4 pt-4">
                        <p className="mb-2 px-3">{dataset.nestedTitle}</p>
                        {dataset.nestedItems.map((item, index) => (
                          <SidebarItem
                            key={index}
                            path={item.path}
                            activeIconName={item.activeIconName}
                            defaultIconName={item.defaultIconName}
                            title={item.title}
                            isSidebarOpen={isSidebarOpen}
                          />
                        ))}
                      </ul>
                    )}
                </React.Fragment>
              ))}
          </ul>
        </nav>
      </Scrollbar>

      {/* Нижняя часть: Log Out / Sign In */}
      <div className="pb-6">
        {isLoading && isAuthenticated ? (
          // Показываем загрузку только если пользователь авторизован и идет загрузка
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="border-light-100 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
            {isSidebarOpen && (
              <span className="regular-text-14 text-light-100">Loading...</span>
            )}
          </div>
        ) : isAuthenticated ? (
          // Для авторизованных пользователей - кнопка выхода
          // Используем только isAuthenticated, не зависим от data
          <>
            <LogoutButton
              hideText={!isSidebarOpen}
              openModal={handleLogoutModalOpen}
            />
            <LogoutModal
              open={isOpen}
              userEmail={data?.email || ''}
              onConfirmed={confirmLogout}
              onCanceled={handleLogoutModalClose}
            />
          </>
        ) : (
          // Для неавторизованных пользователей - кнопка входа
          <>
            <Button
              variant="text"
              className="text-light-100 hover:text-light-100 active:text-light-100 focus:text-light-100 w-full cursor-pointer border-none"
              onClick={handleSignInClick}
            >
              <div className="flex items-center gap-3">
                <IconSprite iconName="person-outline" />
                {isSidebarOpen && (
                  <span className="regular-text-14">Sign In</span>
                )}
              </div>
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};
