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
  const {
    data: comments,
    isLoading,
    error,
  } = useGetPostCommentsQuery(postId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log('=== COMMENTS LIST DEBUG ===', {
    postId,
    commentsCount: comments?.length || 0,
    isLoading,
    hasError: !!error,
    timestamp: new Date().toISOString(),
  });

  if (isLoading) {
    return (
      <div className="text-light-900 py-4 text-center text-sm">
        Загрузка комментариев...
      </div>
    );
  }

  if (error) {
    console.error('Failed to load comments:', error);
    return (
      <div className="py-4 text-center text-sm text-red-400">
        Ошибка загрузки комментариев
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-light-900 py-4 text-center text-sm">
        Нет комментариев
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment: CommentType) => (
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
