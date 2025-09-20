import { useState } from 'react';
import { useUploadPhotos } from '@/features/posts/hooks/create/useUploadPhotos';
import {
  useDraftStorage,
  Draft,
} from '@/features/posts/hooks/create/useDraftStorage';
import { Button, IconSprite } from '@/shared/ui';
import { Card } from '@/widgets/card/card';
import { Modal } from '@/widgets/modal/Modal';
import { FileValidationModal } from '@/features/posts/ui/postView/FileValidationModal';

type UploadStepProps = {
  onCloseAction: () => void;
  onDraftSelected?: (draft: Draft) => void;
};

export function UploadStep({
  onCloseAction,
  onDraftSelected,
}: UploadStepProps): React.ReactElement {
  const { handleFileChange, isValidationModalOpen, closeValidationModal } =
    useUploadPhotos();
  const { drafts, deleteDraft } = useDraftStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const handleOpenDraft = () => {
    setShowDrafts(true);
  };

  const handleDraftSelect = (draft: Draft) => {
    if (onDraftSelected) {
      onDraftSelected(draft);
    }
    setShowDrafts(false);
  };

  const handleDraftDelete = (draftId: string) => {
    deleteDraft(draftId);
  };

  if (showDrafts) {
    return (
      <Modal open onClose={() => setShowDrafts(false)} title="Select Draft">
        <div className="flex flex-col gap-4">
          {drafts.length === 0 ? (
            <p className="text-center text-gray-500">No drafts available</p>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                onClick={() => handleDraftSelect(draft)}
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {draft.description || 'Untitled draft'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {draft.photos.length} photo
                    {draft.photos.length !== 1 ? 's' : ''} •
                    {draft.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDraftDelete(draft.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outlined" onClick={() => setShowDrafts(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <>
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
          <Button
            className="w-[220px]"
            variant="outlined"
            onClick={handleOpenDraft}
            disabled={drafts.length === 0}
          >
            Open Draft
          </Button>
        </div>
      </Modal>
      <FileValidationModal
        open={isValidationModalOpen}
        onClose={closeValidationModal}
      />
    </>
  );
}
