'use client';

import { Sidebar } from '@/widgets/side-bar';
import { useSidebarVisibility } from '@/shared/hooks';

/**
 * Клиентский компонент для условного отображения Sidebar
 * Вынесен в отдельный файл, чтобы layout.tsx остался серверным компонентом
 */
export function ConditionalSidebarWrapper() {
  const { showSidebar } = useSidebarVisibility();

  return showSidebar ? <Sidebar /> : null;
}
