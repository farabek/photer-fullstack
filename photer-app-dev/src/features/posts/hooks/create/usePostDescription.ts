import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { closeModal } from '@/shared/state/slices/modalSlice';
import { useCreatePostMutation } from '@/features/posts/api/postsApi';
import { errorHandler } from '../../lib/errorHandler';
import { goToStep, resetPhotoFilter, resetState } from '../../model/postSlice';

const MAX_DESCRIPTION_LENGTH = 500;

type FormData = {
  description: string;
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
  const photos = useSelector((state: RootState) => state.post.photos);
  const currentIndex = useSelector(
    (state: RootState) => state.post.currentPhotoIndex
  );

  const [createPost] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      description: description || '',
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

      await createPost(formData).unwrap();
      dispatch(resetState());
      onClose();
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
