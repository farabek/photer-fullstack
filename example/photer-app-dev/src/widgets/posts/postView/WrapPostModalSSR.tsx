'use client';
import { PostModal } from './PostModal';
import { PostType } from '@/features/posts/lib/post.types';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

type Props = {
  post: PostType;
  profileId?: string;
};

export const WrapPostModalSSR = ({ post, profileId }: Props): ReactElement => {
  const router = useRouter();
  const handleClose = (): void => {
    router.push(`/profile/${profileId}`);
  };

  return <PostModal onCloseAction={handleClose} post={post} />;
};
