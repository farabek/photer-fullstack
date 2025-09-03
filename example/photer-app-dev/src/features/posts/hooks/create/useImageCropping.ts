'use client';

import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/shared/state/store';
import { PhotoSettings } from '../../lib/post.types';
import { setPhotoSettings } from '../../model/postSlice';
import { PixelCrop } from '../../lib/aspectRatios';

type useImageCroppingReturn = {
  onCropComplete: (_: unknown, croppedAreaPixels: PixelCrop) => void;
  handleCropChange: (crop: { x: number; y: number }) => void;
  croppedAreaPixels: PixelCrop | null;
};

export const useImageCropping = (
  currentPhoto: PhotoSettings
): useImageCroppingReturn => {
  const dispatch = useAppDispatch();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(
    null
  );

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: PixelCrop) => {
      setCroppedAreaPixels(croppedAreaPixels);
      dispatch(
        setPhotoSettings({
          croppedAreaPixels,
          croppedWidth: croppedAreaPixels.width,
          croppedHeight: croppedAreaPixels.height,
        })
      );
    },
    [dispatch]
  );

  const handleCropChange = useCallback(
    (crop: { x: number; y: number }) => {
      dispatch(setPhotoSettings({ ...currentPhoto, crop }));
    },
    [dispatch, currentPhoto]
  );

  return {
    onCropComplete,
    handleCropChange,
    croppedAreaPixels,
  };
};
