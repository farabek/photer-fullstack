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
  handleDelete: () => Promise<void>;
};

export const usePostModal = ({
  post,
  onCloseAction,
}: Props): usePostModalReturn => {
  const [deletePost] = useDeletePostMutation();

  const userId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );

  // Проверяем, что текущий пользователь является владельцем поста.
  // Сравниваем не только userId, но и username владельца поста с username из URL,
  // чтобы избежать ложноположительных срабатываний из-за кэширования данных.
  const isOwner = userId ? post?.owner.userId === userId : false;

  const handleDelete = async (): Promise<void> => {
    try {
      deletePost(post.id).unwrap();
      onCloseAction();
    } catch (e) {
      errorHandler(e);
    }
  };
  return {
    userId,
    isOwner,
    handleDelete,
  };
};
