import { RootState, useAppDispatch } from '@/shared/state/store';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { usePhotoNavigation } from './usePhotoNavigation';
import { PhotoSettings } from '../../lib/post.types';
import { useFilterSave } from './useFilterSave';
import {
  goToStep,
  resetPhotoCrop,
  setPhotoSettings,
} from '../../model/postSlice';

type UseFiltersStepResult = {
  currentPhoto: PhotoSettings;
  selectedFilter: string;
  handleFilterChange: (filterName: string) => void;
  handleNext: () => Promise<void>;
  handleBack: () => void;
  goNext: () => void;
  goPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export const useFiltersStep = (): UseFiltersStepResult => {
  const dispatch = useAppDispatch();
  const photos = useSelector((state: RootState) => state.post.photos);
  const currentIndex = useSelector(
    (state: RootState) => state.post.currentPhotoIndex
  );
  const currentPhoto = photos[currentIndex];
  const [selectedFilter, setSelectedFilter] = useState(
    currentPhoto.filter || 'Оригинал'
  );
  const { hasNext, hasPrev, goNext, goPrev } = usePhotoNavigation();
  const { handleSaveWithFilter } = useFilterSave(currentPhoto);

  const handleFilterChange = (filterName: string): void => {
    setSelectedFilter(filterName);
    dispatch(setPhotoSettings({ filter: filterName }));
  };

  const handleNext = async (): Promise<void> => {
    handleSaveWithFilter(selectedFilter);
  };

  const handleBack = (): void => {
    dispatch(resetPhotoCrop());
    dispatch(goToStep('crop'));
  };

  return {
    currentPhoto,
    selectedFilter,
    handleFilterChange,
    handleNext,
    handleBack,
    goNext,
    goPrev,
    hasNext,
    hasPrev,
  };
};
