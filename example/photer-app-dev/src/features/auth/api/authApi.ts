'use client';
import { baseApi } from '@/shared/lib/baseApi';
import { FormSchemaType } from '../forgot-password/types/forgotPasswordFormSchema';
import { User } from '@/shared/types/commonTypes';
import { deleteCookie } from '@/shared/lib/cookies';

/**
 * Типы для авторизации
 *
 * Архитектура токенов:
 * - accessToken: короткий срок жизни (60 сек), используется для API запросов
 * - refreshToken: длинный срок жизни (5 мин), используется для обновления accessToken
 * - Оба токена автоматически управляются через cookies
 */
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string; // Возвращается в теле ответа для совместимости
  // Также автоматически устанавливается в cookie backend'ом
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;

          // Backend автоматически устанавливает cookies:
          // - accessToken в обычный cookie (не httpOnly) - JavaScript может читать
          // - refreshToken в httpOnly cookie - защищен от XSS
          // localStorage больше не нужен - используем cookies для SSR совместимости

          // Загружаем данные пользователя после успешного входа
          await dispatch(authApi.endpoints.getMe.initiate());
        } catch (error) {
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
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        // Очищаем cookies при выходе из системы
        // Это важно для безопасности - удаляем все токены
        deleteCookie('accessToken');
        deleteCookie('refreshToken');

        // Сбрасываем состояние RTK Query
        dispatch(authApi.util.resetApiState());
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
