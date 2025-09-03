import { baseApi } from '@/shared/lib/baseApi';
import { ProfileGenIfo, UploadAvatarResponse } from '../lib/profile.types';
import { ProfileGenInfoSchema } from '../general-iformation/genInfoSchema';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ProfileGenIfo, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    createProfileGenInfo: builder.mutation<ProfileGenIfo, ProfileGenInfoSchema>(
      {
        query: (data) => ({
          url: '/profile',
          method: 'POST',
          body: data,
        }),
      }
    ),
    updateProfileGenInfo: builder.mutation<
      ProfileGenIfo,
      { id: string; data: ProfileGenInfoSchema }
    >({
      query: ({ id, data }) => ({
        url: `/profile/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    uploadAvatar: builder.mutation<string, FormData>({
      query: (formData) => ({
        url: '/profile/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      transformResponse: (response: UploadAvatarResponse) => response.fileUrl,
      invalidatesTags: ['Profile'], // This will refetch profile data after upload
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useCreateProfileGenInfoMutation,
  useUpdateProfileGenInfoMutation,
  useUploadAvatarMutation,
} = profileApi;
