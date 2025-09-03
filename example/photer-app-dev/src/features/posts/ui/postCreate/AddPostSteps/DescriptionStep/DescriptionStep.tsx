'use client';
import React from 'react';
import { Modal } from '@/widgets/modal/Modal';
import { PhotoPreviewTextArea } from './PhotoPreviewTextArea';
import { AddPostModalHeader } from '../../AddPostModalHeader';
import { PhotoPreviewWithNav } from '../../PhotoPreviewWithNav';
import { usePostDescription } from '@/features/posts/hooks/create/usePostDescription';
import { usePhotoNavigation } from '@/features/posts/hooks/create/usePhotoNavigation';

const MAX_DESCRIPTION_LENGTH = 500;

export function DescriptionStep({
  onCloseAction,
}: {
  onCloseAction: () => void;
}): React.ReactElement {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isDescriptionValid,
    characterCount,
    onSubmit,
    handleBack,
    currentPhoto,
  } = usePostDescription(onCloseAction);

  const { hasNext, hasPrev, goNext, goPrev } = usePhotoNavigation();

  return (
    <Modal
      onClose={onCloseAction}
      headerContent={
        <AddPostModalHeader
          onBack={handleBack}
          onNext={handleSubmit(onSubmit)}
          disabled={!isValid || !isDescriptionValid}
          title="Publication"
          text={'Publish'}
        />
      }
      size="md"
      open
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <PhotoPreviewWithNav
          url={currentPhoto?.url}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={goPrev}
          onNext={goNext}
        />

        <PhotoPreviewTextArea
          register={register}
          errorMessage={errors.description?.message}
          characterCount={characterCount}
          maxLength={MAX_DESCRIPTION_LENGTH}
          isValid={isDescriptionValid}
        />
      </form>
    </Modal>
  );
}
