import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/shared/state/store';
import { PhotoSettings } from '../../lib/post.types';
import { setPhotoSettings } from '../../model/postSlice';
import { aspectRatios } from '../../lib/aspectRatios';

type useImageEditorReturn = {
  croppedViewSettings: {
    zoom: boolean;
    rotation: boolean;
    ratio: boolean;
    thumbnails: boolean;
  };
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  handleCropRatioChange: (ratio: string) => void;
  handleToggleSetting: (
    type: 'zoom' | 'rotation' | 'ratio' | 'thumbnails'
  ) => void;
};

export const useImageEditor = (
  currentPhoto: PhotoSettings
): useImageEditorReturn => {
  const dispatch = useAppDispatch();
  const [croppedViewSettings, setCroppedViewSettings] = useState({
    zoom: false,
    rotation: false,
    ratio: false,
    thumbnails: false,
  });

  const setZoom = useCallback(
    (zoom: number) => {
      dispatch(setPhotoSettings({ ...currentPhoto, zoom }));
    },
    [dispatch, currentPhoto]
  );

  // Поворот сохраняется странно
  const setRotation = useCallback(
    (rotation: number) => {
      dispatch(setPhotoSettings({ ...currentPhoto, rotation }));
    },
    [dispatch, currentPhoto]
  );

  const handleToggleSetting = useCallback(
    (type: 'zoom' | 'rotation' | 'ratio' | 'thumbnails') => {
      setCroppedViewSettings((prev) => ({
        ...prev,
        zoom: type === 'zoom' ? !prev.zoom : false,
        rotation: type === 'rotation' ? !prev.rotation : false,
        ratio: type === 'ratio' ? !prev.ratio : false,
        thumbnails: type === 'thumbnails' ? !prev.thumbnails : false,
      }));
    },
    []
  );

  const handleCropRatioChange = useCallback(
    (ratio: string) => {
      const selectedRatio = aspectRatios.find((r) => r.label === ratio);
      dispatch(
        setPhotoSettings({
          cropRatio: ratio,
          ...(selectedRatio && {
            croppedWidth: selectedRatio.value * 100,
            croppedHeight: 100,
          }),
        })
      );
    },
    [dispatch]
  );

  return {
    croppedViewSettings,
    setZoom,
    setRotation,
    handleToggleSetting,
    handleCropRatioChange,
  };
};
