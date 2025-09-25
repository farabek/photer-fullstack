'use client';

import { ReactNode } from 'react';
import { useGetPostCommentsQuery } from '../../api/postsApi';
import { CommentType } from '../../api/postsApi';
import { ViewComment } from './ViewComment';

type Props = {
  postId: string;
  isAuthorized: boolean;
};

export const CommentsList = ({ postId, isAuthorized }: Props): ReactNode => {
  // For virtual posts (from home page), don't try to load comments
  const isVirtualPost = postId.startsWith('virtual-');

  const {
    data: comments,
    isLoading,
    error,
  } = useGetPostCommentsQuery(postId, {
    refetchOnMountOrArgChange: !isVirtualPost, // Don't refetch for virtual posts
    refetchOnFocus: !isVirtualPost,
    refetchOnReconnect: !isVirtualPost,
    skip: isVirtualPost, // Skip the query entirely for virtual posts
  });

  // For virtual posts, return empty comments
  const finalComments = isVirtualPost ? [] : comments;
  const finalIsLoading = isVirtualPost ? false : isLoading;
  const finalError = isVirtualPost ? null : error;

  console.log('=== COMMENTS LIST DEBUG ===', {
    postId,
    isVirtualPost,
    commentsCount: finalComments?.length || 0,
    finalIsLoading,
    hasError: !!finalError,
    timestamp: new Date().toISOString(),
  });

  if (finalIsLoading) {
    return (
      <div className="text-light-900 py-4 text-center text-sm">
        Загрузка комментариев...
      </div>
    );
  }

  if (finalError) {
    console.error('Failed to load comments:', finalError);
    return (
      <div className="py-4 text-center text-sm text-red-400">
        Ошибка загрузки комментариев
      </div>
    );
  }

  if (!finalComments || finalComments.length === 0) {
    return (
      <div className="text-light-900 py-4 text-center text-sm">
        Нет комментариев
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {finalComments.map((comment: CommentType) => (
        <ViewComment
          key={comment.id}
          comment={comment.text}
          userName={comment.owner.userName}
          avatarUrl={comment.owner.avatarUrl}
          createdAt={comment.createdAt}
          isAuthorized={isAuthorized}
        />
      ))}
    </div>
  );
};
