import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'post-create' | 'auth' | null;

type ModalState = {
  isOpen: boolean;
  type: ModalType;
  props: Record<string, unknown>;
};

const initialState: ModalState = {
  isOpen: false,
  type: null,
  props: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        type: ModalType;
        props?: Record<string, unknown>;
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.props = action.payload.props || {};
    },
    closeModal: () => initialState,
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
