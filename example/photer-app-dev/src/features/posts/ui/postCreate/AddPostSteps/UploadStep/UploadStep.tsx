import { useUploadPhotos } from '@/features/posts/hooks/create/useUploadPhotos';
import { Button, IconSprite } from '@/shared/ui';
import { Card } from '@/widgets/card/card';
import { Modal } from '@/widgets/modal/Modal';

type UploadStepProps = {
  onCloseAction: () => void;
};
export function UploadStep({
  onCloseAction,
}: UploadStepProps): React.ReactElement {
  const { handleFileChange } = useUploadPhotos();

  return (
    <Modal open onClose={onCloseAction}>
      <div className="flex flex-col items-center gap-4">
        <Card className="flex min-h-[220px] min-w-[220px] items-center justify-center">
          <IconSprite iconName={'image-outline'} width={48} height={48} />
        </Card>
        <Button asChild className="w-[220px]">
          <label>
            Select from computer
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </Button>
        <Button className="w-[220px]" variant="outlined">
          Open Draft
        </Button>
      </div>
    </Modal>
  );
}
