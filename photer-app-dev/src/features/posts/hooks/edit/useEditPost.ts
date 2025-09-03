import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { PostType } from '../../lib/post.types';
import { useUpdatePostMutation } from '../../api/postsApi';

type PropsHookEditPost = {
  onCloseAction: () => void;
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
  handleUpdatePost: () => void;
  handleDecline: () => void;
};

export function useEditPost({
  onCloseAction,
  MAX_SYMBOL_COUNT,
  post,
}: PropsHookEditPost): HookEditPost {
  const [description, setDescription] = useState(post.description);
  const editPostRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef(description);
  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  const handleChange = (text: string): void => {
    if (text.length <= MAX_SYMBOL_COUNT) {
      setDescription(text);
    }
  };

  const confirmChange = useCallback((): void => {
    if (post.description === descriptionRef.current) {
      onCloseAction();
    } else {
      setOpenConfirmClose(true);
    }
  }, [onCloseAction, post.description]);

  const handleAccept = (): void => {
    setOpenConfirmClose(false);
    onCloseAction();
  };

  const handleDecline = (): void => {
    setOpenConfirmClose(false);
  };

  const handleUpdatePost = (): void => {
    updatePost({ postId: Number(post.id), description });
    onCloseAction();
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
  };
}
