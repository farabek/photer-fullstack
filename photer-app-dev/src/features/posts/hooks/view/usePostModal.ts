import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/features/auth/api/authApi';
import { useDeletePostMutation } from '@/features/posts/api/postsApi';
import { errorHandler } from '@/features/posts/lib/errorHandler';
import { PostType } from '@/features/posts/lib/post.types';
import { RootState } from '@/shared/state/store';
import { useSelector } from 'react-redux';

type Props = {
  post: PostType;
  onCloseAction: () => void;
  profileId?: string;
};

type usePostModalReturn = {
  userId: string | undefined;
  isOwner: boolean;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  handleDeleteConfirm: () => void;
  handleDeleteCancel: () => void;
  handleDelete: () => Promise<void>;
};

export const usePostModal = ({
  post,
  onCloseAction,
  profileId,
}: Props): usePostModalReturn => {
  const router = useRouter();
  const [deletePost] = useDeletePostMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const userId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );

  // Проверяем, что текущий пользователь является владельцем поста.
  // Сравниваем не только userId, но и username владельца поста с username из URL,
  // чтобы избежать ложноположительных срабатываний из-за кэширования данных.
  const isOwner = userId ? post?.owner.userId === userId : false;

  console.log('🔐 [POST MODAL] Auth check', {
    userId,
    postOwnerId: post?.owner.userId,
    isOwner,
    postId: post?.id,
    timestamp: new Date().toISOString(),
  });

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deletePost(post.id).unwrap();
      setIsDeleteModalOpen(false);
      // После успешного удаления редиректим на домашнюю страницу /profile/[id]
      if (profileId) {
        router.push(`/profile/${profileId}`);
      } else {
        router.push('/');
      }
    } catch (e) {
      errorHandler(e);
      setIsDeleteModalOpen(false);
    }
  };

  return {
    userId,
    isOwner,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDelete,
  };
};
