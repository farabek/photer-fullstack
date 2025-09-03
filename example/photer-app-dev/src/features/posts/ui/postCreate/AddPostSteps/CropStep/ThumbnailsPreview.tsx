'use client';

import {
  addPhotos,
  deletePhoto,
  setCurrentPhotoIndex,
} from '@/features/posts/model/postSlice';
import { useAppDispatch } from '@/shared/state/store';
import { Button, IconSprite } from '@/shared/ui';
import { toast } from 'react-toastify';
import { default as NextImage } from 'next/image';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type ThumbnailsPreviewProps = {
  photos: string[];
  currentIndex: number;
};

export function ThumbnailsPreview({
  photos,
  currentIndex,
}: ThumbnailsPreviewProps): React.ReactElement {
  const dispatch = useAppDispatch();
  // Определяем видимые фотографии на основе currentIndex
  const visiblePhotos = [];

  if (currentIndex === 0) {
    // Если первая фотография, показываем ее и следующую
    visiblePhotos.push(photos[0]);
    if (photos.length > 1) {
      visiblePhotos.push(photos[1]);
    }
  } else if (currentIndex === photos.length - 1) {
    // Если последняя фотография, показываем предыдущую и ее
    visiblePhotos.push(photos[currentIndex - 1]);
    visiblePhotos.push(photos[currentIndex]);
  } else {
    // Иначе показываем текущую и следующую
    visiblePhotos.push(photos[currentIndex]);
    visiblePhotos.push(photos[currentIndex + 1]);
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    const input = event.currentTarget;
    if (!files || files.length === 0) {
      return;
    }

    const oversizedFiles = Array.from(files).filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES
    );
    if (oversizedFiles.length > 0) {
      toast.error(`The photo must be less than ${MAX_FILE_SIZE_MB}
    Mb and have JPEG or PNG
    format`);
      input.value = '';
      return;
    }
    if (files) {
      const newPhotosPromises = Array.from(files).map((file) => {
        return new Promise<{
          url: string;
          crop: { x: number; y: number };
          zoom: number;
          rotation: number;
          croppedAreaPixels: null;
          naturalAspect: number;
          originalWidth: number;
          originalHeight: number;
        }>((resolve) => {
          const url = URL.createObjectURL(file);
          const img = new Image();

          img.onload = (): void => {
            resolve({
              url,
              crop: { x: 0, y: 0 },
              zoom: 1,
              rotation: 0,
              croppedAreaPixels: null,
              naturalAspect: img.naturalWidth / img.naturalHeight,
              originalWidth: img.naturalWidth,
              originalHeight: img.naturalHeight,
            });
          };

          img.onerror = (): void => {
            // В случае ошибки загрузки изображения
            resolve({
              url,
              crop: { x: 0, y: 0 },
              zoom: 1,
              rotation: 0,
              croppedAreaPixels: null,
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
    }
  };

  const handlePrev = (): void => {
    dispatch(setCurrentPhotoIndex(Math.max(0, currentIndex - 1)));
  };

  const handleNext = (): void => {
    dispatch(
      setCurrentPhotoIndex(Math.min(currentIndex + 1, photos.length - 1))
    );
  };
  const onDeletePhoto = (index: number): void => {
    URL.revokeObjectURL(photos[index]);
    dispatch(deletePhoto(index));
    if (index === currentIndex) {
      dispatch(setCurrentPhotoIndex(Math.max(0, currentIndex - 1)));
    }
  };

  return (
    <div className="bg-dark-500/80 absolute right-0 bottom-10 max-w-[244px] min-w-[152px] rounded-xs border-0 p-3">
      <div className="flex items-center justify-between gap-2">
        {visiblePhotos.map((photo, index) => {
          const photoIndex =
            currentIndex === 0
              ? index
              : currentIndex === photos.length - 1
                ? currentIndex - 1 + index
                : currentIndex + index;
          return (
            <div key={photoIndex} className="relative">
              <button
                onClick={() => dispatch(setCurrentPhotoIndex(photoIndex))}
                className={`h-20 w-20 p-0 ${currentIndex === photoIndex ? 'ring-2 ring-blue-500' : ''}`}
              >
                <NextImage
                  src={photo}
                  alt={`Preview ${photoIndex}`}
                  className="h-20 w-20 object-cover"
                  width={1000}
                  height={1000}
                  unoptimized
                />
              </button>
              <button
                onClick={() => onDeletePhoto(photoIndex)}
                className="bg-dark-500/80 absolute top-1 right-1 h-4 w-4 rounded-full p-0"
              >
                <IconSprite iconName="close" width={16} height={16} />
              </button>
            </div>
          );
        })}
        <div className="flex flex-col items-center gap-2">
          <Button asChild variant="text" className="w-0 cursor-pointer p-3">
            <label htmlFor="file-input">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <IconSprite
                iconName={'plus-circle-outline'}
                width={24}
                height={24}
              />
            </label>
          </Button>
          {photos.length > 2 && (
            <div className="flex items-center gap-2">
              <Button
                variant="text"
                className="w-0 cursor-pointer p-2"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <IconSprite
                  iconName={'arrow-ios-back'}
                  width={24}
                  height={24}
                />
              </Button>
              <Button
                variant="text"
                className="w-0 cursor-pointer p-2"
                onClick={handleNext}
                disabled={currentIndex >= photos.length - 1}
              >
                <IconSprite
                  iconName={'arrow-ios-forward'}
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
