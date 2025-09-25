import { useState } from 'react';
import { useUploadPhotos } from '@/features/posts/hooks/create/useUploadPhotos';
import { useDraftStorage, Draft } from '@/features/posts/hooks/create/useDraftStorage';
import { Button, IconSprite } from '@/shared/ui';
import { Card } from '@/widgets/card/card';
import { Modal } from '@/widgets/modal/Modal';
import { FileValidationModal } from './FileValidationModal';

/**
 * Props for UploadStep component
 */
type UploadStepProps = {
  /** Callback function called when user wants to close the upload step */
  onCloseAction: () => void;
  /** Optional callback function called when a draft is selected */
  onDraftSelected?: (draft: Draft) => void;
};

export function UploadStep({
  onCloseAction,
  onDraftSelected,
}: UploadStepProps): React.ReactElement {
  const { handleFileChange, isValidationModalOpen, closeValidationModal } = useUploadPhotos();
  const { drafts, deleteDraft } = useDraftStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  /**
   * Handle opening the drafts modal
   */
  const handleOpenDraft = () => {
    setShowDrafts(true);
  };

  /**
   * Handle draft selection
   * @param draft The selected draft
   */
  const handleDraftSelect = (draft: Draft) => {
    if (onDraftSelected) {
      onDraftSelected(draft);
    }
    setShowDrafts(false);
  };

  /**
   * Handle draft deletion
   * @param draftId ID of the draft to delete
   */
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
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              onClick={() => handleDraftSelect(draft)}
              role="button"
              tabIndex={0}
              aria-label={`Select draft: ${draft.description || 'Untitled draft'} with ${draft.photos.length} photo${draft.photos.length !== 1 ? 's' : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDraftSelect(draft);
                }
              }}
            >
                <div className="flex-1">
                  <p className="font-medium">
                    {draft.description || 'Untitled draft'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {draft.photos.length} photo{draft.photos.length !== 1 ? 's' : ''} •
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
                  aria-label={`Delete draft: ${draft.description || 'Untitled draft'}`}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
          <div className="flex justify-end gap-2 mt-4">
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
        <Card
          className="flex min-h-[220px] min-w-[220px] items-center justify-center"
          role="img"
          aria-label="Upload area for photos"
        >
          <IconSprite iconName={'image-outline'} width={48} height={48} aria-hidden="true" />
        </Card>
          <Button asChild className="w-[220px]">
            <label>
              Select from computer
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg"
                className="hidden"
                aria-label="Select photos from computer"
                onChange={handleFileChange}
              />
            </label>
          </Button>
          <Button
            className="w-[220px]"
            variant="outlined"
            onClick={handleOpenDraft}
            disabled={drafts.length === 0}
            aria-label={drafts.length === 0 ? "No drafts available" : "Open saved drafts"}
            aria-describedby="draft-count"
          >
            Open Draft
            {drafts.length > 0 && (
              <span id="draft-count" className="sr-only">
                {drafts.length} draft{drafts.length !== 1 ? 's' : ''} available
              </span>
            )}
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
