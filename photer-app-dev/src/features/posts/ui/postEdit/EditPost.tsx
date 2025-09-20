'use client';
import Image from 'next/image';
import { Button, IconSprite, Textarea } from '@/shared/ui';
import { ConfirmCloseModal } from './ConfirmCloseModal';
import { ReactNode } from 'react';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { AvatarWithName } from '../postView/AvatarWithName';
import { PostType } from '../../lib/post.types';
import { useEditPost } from '../../hooks/edit/useEditPost';

const MAX_SYMBOL_COUNT = 500;

type Props = {
  post: PostType;
  onCloseAction: () => void;
};

export const EditPost = ({ post, onCloseAction }: Props): ReactNode => {
  const {
    editPostRef,
    description,
    openConfirmClose,
    setOpenConfirmClose,
    isUpdating,
    handleChange,
    confirmChange,
    handleAccept,
    handleDecline,
    handleUpdatePost,
  } = useEditPost({
    post,
    onCloseAction,
    MAX_SYMBOL_COUNT,
  });

  console.log('post', post);
  return (
    <div
      ref={editPostRef}
      className="bg-dark-300 border-dark-100 flex w-full flex-col rounded-[2px] border-[1px]"
    >
      <div className="border-dark-100 flex justify-between border-b-[1px] px-[24px] py-[12px]">
        <h2 className="text-light-100 text-[20px] font-bold">Edit Post</h2>
        <button onClick={confirmChange} className="outline-none">
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
              />
              <span className="text-light-900">
                {description ? description.length : 0}/{MAX_SYMBOL_COUNT}
              </span>
            </div>
          </div>
          <Button
            onClick={handleUpdatePost}
            disabled={isUpdating}
            className="ml-auto"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
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
