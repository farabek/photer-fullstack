'use client';
import { baseApi } from '@/shared/lib/baseApi';
import { FormSchemaType } from '../forgot-password/types/forgotPasswordFormSchema';
import { User } from '@/shared/types/commonTypes';
import { deleteCookie, setCookie } from '@/shared/lib/cookies';
import { appLogger } from '@/shared/lib/appLogger';

/**
 * Типы для авторизации
 *
 * Архитектура токенов:
 * - accessToken: короткий срок жизни (60 сек), используется для API запросов
 * - refreshToken: длинный срок жизни (5 мин), используется для обновления accessToken
 * - Оба токена автоматически управляются через cookies
 */
type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string; // Возвращается в теле ответа для совместимости
  // Также автоматически устанавливается в cookie backend'ом
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['me'], // Инвалидируем кэш пользователя при логине
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        appLogger.rtk('LOGIN_MUTATION_STARTED', {
          email: arg.email,
          timestamp: new Date().toISOString(),
        });

        try {
          const { data: response } = await queryFulfilled;

          appLogger.rtk('LOGIN_MUTATION_SUCCESS', {
            email: arg.email,
            hasAccessToken: !!response.accessToken,
            timestamp: new Date().toISOString(),
          });

          // Backend автоматически устанавливает cookies:
          // - accessToken в обычный cookie (не httpOnly) - JavaScript может читать
          // - refreshToken в httpOnly cookie - защищен от XSS
          // localStorage больше не нужен - используем cookies для SSR совместимости

          // Дополнительно дублируем установку accessToken на клиенте,
          // чтобы избежать гонки до того, как браузер применит Set-Cookie
          if (response?.accessToken) {
            setCookie('accessToken', response.accessToken, {
              path: '/',
              sameSite: 'strict',
            });
            // небольшой тик, чтобы cookie стал доступен prepareHeaders
            await new Promise((r) => setTimeout(r, 30));
          }

          appLogger.rtk('LOGIN_INITIATING_GET_ME', {
            timestamp: new Date().toISOString(),
          });

          // Загружаем данные пользователя после успешного входа
          // Это обновит кэш и обеспечит правильное отображение состояния аутентификации
          await dispatch(authApi.endpoints.getMe.initiate());
        } catch (error) {
          appLogger.rtk('LOGIN_MUTATION_ERROR', {
            email: arg.email,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          });
          console.log(error);
        }
      },
    }),

    newPassword: builder.mutation<
      void,
      { newPassword: string; recoveryCode: string }
    >({
      query: (body) => ({
        url: '/auth/new-password',
        method: 'POST',
        body: body,
      }),
    }),

    passwordRecovery: builder.mutation<void, FormSchemaType>({
      query: (body) => ({
        url: '/auth/password-recovery',
        method: 'POST',
        body: body,
      }),
      async onQueryStarted(arg) {
        localStorage.setItem('email', arg.email);
      },
    }),

    recoveryPasswordResending: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: '/auth/password-recovery-resending',
        method: 'POST',
        body: body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['me'],
      // Сохраняем данные пользователя в кэше на 5 минут
      // Это предотвращает потерю состояния аутентификации при навигации
      keepUnusedDataFor: 300,
      async onQueryStarted(arg, { queryFulfilled }) {
        appLogger.rtk('GET_ME_QUERY_STARTED', {
          timestamp: new Date().toISOString(),
        });

        try {
          const { data } = await queryFulfilled;
          appLogger.rtk('GET_ME_QUERY_SUCCESS', {
            userId: data.userId,
            email: data.email,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          appLogger.rtk('GET_ME_QUERY_ERROR', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          });
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['me'], // Инвалидируем кэш пользователя при выходе
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        appLogger.rtk('LOGOUT_MUTATION_STARTED', {
          timestamp: new Date().toISOString(),
        });

        try {
          await queryFulfilled;

          appLogger.rtk('LOGOUT_MUTATION_SUCCESS', {
            timestamp: new Date().toISOString(),
          });

          // Очищаем cookies при выходе из системы
          // Это важно для безопасности - удаляем все токены
          appLogger.rtk('LOGOUT_CLEARING_COOKIES', {
            timestamp: new Date().toISOString(),
          });
          deleteCookie('accessToken');
          deleteCookie('refreshToken');

          // Сбрасываем состояние RTK Query
          appLogger.rtk('LOGOUT_RESETTING_API_STATE', {
            timestamp: new Date().toISOString(),
          });
          dispatch(authApi.util.resetApiState());
        } catch (error) {
          appLogger.rtk('LOGOUT_MUTATION_ERROR', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          });
        }
      },
    }),

    register: builder.mutation<
      void,
      {
        username: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: '/auth/registration',
        method: 'POST',
        body: body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log(
            'Registration successful. Check your email for confirmation.'
          );
        } catch (error) {
          // TODO: DISPATCH TOAST ERROR
          console.log('Registration failed:', error);
        }
      },
    }),
    confirmEmail: builder.mutation<void, { code: string }>({
      query: (body) => ({
        url: '/auth/registration-confirmation',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useRegisterMutation,
  usePasswordRecoveryMutation,
  useNewPasswordMutation,
  useRecoveryPasswordResendingMutation,
  useConfirmEmailMutation,
} = authApi;
