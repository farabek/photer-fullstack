import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { closeModal } from '@/shared/state/slices/modalSlice';
import {
  useCreatePostMutation,
  postsApi,
  useLazyGetProfilePostsQuery,
} from '@/features/posts/api/postsApi';
import { authApi } from '@/features/auth/api/authApi';
import { errorHandler } from '../../lib/errorHandler';
import {
  goToStep,
  resetPhotoFilter,
  resetState,
  setDescription,
  setTags,
  setPostCreated,
} from '../../model/postSlice';

const MAX_DESCRIPTION_LENGTH = 500;

type FormData = {
  description: string;
  tags: string;
};

export function usePostDescription(onClose: () => void): {
  register: UseFormReturn<FormData>['register'];
  handleSubmit: UseFormReturn<FormData>['handleSubmit'];
  errors: UseFormReturn<FormData>['formState']['errors'];
  isValid: UseFormReturn<FormData>['formState']['isValid'];
  isDescriptionValid: boolean;
  characterCount: number;
  onSubmit: SubmitHandler<FormData>;
  handleBack: () => void;
  currentPhoto: { url: string } | undefined;
} {
  const dispatch = useAppDispatch();
  const description = useSelector((state: RootState) => state.post.description);
  const tags = useSelector((state: RootState) => state.post.tags);
  const photos = useSelector((state: RootState) => state.post.photos);
  const currentIndex = useSelector(
    (state: RootState) => state.post.currentPhotoIndex
  );

  // Получаем profileId из auth state
  const profileId = useSelector(
    (state: RootState) => authApi.endpoints.getMe.select()(state).data?.userId
  );

  const [createPost] = useCreatePostMutation();
  const [getProfilePosts] = useLazyGetProfilePostsQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      description: description || '',
      tags: tags?.join(', ') || '',
    },
    mode: 'onChange',
  });

  const descriptionValue = watch('description');
  const characterCount = descriptionValue.length;
  const isDescriptionValid = characterCount <= MAX_DESCRIPTION_LENGTH;

  const handleBack = (): void => {
    dispatch(resetPhotoFilter());
    dispatch(goToStep('filters'));
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const formData = new FormData();

      if (photos.length === 0) {
        console.error('No photos to upload');
        return;
      }

      // Parse tags from comma-separated string
      const tagsArray = data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Update Redux state
      dispatch(setDescription(data.description));
      dispatch(setTags(tagsArray));

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          const timestamp = new Date().getTime();
          const filename = `photo_${timestamp}_${i}.jpg`;
          const file = new File([blob], filename, {
            type: blob.type || 'image/jpeg',
          });
          formData.append('files', file);
        } catch (error) {
          console.error(`Error fetching photo ${i}:`, error);
        }
      }

      dispatch(closeModal());

      formData.append('description', data.description);
      if (tagsArray.length > 0) {
        formData.append('tags', JSON.stringify(tagsArray));
      }

      await createPost(formData).unwrap();

      dispatch(resetState());
      onClose();

      // Устанавливаем флаг создания поста ПОСЛЕ resetState
      console.log('Setting postCreated flag to true');
      dispatch(setPostCreated(true));

      // Принудительно обновляем кэш постов пользователя
      console.log('Invalidating Posts cache');
      dispatch(postsApi.util.invalidateTags(['Posts']));

      // Дополнительно обновляем конкретный запрос постов пользователя
      console.log('Refetching Posts cache');
      dispatch(postsApi.util.invalidateTags(['Posts']));

      // Принудительно обновляем кэш для конкретного профиля
      console.log('Invalidating specific profile posts cache');
      dispatch(
        postsApi.util.invalidateTags([
          { type: 'Posts', id: 'PROFILE_POSTS_LIST' },
        ])
      );

      // Принудительно запрашиваем обновленные данные
      if (profileId) {
        console.log('Force refetching profile posts for profileId:', profileId);
        getProfilePosts({ profileId, pageNumber: 1 });
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isDescriptionValid,
    characterCount,
    onSubmit,
    handleBack,
    currentPhoto: photos[currentIndex],
  };
}
