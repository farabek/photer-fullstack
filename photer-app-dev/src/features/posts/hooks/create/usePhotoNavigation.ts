import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/state/store';
import { setCurrentPhotoIndex } from '../../model/postSlice';

type usePhotoNavigationReturn = {
  hasNext: boolean;
  hasPrev: boolean;
  goNext: () => void;
  goPrev: () => void;
};

export function usePhotoNavigation(): usePhotoNavigationReturn {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.post.photos);
  const currentIndex = useSelector(
    (state: RootState) => state.post.currentPhotoIndex
  );

  const hasNext = currentIndex < photos.length - 1;
  const hasPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    if (hasNext) {
      dispatch(setCurrentPhotoIndex(currentIndex + 1));
    }
  }, [dispatch, currentIndex, hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) {
      dispatch(setCurrentPhotoIndex(currentIndex - 1));
    }
  }, [dispatch, currentIndex, hasPrev]);

  return {
    hasNext,
    hasPrev,
    goNext,
    goPrev,
  };
}
