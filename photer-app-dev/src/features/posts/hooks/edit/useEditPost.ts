import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { PostType } from '../../lib/post.types';
import { useUpdatePostMutation } from '../../api/postsApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/state/store';
import { authApi } from '@/features/auth/api/authApi';

type PropsHookEditPost = {
  onCloseAction: () => void;
  MAX_SYMBOL_COUNT: number;
  post: PostType;
};

type HookEditPost = {
  description: string;
  openConfirmClose: boolean;
  editPostRef: RefObject<HTMLDivElement | null>;
  isUpdating: boolean;
  handleChange: (text: string) => void;
  setOpenConfirmClose: (value: boolean) => void;
  confirmChange: () => void;
  handleAccept: () => void;
  handleUpdatePost: () => Promise<void>;
  handleDecline: () => void;
};

export function useEditPost({
  onCloseAction,
  MAX_SYMBOL_COUNT,
  post,
}: PropsHookEditPost): HookEditPost {
  const [description, setDescription] = useState(post.description);
  const [originalDescription] = useState(post.description); // Сохраняем оригинальное описание
  const editPostRef = useRef<HTMLDivElement>(null);
  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatePost] = useUpdatePostMutation();

  // Проверяем состояние аутентификации
  const userId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );
  const isAuthenticated = !!userId;

  const handleChange = (text: string): void => {
    if (text.length <= MAX_SYMBOL_COUNT) {
      setDescription(text);
    }
  };

  const confirmChange = useCallback((): void => {
    const hasChanges = description !== originalDescription;
    if (!hasChanges) {
      onCloseAction();
    } else {
      setOpenConfirmClose(true);
    }
  }, [description, originalDescription, onCloseAction]);

  const handleAccept = (): void => {
    setOpenConfirmClose(false);
    onCloseAction();
  };

  const handleDecline = (): void => {
    setOpenConfirmClose(false);
  };

  const handleUpdatePost = async (): Promise<void> => {
    if (isUpdating) {
      return;
    } // Предотвращаем повторные клики

    console.log('🔄 [UPDATE POST] Starting update process', {
      postId: post.id,
      originalDescription: originalDescription,
      newDescription: description,
      hasChanges: description !== originalDescription,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });

    // Проверяем состояние аутентификации
    if (!isAuthenticated) {
      console.warn(
        '⚠️ [UPDATE POST] User not authenticated, cannot update post'
      );
      alert('You need to be logged in to update posts.');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('📤 [UPDATE POST] Sending API request...');
      const result = await updatePost({
        postId: post.id,
        description,
      }).unwrap();

      console.log('✅ [UPDATE POST] API request successful', {
        result,
        postId: post.id,
        updatedDescription: description,
        isAuthenticated,
        timestamp: new Date().toISOString(),
      });

      // Показываем уведомление об успешном сохранении
      alert('Post updated successfully!');

      console.log('🔒 [UPDATE POST] Closing modal...');
      // После успешного обновления закрываем модал
      onCloseAction();

      console.log('✅ [UPDATE POST] Update process completed successfully');
    } catch (error: any) {
      console.error('❌ [UPDATE POST] Failed to update post:', {
        error,
        postId: post.id,
        description,
        isAuthenticated,
        errorData: error?.data,
        errorMessage: error?.message,
        timestamp: new Date().toISOString(),
      });

      // Показываем более понятное сообщение об ошибке
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Failed to update post. Please try again.';

      alert(errorMessage);
    } finally {
      setIsUpdating(false);
      console.log(
        '🏁 [UPDATE POST] Finally block executed, isUpdating set to false'
      );
    }
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent): void => {
      if (
        editPostRef.current &&
        !editPostRef.current.contains(event.target as Node)
      ) {
        confirmChange();
      }
    },
    [confirmChange]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
    editPostRef,
    description,
    openConfirmClose,
    setOpenConfirmClose,
    confirmChange,
    handleAccept,
    handleUpdatePost,
    handleDecline,
    isUpdating,
    handleChange,
  };
}
