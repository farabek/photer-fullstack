// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { getUserId } from '@/shared/lib/ssr/getUserId';

export default async function MyProfileRedirectPage(): Promise<void> {
  const userId = await getUserId();
  if (userId) {
    redirect(`/profile/${userId}`);
  }
  redirect('/sign-in');
}
