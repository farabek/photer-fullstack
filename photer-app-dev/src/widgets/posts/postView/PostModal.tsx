'use client';

import React, { ReactNode, useState } from 'react';
import { EditPost } from '@/features/posts/ui/postEdit/EditPost';
import { EllipsisMenu } from '@/features/posts/ui/postView/EllipsisMenu';
import { ViewPost } from '@/features/posts';
import { PostModalWrapper } from '@/features/posts/ui/postView/PostWrapper';
import { PostType } from '@/features/posts/lib/post.types';
import { usePostModal } from '@/features/posts/hooks/view/usePostModal';
import { useGetPostQuery } from '@/features/posts/api/postsApi';

type Props = {
  post: PostType;
  onCloseAction: () => void;
  onPostUpdated?: (updatedPost: PostType) => void;
};

export const PostModal = ({
  onCloseAction,
  post,
  onPostUpdated,
}: Props): ReactNode => {
  const [isEdit, setIsEdit] = useState(false);

  // Используем RTK Query для получения актуальных данных поста
  const { data: currentPost } = useGetPostQuery(post.id, {
    skip: !post.id,
  });

  // Используем актуальные данные поста или исходные
  const displayPost = currentPost || post;

  const { userId, isOwner, handleDelete } = usePostModal({
    onCloseAction,
    post: displayPost,
  });

  console.log('📋 [POST MODAL] Render state', {
    isEdit,
    userId,
    isOwner,
    postId: displayPost.id,
    postOwnerId: displayPost.owner.userId,
    showEditButton: isOwner && !isEdit,
    hasCurrentPost: !!currentPost,
    description: displayPost.description,
    timestamp: new Date().toISOString(),
  });

  const handleEditClose = (): void => {
    setIsEdit(false);
    // После завершения редактирования, уведомляем родителя об обновлении
    if (onPostUpdated && currentPost) {
      onPostUpdated(currentPost);
    }
  };

  return (
    <PostModalWrapper onCloseAction={onCloseAction}>
      {!isEdit ? (
        <ViewPost isAuthorized={!!userId} post={displayPost} isOwner={isOwner}>
          {isOwner && (
            <EllipsisMenu
              menuItems={[
                {
                  title: 'Edit post',
                  iconName: 'edit-2-outline',
                  callback: (): void => {
                    setIsEdit(true);
                  },
                },
                {
                  title: 'Delete post',
                  iconName: 'trash-outline',
                  callback: handleDelete,
                },
              ]}
            />
          )}
        </ViewPost>
      ) : (
        <EditPost post={displayPost} onCloseAction={handleEditClose} />
      )}
    </PostModalWrapper>
  );
};
