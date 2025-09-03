import { CropStep } from './AddPostSteps/CropStep/CropStep';
import { DescriptionStep } from './AddPostSteps/DescriptionStep/DescriptionStep';
import { FiltersStep } from './AddPostSteps/FiltersStep/FiltersStep';
import { UploadStep } from './AddPostSteps/UploadStep/UploadStep';

type StepRendererProps = {
  step: string;
  onClose: () => void;
};

export function StepRenderer({
  step,
  onClose,
}: StepRendererProps): React.ReactElement | null {
  switch (step) {
    case 'upload':
      return <UploadStep onCloseAction={onClose} />;
    case 'crop':
      return <CropStep onCloseAction={onClose} />;
    case 'filters':
      return <FiltersStep onCloseAction={onClose} />;
    case 'description':
      return <DescriptionStep onCloseAction={onClose} />;
    default:
      return null;
  }
}
