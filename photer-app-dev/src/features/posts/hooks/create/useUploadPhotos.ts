import { useAppDispatch } from '@/shared/state/store';
import { ChangeEvent, useCallback, useState } from 'react';
import { addPhotos } from '../../model/postSlice';
import { PhotoSettings } from '../../lib/post.types';

// PhotoData теперь соответствует PhotoSettings, но без опциональных полей
export type PhotoData = Omit<PhotoSettings, 'originalUrl' | 'filter' | 'cropRatio' | 'croppedWidth' | 'croppedHeight'>;

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function useUploadPhotos(): {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValidationModalOpen: boolean;
  closeValidationModal: () => void;
} {
  const dispatch = useAppDispatch();
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const closeValidationModal = useCallback(() => {
    setIsValidationModalOpen(false);
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const input = event.currentTarget;
      const files = event.target.files;

      if (!files || files.length === 0) {
        return;
      }

      // Validate file size
      const oversizedFiles = Array.from(files).filter(
        (file) => file.size > MAX_FILE_SIZE_BYTES
      );

      // Validate file format
      const invalidFormatFiles = Array.from(files).filter(
        (file) => !file.type.startsWith('image/') ||
                 (!file.type.includes('jpeg') && !file.type.includes('png'))
      );

      if (oversizedFiles.length > 0 || invalidFormatFiles.length > 0) {
        setIsValidationModalOpen(true);
        input.value = '';
        return;
      }

      const newPhotosPromises = Array.from(files).map((file) => {
        return new Promise<PhotoData>((resolve) => {
          const url = URL.createObjectURL(file);
          const img = new Image();

          img.onload = (): void => {
            resolve({
              url,
              crop: { x: 0, y: 0 },
              zoom: 1,
              rotation: 0,
              croppedAreaPixels: null as const,
              naturalAspect: img.naturalWidth / img.naturalHeight,
              originalWidth: img.naturalWidth,
              originalHeight: img.naturalHeight,
            });
          };

          img.onerror = (): void => {
            resolve({
              url,
              crop: { x: 0, y: 0 },
              zoom: 1,
              rotation: 0,
              croppedAreaPixels: null as const,
              naturalAspect: 1,
              originalWidth: 100,
              originalHeight: 100,
            });
          };

          img.src = url;
        });
      });

      Promise.all(newPhotosPromises).then((newPhotos) => {
        dispatch(addPhotos(newPhotos));
      });
    },
    [dispatch]
  );

  return {
    handleFileChange,
    isValidationModalOpen,
    closeValidationModal
  };
}
