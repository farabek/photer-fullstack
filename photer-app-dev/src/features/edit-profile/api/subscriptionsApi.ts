import { baseApi } from '@/shared/lib/baseApi';

export type CreateSubscriptionPayload = {
  subscriptionPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  paymentProvider: 'STRIPE' | 'PAYPAL' | 'PAYME';
  baseUrl: string;
};

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      { url: string },
      CreateSubscriptionPayload
    >({
      query: (body) => ({
        url: '/subscriptions',
        method: 'POST',
        body,
      }),
    }),
    getSubscriptions: builder.query<
      {
        items: any[];
        totalCount: number;
        pagesCount: number;
        page: number;
        pageSize: number;
      },
      {
        pageNumber?: number;
        pageSize?: number;
        sortDirection?: 'asc' | 'desc';
        sortBy?: string;
      }
    >({
      query: ({
        pageNumber = 1,
        pageSize = 8,
        sortDirection = 'desc',
        sortBy = 'createdAt',
      } = {}) => ({
        url: `/subscriptions?pageNumber=${pageNumber}&pageSize=${pageSize}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    getMyPayments: builder.query<
      {
        items: any[];
        totalCount: number;
        pagesCount: number;
        page: number;
        pageSize: number;
      },
      {
        pageNumber?: number;
        pageSize?: number;
        sortDirection?: 'asc' | 'desc';
        sortBy?: string;
      }
    >({
      query: ({
        pageNumber = 1,
        pageSize = 8,
        sortDirection = 'desc',
        sortBy = 'dateOfPayment',
      } = {}) => ({
        url: `/subscriptions/my-payments?pageNumber=${pageNumber}&pageSize=${pageSize}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    cancelAutoRenewal: builder.mutation<void, void>({
      query: () => ({
        url: '/subscriptions/cancel-auto-renewal',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
    enableAutoRenewal: builder.mutation<void, void>({
      query: () => ({
        url: '/subscriptions/enable-auto-renewal',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetMyPaymentsQuery,
  useCancelAutoRenewalMutation,
  useEnableAutoRenewalMutation,
} = subscriptionsApi;
