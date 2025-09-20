import { RootState, useAppDispatch } from '@/shared/state/store';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { postsApi, useLazyGetProfilePostsQuery } from '../../api/postsApi';
import { useSelector } from 'react-redux';
import { Posts } from '../../lib/post.types';
import { cachedProfilePages, setPostCreated } from '../../model/postSlice';
import { useInfiniteScroll } from './useInfiniteScroll';
import { authApi } from '@/features/auth/api/authApi';

type Props = {
  ssrPosts?: Posts;
  profileId: string;
};
type usePostsListReturn = {
  posts: Posts | undefined;
  isFetching: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean | undefined;
  error: string | null;
  retry: () => void;
};
export const usePostsList = ({
  ssrPosts,
  profileId,
}: Props): usePostsListReturn => {
  const dispatch = useAppDispatch();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [getProfilePosts, { isFetching, error }] =
    useLazyGetProfilePostsQuery();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const pageNumber = useSelector(
    (state: RootState) => state.post.cachedProfilePages
  );

  const postCreated = useSelector((state: RootState) => state.post.postCreated);

  // Получаем информацию об авторизации
  const userId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );
  const isAuthenticated = !!userId;

  const postsFromCache = useSelector(
    (state: RootState) =>
      postsApi.endpoints.getProfilePosts.select({
        profileId,
        pageNumber,
      })(state).data
  );

  // Функция для проверки свежести кэша
  const isCacheStale = (cacheData: Posts | undefined): boolean => {
    if (!cacheData || !cacheData.items || cacheData.items.length === 0) {
      return false;
    }

    // Если пользователь не авторизован, но кэш содержит данные - считаем кэш устаревшим
    if (
      !isAuthenticated &&
      cacheData.items.some((item) => item.owner.userId === profileId)
    ) {
      console.log(
        'Cache is stale: user not authenticated but cache has private data'
      );
      return true;
    }

    // Если пользователь авторизован, но кэш создан до авторизации
    if (isAuthenticated && cacheData.items.some((item) => !item.owner.userId)) {
      console.log(
        'Cache is stale: authenticated user but cache has incomplete data'
      );
      return true;
    }

    return false;
  };

  const [posts, setPosts] = useState<Posts | undefined>(
    postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length > 0 &&
      !isCacheStale(postsFromCache)
      ? postsFromCache
      : ssrPosts
  );

  // Handle errors from API calls
  useEffect(() => {
    if (error) {
      setFetchError('Failed to load posts. Please try again.');
    } else {
      setFetchError(null);
    }
  }, [error]);

  useEffect(() => {
    // Добавляем отладочную информацию
    console.log('usePostsList useEffect Debug:', {
      profileId,
      postCreated,
      postsFromCache: postsFromCache
        ? {
            itemsCount: postsFromCache.items?.length || 0,
            totalCount: postsFromCache.totalCount,
            hasData: !!(
              postsFromCache.items && postsFromCache.items.length > 0
            ),
          }
        : null,
      ssrPosts: ssrPosts
        ? {
            itemsCount: ssrPosts.items?.length || 0,
            totalCount: ssrPosts.totalCount,
            hasData: !!(ssrPosts.items && ssrPosts.items.length > 0),
          }
        : null,
      currentPosts: posts
        ? {
            itemsCount: posts.items?.length || 0,
            totalCount: posts.totalCount,
          }
        : null,
      timestamp: new Date().toISOString(),
    });

    // Priority: fresh postsFromCache > current posts (if cache invalidated) > ssrPosts (fallback)
    if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length > 0 &&
      !isCacheStale(postsFromCache) // Проверяем свежесть кэша
    ) {
      console.log(
        '✅ [USE POSTS LIST] Setting posts from fresh cache (has data)',
        {
          cacheItemsCount: postsFromCache.items.length,
          isAuthenticated,
          timestamp: new Date().toISOString(),
        }
      );
      setPosts(postsFromCache);
    } else if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length === 0 &&
      postsFromCache.totalCount === 0
    ) {
      // Empty cache - use it only if post was created (to clear old data)
      if (postCreated) {
        console.log(
          '🗂️ [USE POSTS LIST] Setting empty cache (postCreated:',
          postCreated,
          ')'
        );
        setPosts(postsFromCache);
      }
    } else if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length > 0 &&
      isCacheStale(postsFromCache) // Кэш устарел
    ) {
      console.log(
        '⚠️ [USE POSTS LIST] Ignoring stale cache, waiting for fresh data',
        {
          isAuthenticated,
          cacheItemsCount: postsFromCache.items.length,
          hasOwnerIds: postsFromCache.items.some((item) => item.owner.userId),
          timestamp: new Date().toISOString(),
        }
      );
      // НЕ устанавливаем устаревший кэш, ждем свежие данные
    } else if (
      !postsFromCache && // Кэш не загружен или инвалидирован
      posts && // У нас есть текущие посты
      posts.items &&
      posts.items.length > 0
    ) {
      // Сохраняем текущие посты, не сбрасываем на SSR
      console.log(
        '🔄 [USE POSTS LIST] Keeping current posts (cache invalidated, waiting for refresh)',
        {
          currentPostsCount: posts.items.length,
          timestamp: new Date().toISOString(),
        }
      );
      // НЕ вызываем setPosts - оставляем текущие данные
    } else if (
      ssrPosts &&
      ssrPosts.items &&
      ssrPosts.items.length > 0 &&
      !postCreated && // Игнорируем SSR данные если пост был создан
      !posts // Используем SSR только если у нас нет текущих постов
    ) {
      console.log(
        '📄 [USE POSTS LIST] Setting posts from SSR (postCreated:',
        postCreated,
        ')',
        {
          ssrItemsCount: ssrPosts.items.length,
          timestamp: new Date().toISOString(),
        }
      );
      setPosts(ssrPosts);
    } else {
      console.log('❓ [USE POSTS LIST] No data source matched', {
        hasPostsFromCache: !!postsFromCache,
        cacheItemsCount: postsFromCache?.items?.length || 0,
        isCacheStale: postsFromCache ? isCacheStale(postsFromCache) : false,
        hasCurrentPosts: !!posts,
        currentPostsCount: posts?.items?.length || 0,
        hasSsrPosts: !!ssrPosts,
        ssrPostsCount: ssrPosts?.items?.length || 0,
        postCreated,
        isAuthenticated,
        timestamp: new Date().toISOString(),
      });
    }

    // Сбрасываем флаг postCreated после обновления
    if (postCreated) {
      console.log('Resetting postCreated flag');
      dispatch(setPostCreated(false));
    }
  }, [postsFromCache, ssrPosts, postCreated, dispatch]);

  useEffect(() => {
    if (!postsFromCache && ssrPosts) {
      dispatch(cachedProfilePages(1));
      const thunk = postsApi.util.upsertQueryData(
        'getProfilePosts',
        {
          profileId,
          pageNumber: 1,
        },
        ssrPosts
      );
      dispatch(thunk);
    }

    // Если кэш устарел, принудительно перезагружаем данные
    if (postsFromCache && isCacheStale(postsFromCache)) {
      console.log(
        '🔄 [USE POSTS LIST] Force reloading data due to stale cache',
        {
          profileId,
          isAuthenticated,
          postsFromCache: postsFromCache
            ? {
                itemsCount: postsFromCache.items?.length || 0,
                hasOwnerIds:
                  postsFromCache.items?.some((item) => item.owner.userId) ||
                  false,
              }
            : null,
        }
      );
      dispatch(cachedProfilePages(1));
      getProfilePosts({ profileId, pageNumber: 1 });
    }
    // Проверяем, что у нас есть посты в кеше и они принадлежат другому пользователю
    // Добавляем проверку на существование items и его длину для предотвращения ошибок
    if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length > 0 &&
      postsFromCache.items[0].owner &&
      postsFromCache.items[0].owner.userId &&
      profileId !== postsFromCache.items[0].owner.userId
    ) {
      dispatch(cachedProfilePages(1));
      dispatch(postsApi.util.invalidateTags(['Posts']));
      getProfilePosts({ profileId, pageNumber: 1 });
    }
  }, [
    dispatch,
    postsFromCache,
    ssrPosts,
    profileId,
    pageNumber,
    getProfilePosts,
    isAuthenticated,
  ]);

  const hasMore = posts && posts?.page < posts?.pagesCount;

  const fetchNewPartPosts = useCallback(() => {
    dispatch(cachedProfilePages(posts!.page + 1));
    getProfilePosts({ profileId, pageNumber });
  }, [dispatch, posts, profileId, pageNumber, getProfilePosts]);

  const retry = useCallback(() => {
    setFetchError(null);
    dispatch(cachedProfilePages(1));
    getProfilePosts({ profileId, pageNumber: 1 });
  }, [dispatch, profileId, pageNumber, getProfilePosts]);

  useInfiniteScroll({ callback: fetchNewPartPosts, hasMore, triggerRef });

  return {
    posts,
    isFetching,
    triggerRef,
    hasMore,
    error: fetchError,
    retry,
  };
};
