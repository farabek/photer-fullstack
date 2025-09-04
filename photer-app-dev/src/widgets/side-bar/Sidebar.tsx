// src/widgets/side-bar/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import HoverDiv from './HoverDiv';
import { ytSidebarDataset } from './SidebarData';
import SidebarItem from './SidebarItem';
import { cn } from '@/shared/lib/cn';
import { Button, IconSprite, Scrollbar } from '@/shared/ui';
import { authApi, useGetMeQuery } from '@/features/auth/api/authApi';
import { LogoutButton } from '../logout-button/LogoutButton';
import { LogoutModal } from '@/features/auth/ui/login-form/LogoutForm';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/state/store';

export const Sidebar = (): React.JSX.Element | null => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data, isLoading, error } = useGetMeQuery();
  const { isOpen, openModal, closeModal, confirmLogout } = useLogout();

  // 🔒 КОНТРОЛЬ ВИДИМОСТИ SIDEBAR ДЛЯ НЕАВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
  //
  // ✅ РАСКОММЕНТИРОВАТЬ ЭТИ СТРОКИ, чтобы СКРЫТЬ Sidebar для неавторизованных пользователей:
  // if (!data) {
  //   return null;
  // }
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
        {isLoading ? (
          // Показываем загрузку во время проверки аутентификации
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-light-100 border-t-transparent" />
            {isSidebarOpen && (
              <span className="regular-text-14 text-light-100">Loading...</span>
            )}
          </div>
        ) : data ? (
          // Для авторизованных пользователей - кнопка выхода
          <>
            <LogoutButton hideText={!isSidebarOpen} openModal={openModal} />
            <LogoutModal
              open={isOpen}
              userEmail={''}
              onConfirmed={confirmLogout}
              onCanceled={closeModal}
            />
          </>
        ) : (
          // Для неавторизованных пользователей - кнопка входа
          <Button
            variant="text"
            className="text-light-100 hover:text-light-100 active:text-light-100 focus:text-light-100 w-full cursor-pointer border-none"
            onClick={() => (window.location.href = '/sign-in')}
          >
            <div className="flex items-center gap-3">
              <IconSprite iconName="person-outline" />
              {isSidebarOpen && (
                <span className="regular-text-14">Sign In</span>
              )}
            </div>
          </Button>
        )}
      </div>
    </aside>
  );
};
