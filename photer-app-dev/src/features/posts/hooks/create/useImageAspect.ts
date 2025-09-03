import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/shared/state/store';
import { PhotoSettings } from '../../lib/post.types';
import { setPhotoSettings } from '../../model/postSlice';
import { aspectRatios } from '../../lib/aspectRatios';

type useImageAspectReturn = { getCropperAspect: () => number };

export const useImageAspect = (
  currentPhoto: PhotoSettings
): useImageAspectReturn => {
  const dispatch = useAppDispatch();

  const getImageAspectRatio = useCallback(() => {
    const img = new Image();
    img.onerror = (): void => {
      dispatch(setPhotoSettings({ ...currentPhoto, naturalAspect: 1 }));
    };
    img.onload = (): void => {
      const aspect = img.naturalWidth / img.naturalHeight;
      dispatch(setPhotoSettings({ ...currentPhoto, naturalAspect: aspect }));
    };
    img.src = currentPhoto.url;
  }, [dispatch, currentPhoto]);

  useEffect(() => {
    if (!currentPhoto.naturalAspect) {
      getImageAspectRatio();
    }
  }, [getImageAspectRatio, currentPhoto.naturalAspect]);

  const getCropperAspect = useCallback(() => {
    if (!currentPhoto.cropRatio || currentPhoto.cropRatio === 'Original') {
      return currentPhoto.naturalAspect;
    }
    const selectedRatio = aspectRatios.find(
      (ratio) => ratio.label === currentPhoto.cropRatio
    );
    return selectedRatio?.value || currentPhoto.naturalAspect;
  }, [currentPhoto.cropRatio, currentPhoto.naturalAspect]);

  return {
    getCropperAspect,
  };
};
