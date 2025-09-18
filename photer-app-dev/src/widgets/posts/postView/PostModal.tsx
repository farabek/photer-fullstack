'use client';

import React, { ReactNode, useState } from 'react';
import { EditPost } from '@/features/posts/ui/postEdit/EditPost';
import { EllipsisMenu } from '@/features/posts/ui/postView/EllipsisMenu';
import { ViewPost } from '@/features/posts';
import { PostModalWrapper } from '@/features/posts/ui/postView/PostWrapper';
import { PostType } from '@/features/posts/lib/post.types';
import { usePostModal } from '@/features/posts/hooks/view/usePostModal';

type Props = {
  post: PostType;
  onCloseAction: () => void;
};

export const PostModal = ({ onCloseAction, post }: Props): ReactNode => {
  const [isEdit, setIsEdit] = useState(false);

  const { userId, isOwner, handleDelete } = usePostModal({
    onCloseAction,
    post,
  });

  return (
    <PostModalWrapper onCloseAction={onCloseAction}>
      {!isEdit ? (
        <ViewPost isAuthorized={!!userId} post={post} isOwner={isOwner}>
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
        <EditPost post={post} onCloseAction={() => setIsEdit(false)} />
      )}
    </PostModalWrapper>
  );
};
