'use client';

import { usePostCreationWizard } from '../../hooks/create/usePostCreationWizard';
import { ExitConfirmation } from './ExitConfirmation';
import { StepRenderer } from './StepRenderer';

export function PostCreationWizard(): React.ReactElement | null {
  const {
    currentStep,
    showExitConfirm,
    handleCloseModal,
    handleConfirmExit,
    handleCancelExit,
  } = usePostCreationWizard();

  return (
    <>
      <StepRenderer step={currentStep} onClose={handleCloseModal} />
      <ExitConfirmation
        open={showExitConfirm}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </>
  );
}
