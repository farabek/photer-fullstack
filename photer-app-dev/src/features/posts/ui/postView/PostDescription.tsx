import Image from 'next/image';
import { ReactNode } from 'react';
import { useTimeAgo } from '../../hooks/view/useTimePost';
import { PostType } from '../../lib/post.types';

type Props = {
  post: PostType;
};

export const PostDescription = ({ post }: Props): ReactNode => {
  const timeAgo = useTimeAgo(post.createdAt);

  // Debug logging for PostDescription
  console.log('=== POST DESCRIPTION RENDER ===', {
    postId: post.id,
    description: post.description,
    descriptionLength: post.description?.length || 0,
    isVirtualPost: post.id.startsWith('virtual-'),
    timestamp: new Date().toISOString(),
  });
  return (
    <div className="relative flex gap-[12px]">
      <div className="relative flex h-[36px] min-w-[36px] items-center justify-center overflow-hidden rounded-full object-cover">
        <Image
          src={post.owner.avatarUrl || '/images/expired.png'}
          alt={'avatar'}
          fill
          sizes="36px"
          className="object-cover"
          priority
          unoptimized
        />
      </div>
      <div className="flex w-full flex-col">
        <p
          className="text-light-100 text-[14px]"
          data-testid="post-description"
        >
          <span className="mr-1 font-bold">{post.owner.userName}</span>
          {post.description}
        </p>
        <div className="flex justify-between">
          <div className="text-light-900 flex gap-[12px] text-[12px]">
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
