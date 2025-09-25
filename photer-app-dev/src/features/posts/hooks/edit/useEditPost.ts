import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { PostType } from '../../lib/post.types';
import { useUpdatePostMutation, postsApi } from '../../api/postsApi';
import { errorHandler } from '../../lib/errorHandler';
import { useAppDispatch } from '@/shared/state/store';

type PropsHookEditPost = {
  onReturnToView: () => void; // Changed from onCloseAction to stay on post page
  onPostUpdated?: (updatedPost: PostType) => void;
  MAX_SYMBOL_COUNT: number;
  post: PostType;
};

type HookEditPost = {
  description: string;
  openConfirmClose: boolean;
  editPostRef: RefObject<HTMLDivElement | null>;
  handleChange: (text: string) => void;
  setOpenConfirmClose: (value: boolean) => void;
  confirmChange: () => void;
  handleAccept: () => void;
  handleUpdatePost: () => Promise<void>;
  handleDecline: () => void;
  isUpdating: boolean;
  hasChanges: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
};

export function useEditPost({
  onReturnToView,
  onPostUpdated,
  MAX_SYMBOL_COUNT,
  post,
}: PropsHookEditPost): HookEditPost {
  const [description, setDescription] = useState(post.description);
  const editPostRef = useRef<HTMLDivElement>(null);
  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const dispatch = useAppDispatch();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // Update description when post changes (e.g., after cache invalidation)
  useEffect(() => {
    console.log('=== USE EFFECT - UPDATING DESCRIPTION ===', {
      postId: post.id,
      postDescription: post.description,
      postDescriptionLength: post.description?.length || 0,
      currentDescription: description,
      currentDescriptionLength: description?.length || 0,
      descriptionChanged: post.description !== description,
      timestamp: new Date().toISOString(),
    });
    setDescription(post.description);
  }, [post.description, post.id]);

  const hasChanges = description !== post.description;

  const handleChange = (text: string): void => {
    if (text.length <= MAX_SYMBOL_COUNT) {
      const oldDescription = description;
      console.log('=== TEXT INPUT CHANGE ===', {
        postId: post.id,
        oldDescription: oldDescription,
        oldDescriptionLength: oldDescription?.length || 0,
        newDescription: text,
        newDescriptionLength: text?.length || 0,
        hasChanges: text !== post.description,
        timestamp: new Date().toISOString(),
      });
      setDescription(text);
    }
  };

  const confirmChange = useCallback((): void => {
    if (!hasChanges) {
      onReturnToView();
    } else {
      setOpenConfirmClose(true);
    }
  }, [hasChanges, onReturnToView]);

  const handleAccept = (): void => {
    setOpenConfirmClose(false);
    onReturnToView();
  };

  const handleDecline = (): void => {
    setOpenConfirmClose(false);
  };

  const handleUpdatePost = async (): Promise<void> => {
    try {
      setSaveStatus('saving');
      console.log('=== EDIT POST DEBUG - STARTING UPDATE ===', {
        postId: post.id,
        originalDescription: post.description,
        originalDescriptionLength: post.description?.length || 0,
        newDescription: description,
        newDescriptionLength: description?.length || 0,
        hasChanges: description !== post.description,
        descriptionLength: description?.length || 0,
        timestamp: new Date().toISOString(),
      });

      const result = await updatePost({
        postId: post.id,
        description,
      }).unwrap();

      setSaveStatus('saved');
      console.log('=== EDIT POST DEBUG - UPDATE SUCCESSFUL ===', {
        postId: post.id,
        newDescription: description,
        result,
        timestamp: new Date().toISOString(),
      });

      // Update local state with the saved description to keep it in sync
      // Use post.description in case the server returned a slightly different value
      setDescription(description);

      // Call onPostUpdated callback with updated post data
      if (onPostUpdated) {
        const updatedPost: PostType = {
          ...post,
          description,
          updatedAt: new Date().toISOString(), // Assume server updates this
        };
        console.log('=== EDIT POST DEBUG - CALLING CALLBACK ===', {
          updatedPost: {
            id: updatedPost.id,
            description: updatedPost.description,
            descriptionLength: updatedPost.description?.length || 0,
          },
        });
        onPostUpdated(updatedPost);
      }

      console.log('=== EDIT POST DEBUG - RETURNING TO VIEW MODE ===');
      // Instead of closing the modal, return to view mode
      // The PostModal will handle this via handleCloseEdit callback

      // Reset save status after showing success for 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('=== EDIT POST DEBUG - UPDATE FAILED ===', {
        postId: post.id,
        error,
        timestamp: new Date().toISOString(),
      });
      errorHandler(error);
      // Не закрываем модальное окно при ошибке, чтобы пользователь мог повторить попытку
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
    handleChange,
    openConfirmClose,
    setOpenConfirmClose,
    confirmChange,
    handleAccept,
    handleUpdatePost,
    handleDecline,
    isUpdating,
    hasChanges,
    saveStatus,
  };
}
