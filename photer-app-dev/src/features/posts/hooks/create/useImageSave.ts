import { useCallback } from 'react';
import { useAppDispatch } from '@/shared/state/store';

import { PhotoSettings } from '../../lib/post.types';
import { goToStep, setPhotoSettings } from '../../model/postSlice';
import { PixelCrop } from '../../lib/aspectRatios';

type useImageSaveReturn = {
  confirmCropping: (croppedAreaPixels: PixelCrop | null) => Promise<void>;
};

// считает размер bounding-box для прямоугольника width×height после вращения
function getRotatedSize(
  width: number,
  height: number,
  rotation: number
): { width: number; height: number } {
  const rad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad)),
    height: Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad)),
  };
}

export const useImageSave = (
  currentPhoto: PhotoSettings
): useImageSaveReturn => {
  const dispatch = useAppDispatch();

  const confirmCropping = useCallback(
    async (croppedAreaPixels: PixelCrop | null) => {
      if (!croppedAreaPixels) {
        return;
      }

      try {
        const finalUrl = await getCroppedImg(
          currentPhoto.url,
          croppedAreaPixels,
          currentPhoto.rotation
        );

        // Сбрасываем поворот — картинка уже «запечена»
        dispatch(setPhotoSettings({ rotation: 0 }));

        // Сохраняем новый URL и параметры обрезки
        dispatch(
          setPhotoSettings({
            url: finalUrl,
            croppedAreaPixels,
            croppedWidth: croppedAreaPixels.width,
            croppedHeight: croppedAreaPixels.height,
          })
        );

        dispatch(goToStep('filters'));
      } catch (e) {
        console.error('Error in getCroppedImg:', e);
      }
    },
    [currentPhoto.url, currentPhoto.rotation, dispatch]
  );

  return { confirmCropping };
};

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0
): Promise<string> => {
  // 1. Загружаем исходное изображение
  const img = new Image();
  img.src = imageSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = (): void => resolve();
    img.onerror = (): void => reject(new Error('Image load error'));
  });
  // 2. Сначала создаём canvas, на котором рисуем полное повернутое изображение
  const fullW = img.width;
  const fullH = img.height;
  const { width: rotW, height: rotH } = getRotatedSize(fullW, fullH, rotation);

  const canvasRot = document.createElement('canvas');
  canvasRot.width = rotW;
  canvasRot.height = rotH;
  const ctxRot = canvasRot.getContext('2d');
  if (!ctxRot) {
    throw new Error('Canvas context not available');
  }

  // Центрируем и поворачиваем
  ctxRot.translate(rotW / 2, rotH / 2);
  ctxRot.rotate((rotation * Math.PI) / 180);
  ctxRot.translate(-fullW / 2, -fullH / 2);
  // Рисуем всё изображение
  ctxRot.drawImage(img, 0, 0);

  // 3. Теперь обрезаем нужную область из canvasRot
  const { x, y, width: cropW, height: cropH } = pixelCrop;
  const canvasCrop = document.createElement('canvas');
  canvasCrop.width = cropW;
  canvasCrop.height = cropH;
  const ctxCrop = canvasCrop.getContext('2d');
  if (!ctxCrop) {
    throw new Error('Canvas context not available');
  }

  ctxCrop.drawImage(
    canvasRot,
    x, // начало в повернутом канвасе
    y,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  // 4. Экспортируем в blob и возвращаем URL
  return new Promise<string>((resolve, reject) => {
    canvasCrop.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('Canvas is empty'));
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
};
