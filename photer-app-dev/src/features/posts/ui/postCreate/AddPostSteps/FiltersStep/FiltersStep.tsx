'use client';

import type React from 'react';
import { Modal } from '@/widgets/modal/Modal';
import { FiltersGrid } from './FiltersGrid';
import { filters } from './filters';
import { AddPostModalHeader } from '../../AddPostModalHeader';
import { PhotoPreviewWithNav } from '../../PhotoPreviewWithNav';
import { useFiltersStep } from '@/features/posts/hooks/create/useFiltersStep';

export function FiltersStep({
  onCloseAction,
}: {
  onCloseAction: () => void;
}): React.ReactElement {
  const {
    currentPhoto,
    handleFilterChange,
    handleNext,
    handleBack,
    goNext,
    goPrev,
    hasNext,
    hasPrev,
  } = useFiltersStep();

  return (
    <Modal
      onClose={onCloseAction}
      headerContent={
        <AddPostModalHeader
          onBack={handleBack}
          onNext={handleNext}
          disabled={false}
          title="Filters"
        />
      }
      size="md"
      open={true}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center">
        <PhotoPreviewWithNav
          url={currentPhoto.url}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={goPrev}
          onNext={goNext}
          filterClass={
            filters.find((f) => f.name === currentPhoto.filter)?.className ?? ''
          }
        />

        <FiltersGrid
          filters={filters}
          currentFilter={currentPhoto.filter || ''}
          currentPhotoUrl={currentPhoto.url}
          onFilterChange={handleFilterChange}
        />
      </div>
    </Modal>
  );
}
