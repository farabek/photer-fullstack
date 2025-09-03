import { createSlice } from '@reduxjs/toolkit';

const genInfoSlice = createSlice({
  name: 'genInfo',
  initialState: {
    data: {
      username: '',
      firstName: '',
      lastName: '',
    },
  },
  reducers: {
    setGenInfoData: (state, action) => {
      state.data = action.payload;
    },
  },
});
export const { setGenInfoData } = genInfoSlice.actions;
export const genInfoReducer = genInfoSlice.reducer;
