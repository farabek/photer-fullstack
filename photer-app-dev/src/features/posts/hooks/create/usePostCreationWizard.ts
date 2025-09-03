import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { closeModal } from '@/shared/state/slices/modalSlice';
import { resetState } from '../../model/postSlice';

type UsePostCreationWizardReturn = {
  currentStep: string;
  showExitConfirm: boolean;
  handleCloseModal: () => void;
  handleConfirmExit: () => void;
  handleCancelExit: () => void;
};

export function usePostCreationWizard(): UsePostCreationWizardReturn {
  const { currentStep } = useSelector((state: RootState) => state.post);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const dispatch = useAppDispatch();

  const handleCloseModal = (): void => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = (): void => {
    dispatch(resetState());
    dispatch(closeModal());
    setShowExitConfirm(false);
  };

  const handleCancelExit = (): void => {
    setShowExitConfirm(false);
  };

  return {
    currentStep,
    showExitConfirm,
    handleCloseModal,
    handleConfirmExit,
    handleCancelExit,
  };
}
