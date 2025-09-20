import { useState, useCallback } from 'react';
import { PhotoData } from './useUploadPhotos';

export type Draft = {
  id: string;
  photos: PhotoData[];
  description: string;
  timestamp: Date;
};

const DRAFTS_STORAGE_KEY = 'photer_drafts';
const MAX_DRAFTS = 10;

/**
 * Hook for managing post drafts in localStorage
 * @returns Object with draft management functions and current drafts state
 */
export function useDraftStorage() {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      // Преобразуем timestamp обратно в Date объекты
      return parsed.map(
        (draft: Omit<Draft, 'timestamp'> & { timestamp: string }) => ({
          ...draft,
          timestamp: new Date(draft.timestamp),
        })
      );
    } catch (error) {
      console.warn('Failed to load drafts from localStorage:', error);
      return [];
    }
  });

  /**
   * Save a new draft to localStorage
   * @param photos Array of photo data
   * @param description Draft description
   * @returns Draft ID
   */
  const saveDraft = useCallback((photos: PhotoData[], description: string) => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      photos,
      description,
      timestamp: new Date(),
    };

    setDrafts((prevDrafts) => {
      const updatedDrafts = [newDraft, ...prevDrafts.slice(0, MAX_DRAFTS - 1)];

      try {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
      } catch (error) {
        console.warn('Failed to save draft to localStorage:', error);
      }

      return updatedDrafts;
    });

    return newDraft.id;
  }, []);

  const loadDraft = useCallback(
    (draftId: string): Draft | null => {
      const draft = drafts.find((d) => d.id === draftId);
      return draft || null;
    },
    [drafts]
  );

  const deleteDraft = useCallback((draftId: string) => {
    setDrafts((prevDrafts) => {
      const updatedDrafts = prevDrafts.filter((d) => d.id !== draftId);

      try {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
      } catch (error) {
        console.warn('Failed to delete draft from localStorage:', error);
      }

      return updatedDrafts;
    });
  }, []);

  const clearAllDrafts = useCallback(() => {
    setDrafts([]);
    try {
      localStorage.removeItem(DRAFTS_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear drafts from localStorage:', error);
    }
  }, []);

  return {
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    clearAllDrafts,
  };
}
