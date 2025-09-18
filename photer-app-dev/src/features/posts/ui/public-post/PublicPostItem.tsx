import Link from 'next/link';
import { Carousel } from '@/shared/ui';
import Image from 'next/image';
import { AvatarWithName } from '@/features/posts/ui/postView/AvatarWithName';
import { useTimeAgo } from '@/features/posts/hooks/view/useTimePost';
import { Description } from '@/entities/post/ui/Description';
import { PostType } from '@/features/posts/lib/post.types';
import { ReactElement } from 'react';

type Props = {
  post: PostType;
};

export const PublicPostItem = ({ post }: Props): ReactElement => {
  const timeAgo = useTimeAgo(post.createdAt);

  return (
    <div className="flex h-98 w-58 flex-col">
      <Link
        href={`/profile/${post.owner.userId}/post/${post.id}`}
        className="h-60 shrink-0"
      >
        <Carousel className="relative h-full">
          {post.photos.map((photo, index) => (
            <Image
              key={index}
              src={photo}
              alt="Post image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority={index === 0}
            />
          ))}
        </Carousel>
      </Link>

      <Link href={`/profile/${post.owner.userId}`}>
        <AvatarWithName
          avatarUrl={post.owner.avatarUrl}
          userName={post.owner.userName}
          className="text-blue-500"
          avatarClassName="border-2 border-blue-500"
        />
      </Link>

      <span className="small-text text-light-900">{timeAgo}</span>

      <Description description={post.description} />
    </div>
  );
};
