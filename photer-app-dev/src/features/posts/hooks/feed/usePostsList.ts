import { RootState, useAppDispatch } from '@/shared/state/store';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { postsApi, useLazyGetProfilePostsQuery } from '../../api/postsApi';
import { useSelector } from 'react-redux';
import { Posts } from '../../lib/post.types';
import { cachedProfilePages } from '../../model/postSlice';
import { useInfiniteScroll } from './useInfiniteScroll';

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
  const [getProfilePosts, { isFetching, error }] = useLazyGetProfilePostsQuery();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const pageNumber = useSelector(
    (state: RootState) => state.post.cachedProfilePages
  );

  const postsFromCache = useSelector(
    (state: RootState) =>
      postsApi.endpoints.getProfilePosts.select({
        profileId,
        pageNumber,
      })(state).data
  );

  const [posts, setPosts] = useState<Posts | undefined>(
    postsFromCache && postsFromCache.items && postsFromCache.items.length > 0
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
    // Priority: postsFromCache (if has data) > ssrPosts > current posts
    if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length > 0
    ) {
      setPosts(postsFromCache);
    } else if (
      ssrPosts &&
      ssrPosts.items &&
      ssrPosts.items.length > 0 &&
      !posts
    ) {
      setPosts(ssrPosts);
    } else if (
      postsFromCache &&
      postsFromCache.items &&
      postsFromCache.items.length === 0 &&
      postsFromCache.totalCount === 0
    ) {
      // Only set empty cache if we don't have SSR posts
      if (!ssrPosts || !ssrPosts.items || ssrPosts.items.length === 0) {
        setPosts(postsFromCache);
      }
    }
  }, [postsFromCache, ssrPosts, posts]);

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
