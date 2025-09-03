import { FC, JSX, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/shared/ui';
import { useGetMeQuery } from '@/features/auth/api/authApi';

type Role = 'all' | 'auth';

export const withAuth = <T extends object>(
  Component: FC<T>,
  routeRole: Role
): FC<T> => {
  const ComponentWithAuth = (props: T): JSX.Element => {
    const router = useRouter();
    const { isLoading, data: userData } = useGetMeQuery();

    useEffect(() => {
      if (!isLoading) {
        if (!userData) {
          if (routeRole !== 'all' && routeRole !== 'auth') {
            router.push('/sign-in');
          }
        } else {
          if (routeRole === 'auth') {
            router.push(`/profile/${userData.userId}`);
          }
        }
      }
    }, [userData, isLoading, router]);

    if (isLoading) {
      return <Spinner />;
    }

    return <Component {...props} />;
  };

  return ComponentWithAuth;
};
