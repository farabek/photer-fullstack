'use client';
import Image from 'next/image';
import { Button, IconSprite, Textarea } from '@/shared/ui';
import { ConfirmCloseModal } from './ConfirmCloseModal';
import { ReactNode, useEffect } from 'react';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { AvatarWithName } from '../postView/AvatarWithName';
import { PostType } from '../../lib/post.types';
import { useEditPost } from '../../hooks/edit/useEditPost';

const MAX_SYMBOL_COUNT = 500;

type Props = {
  post: PostType;
  onReturnToView: () => void; // Changed from onCloseAction to stay on post page
  onPostUpdated?: (updatedPost: PostType) => void;
};

export const EditPost = ({
  post,
  onReturnToView,
  onPostUpdated,
}: Props): ReactNode => {
  const {
    editPostRef,
    description,
    openConfirmClose,
    setOpenConfirmClose,
    handleChange,
    confirmChange,
    handleAccept,
    handleDecline,
    handleUpdatePost,
    isUpdating,
    hasChanges,
    saveStatus,
  } = useEditPost({
    post,
    onReturnToView,
    onPostUpdated,
    MAX_SYMBOL_COUNT,
  });

  // Prevent editing virtual posts (they don't exist in database)
  const isVirtualPost = post.id.startsWith('virtual-');

  useEffect(() => {
    if (isVirtualPost) {
      console.warn('Attempted to edit virtual post, closing edit mode', {
        postId: post.id,
        isVirtualPost,
      });
      // Use setTimeout to defer the state update
      setTimeout(() => onReturnToView(), 0);
    }
  }, [isVirtualPost, onReturnToView, post.id]);

  if (isVirtualPost) {
    return null;
  }

  // Debug logging for EditPost
  console.log('=== EDIT POST COMPONENT DEBUG ===', {
    postId: post.id,
    originalDescription: post.description,
    originalDescriptionLength: post.description?.length || 0,
    currentDescription: description,
    currentDescriptionLength: description?.length || 0,
    hasChanges: hasChanges,
    isUpdating: isUpdating,
    saveStatus: saveStatus,
    timestamp: new Date().toISOString(),
  });
  return (
    <div
      ref={editPostRef}
      className="bg-dark-300 border-dark-100 flex w-full flex-col rounded-[2px] border-[1px]"
      data-testid="edit-post-modal"
    >
      <div className="border-dark-100 flex justify-between border-b-[1px] px-[24px] py-[12px]">
        <h2 className="text-light-100 text-[20px] font-bold">Edit Post</h2>
        <button
          onClick={confirmChange}
          className="outline-none"
          data-testid="edit-close-button"
        >
          <IconSprite iconName="close" />
        </button>
      </div>
      <div className="flex h-full">
        <Carousel className="relative flex-1">
          {post.photos.map((photo, index: number) => (
            <div key={index} className="relative h-full w-full">
              <img
                src={photo}
                alt={'Post image'}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </Carousel>
        <div className="flex flex-1 flex-col justify-between px-[24px] pb-[24px]">
          <div>
            <AvatarWithName
              avatarUrl={post.owner.avatarUrl}
              userName={post.owner.userName}
            />
            <div className="flex flex-col items-end justify-between pb-[32px]">
              <Textarea
                label="Add publication descriptions"
                value={description ? description : ''}
                onValueChange={handleChange}
                className="w-full"
                data-testid="edit-description"
                data-cy="edit-description-textarea"
              />
              <div className="flex items-center gap-2">
                <span className="text-light-900">
                  {description ? description.length : 0}/{MAX_SYMBOL_COUNT}
                </span>
                {/* Save status indicator */}
                {saveStatus !== 'idle' && (
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      saveStatus === 'saving'
                        ? 'bg-blue-100 text-blue-600'
                        : saveStatus === 'saved'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {saveStatus === 'saving' && 'Saving...'}
                    {saveStatus === 'saved' && 'Saved ✓'}
                    {saveStatus === 'error' && 'Save failed'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpdatePost}
            className="ml-auto"
            disabled={!hasChanges || isUpdating}
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved ✓'}
            {saveStatus === 'error' && 'Try Again'}
            {saveStatus === 'idle' &&
              (isUpdating ? 'Saving...' : 'Save Changes')}
          </Button>
        </div>
      </div>
      <ConfirmCloseModal
        open={openConfirmClose}
        onAccept={handleAccept}
        onDecline={handleDecline}
        close={() => setOpenConfirmClose(false)}
      />
    </div>
  );
};
