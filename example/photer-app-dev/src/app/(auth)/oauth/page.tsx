'use client';
import { useGetMeQuery } from '@/features/auth/api/authApi';
import { Spinner } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Page(): ReactElement {
  const { data, error, isLoading } = useGetMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.error(error);
      toast(JSON.stringify(error), { type: 'error' });
      router.push('/');
    }
    if (!isLoading && data) {
      router.push(`/profile/${data.userId}`);
    }
  }, [error, isLoading, data, router]);

  return <Spinner fullScreen />;
}
