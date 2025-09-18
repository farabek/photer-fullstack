import { baseApi } from '@/shared/lib/baseApi';

// DTO устройства/сессии (контракт фронта; должен соответствовать бэку)
export type DeviceSessionDto = {
  deviceId: string;
  title: string;
  lastActiveDate: string; // ISO
  ip: string;
};

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<DeviceSessionDto[], void>({
      query: () => ({ url: '/security/devices', method: 'GET' }),
      providesTags: ['Devices'],
    }),
    terminateAllOtherSessions: builder.mutation<
      { message: string; terminatedCount: number },
      void
    >({
      query: () => ({ url: '/security/devices', method: 'DELETE' }),
      invalidatesTags: ['Devices'],
    }),
    terminateDeviceSession: builder.mutation<
      { message: string; deviceId: string },
      string
    >({
      query: (deviceId) => ({
        url: `/security/devices/${deviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Devices'],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useTerminateAllOtherSessionsMutation,
  useTerminateDeviceSessionMutation,
} = securityApi;
