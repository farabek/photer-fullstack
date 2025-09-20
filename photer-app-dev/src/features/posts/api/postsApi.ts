import { baseApi } from '@/shared/lib/baseApi';
import { errorHandler } from '../lib/errorHandler';
import { Posts, PostType } from '../lib/post.types';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Posts, void>({
      query: () => ({
        url: '/posts',
        method: 'GET',
      }),
      providesTags: ['Posts'],
    }),

    getPost: builder.query<PostType, string>({
      query: (id) => ({
        url: `/posts/${id}`,
      }),
      providesTags: (result, error, id) =>
        result ? [{ type: 'Posts', id }] : [],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (e) {
          errorHandler(e);
        }
      },
    }),

    createPost: builder.mutation<PostType, FormData>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body: body,
      }),

      invalidatesTags: [{ type: 'Posts', id: 'PROFILE_POSTS_LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          // Инвалидируем кэш всех profile posts, чтобы они перезагрузились
          dispatch(postsApi.util.invalidateTags(['Posts']));
        } catch (e) {
          errorHandler(e);
        }
      },
    }),

    updatePost: builder.mutation<void, { postId: string; description: string }>(
      {
        query: ({ postId, description }) => {
          console.log('📤 [API UPDATE POST] Building query', {
            postId,
            description,
            url: `/posts/${postId}`,
            method: 'PATCH',
          });
          return {
            url: `/posts/${postId}`,
            method: 'PATCH',
            body: { description },
          };
        },
        invalidatesTags: (result, error, { postId }) => {
          console.log('🏷️ [API UPDATE POST] Invalidating tags', {
            result,
            error,
            postId,
            tags: [
              { type: 'Posts', id: postId },
              { type: 'Posts', id: 'PROFILE_POSTS_LIST' },
              'Posts',
            ],
          });
          return [
            { type: 'Posts', id: postId }, // Инвалидируем конкретный пост
            { type: 'Posts', id: 'PROFILE_POSTS_LIST' }, // Инвалидируем список постов профиля
            'Posts', // Инвалидируем общий тег для всех постов
          ];
        },
        // Optimistic update
        async onQueryStarted(
          { postId, description },
          { dispatch, queryFulfilled }
        ) {
          console.log('🚀 [API UPDATE POST] onQueryStarted called', {
            postId,
            description,
            timestamp: new Date().toISOString(),
          });

          // Оптимистичное обновление для getPost
          console.log('⚡ [API UPDATE POST] Applying optimistic update...');
          const patchResult = dispatch(
            postsApi.util.updateQueryData('getPost', postId, (draft) => {
              console.log('📝 [API UPDATE POST] Updating draft description', {
                oldDescription: draft.description,
                newDescription: description,
                postId: postId,
              });
              draft.description = description;
            })
          );

          try {
            console.log('⏳ [API UPDATE POST] Waiting for server response...');
            const queryResult = await queryFulfilled;
            console.log('✅ [API UPDATE POST] Server response successful', {
              queryResult,
              postId,
              description,
              timestamp: new Date().toISOString(),
            });

            // После успешного обновления инвалидируем все связанные кэши
            console.log('🗂️ [API UPDATE POST] Invalidating cache...');
            dispatch(
              postsApi.util.invalidateTags([
                { type: 'Posts', id: 'PROFILE_POSTS_LIST' },
                'Posts', // Дополнительная инвалидация общего тега
              ])
            );

            console.log('✅ [API UPDATE POST] Cache invalidation completed');
          } catch (e) {
            console.error(
              '❌ [API UPDATE POST] Server request failed, undoing optimistic update',
              {
                error: e,
                postId,
                description,
                timestamp: new Date().toISOString(),
              }
            );
            patchResult.undo();
            errorHandler(e);
          }
        },
      }
    ),
    deletePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Posts', id: postId }, // Инвалидируем конкретный пост
        { type: 'Posts', id: 'PROFILE_POSTS_LIST' }, // Инвалидируем список постов профиля
        'Posts', // Инвалидируем общий тег для всех постов
      ],
      async onQueryStarted(postId, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          // Дополнительная инвалидация всех связанных кэшей
          dispatch(
            postsApi.util.invalidateTags([
              { type: 'Posts', id: 'PROFILE_POSTS_LIST' },
              'Posts',
            ])
          );

          // Обновление локального кэша getProfilePosts
          dispatch(
            postsApi.util.updateQueryData(
              'getProfilePosts',
              { profileId: '', pageNumber: 0 },
              (draft) => {
                // Безопасная проверка на существование items
                if (!draft.items || !Array.isArray(draft.items)) {
                  return;
                }
                const index = draft.items.findIndex((p) => p.id === postId);
                if (index !== -1) {
                  draft.items.splice(index, 1);
                }
              }
            )
          );
        } catch (e) {
          errorHandler(e);
        }
      },
    }),

    getProfilePosts: builder.query<
      Posts,
      { profileId: string; pageNumber: number }
    >({
      query: ({ profileId, pageNumber = 1 }) =>
        `/posts/users/${profileId}?pageNumber=${pageNumber}`,
      keepUnusedDataFor: 300,
      serializeQueryArgs: ({ endpointName }) => `${endpointName}`,
      merge: (currentCacheData, responseData) => {
        // Безопасная проверка на существование items
        const currentItems =
          currentCacheData?.items && Array.isArray(currentCacheData.items)
            ? currentCacheData.items
            : [];
        const responseItems =
          responseData?.items && Array.isArray(responseData.items)
            ? responseData.items
            : [];

        const cashedPostsIds = new Set(currentItems.map((post) => post.id));
        const filteredItems = responseItems.filter(
          (post) => !cashedPostsIds.has(post.id)
        );

        // only if updatedAt in ISO 8601 format("2025-05-24T12:34:56Z") it possible to use localeCompare
        const mergedItems = [...filteredItems, ...currentItems].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );

        // Возвращаем новый объект вместо изменения существующего
        return {
          ...currentCacheData,
          items: mergedItems,
          page: responseData.page,
          pagesCount: responseData.pagesCount,
          pageSize: responseData.pageSize,
          totalCount: responseData.totalCount,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      providesTags: (result) =>
        result && result.items && Array.isArray(result.items)
          ? [
              ...result.items.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'PROFILE_POSTS_LIST' },
            ]
          : [{ type: 'Posts', id: 'PROFILE_POSTS_LIST' }],
    }),
  }),
});

export const {
  useGetPostQuery,
  useUpdatePostMutation,
  useCreatePostMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useGetProfilePostsQuery,
  useLazyGetProfilePostsQuery,
} = postsApi;
