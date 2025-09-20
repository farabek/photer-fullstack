'use client';

import Cropper from 'react-easy-crop';
import { Modal } from '@/widgets/modal/Modal';
import { Button, IconSprite } from '@/shared/ui';
import { RootState } from '@/shared/state/store';
import { useSelector } from 'react-redux';
import { CroppingModalHeader } from './CroppingModalHeader';
import { CroppingModalSettings } from './CroppingModalSettings';
import { cn } from '@/shared/lib/cn';
import { ThumbnailsPreview } from './ThumbnailsPreview';
import { PhotoNavigation } from '../../PhotoNavigation';
import { usePhotoNavigation } from '@/features/posts/hooks/create/usePhotoNavigation';
import { useImageCropping } from '@/features/posts/hooks/create/useImageCropping';
import { useImageEditor } from '@/features/posts/hooks/create/useImageEditor';
import { useImageSave } from '@/features/posts/hooks/create/useImageSave';
import { useImageAspect } from '@/features/posts/hooks/create/useImageAspect';
import { aspectRatios } from '@/features/posts/lib/aspectRatios';

type CropStep = { onCloseAction: () => void };

export function CropStep({ onCloseAction }: CropStep): React.ReactElement {
  const photos = useSelector((state: RootState) => state.post.photos);
  const currentIndex = useSelector(
    (state: RootState) => state.post.currentPhotoIndex
  );
  const currentPhoto = photos[currentIndex];

  // Если нет фото - показываем сообщение
  if (!currentPhoto) {
    return (
      <Modal onClose={onCloseAction} open={true}>
        <div className="flex h-[400px] w-full items-center justify-center bg-gray-200 text-gray-500">
          No Photo Available - Photos: {photos.length}, Index: {currentIndex}
        </div>
      </Modal>
    );
  }

  const { hasNext, hasPrev, goNext, goPrev } = usePhotoNavigation();

  const { onCropComplete, handleCropChange, croppedAreaPixels } =
    useImageCropping(currentPhoto);

  const {
    croppedViewSettings,
    setZoom,
    setRotation,
    handleToggleSetting,
    handleCropRatioChange,
  } = useImageEditor(currentPhoto);

  const { confirmCropping } = useImageSave(currentPhoto);

  const { getCropperAspect } = useImageAspect(currentPhoto);

  return (
    <Modal
      onClose={onCloseAction}
      headerContent={
        <CroppingModalHeader
          stepToGo="filters"
          stepToBack="upload"
          onNext={() => confirmCropping(croppedAreaPixels)}
        />
      }
      size="md"
      open={true}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-[400px] w-full">
          <Cropper
            image={currentPhoto.url}
            key={`cropper-${currentPhoto.url}-${currentIndex}`}
            crop={currentPhoto.crop}
            zoom={currentPhoto.zoom}
            rotation={currentPhoto.rotation}
            onCropChange={handleCropChange}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={true}
            aspect={getCropperAspect()}
            classes={{
              containerClassName: 'bg-black rounded-lg',
              mediaClassName: 'object-contain',
              cropAreaClassName: 'border-2 border-blue-500',
            }}
          />
          <div className="">
            <PhotoNavigation
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>
        </div>

        {/*Кнопки под фото*/}
        <div className="mt-4 flex w-full max-w-md justify-between">
          {/*Кнопки редактирования изображения*/}
          <CroppingModalSettings
            zoom={currentPhoto.zoom}
            rotation={currentPhoto.rotation}
            croppedViewSettings={croppedViewSettings}
            aspectRatios={aspectRatios.map((ratio) =>
              ratio.label === 'Original'
                ? { ...ratio, value: currentPhoto.naturalAspect }
                : ratio
            )}
            onZoomChangeAction={setZoom}
            onRotationChangeAction={setRotation}
            onToggleSettingAction={handleToggleSetting}
            onCropRatioChangeAction={handleCropRatioChange}
            currentCropRatio={currentPhoto.cropRatio}
          />

          {/*кнопка переключения выбранного изображения*/}
          <div>
            <div className="relative">
              <Button
                variant="text"
                className={cn(
                  'bg-dark-500 group w-0 border-0 focus:border-0 active:border-0'
                )}
                onClick={() => handleToggleSetting('thumbnails')}
              >
                <IconSprite
                  iconName={'image-outline'}
                  className={cn(
                    'fill-light-100 transition-colors duration-200',
                    {
                      'fill-accent-500': croppedViewSettings.thumbnails,
                    }
                  )}
                />
              </Button>

              {croppedViewSettings.thumbnails && (
                <ThumbnailsPreview
                  photos={photos.map((photo) => photo.url)}
                  currentIndex={currentIndex}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
