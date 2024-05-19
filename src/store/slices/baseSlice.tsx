import { createSlice } from '@reduxjs/toolkit';
import { Auth } from '../../interfaces/models/auth';
import { baseData, modalState } from '../../interfaces/models/data';

export type BaseState = baseData | null;

const initialState: BaseState = null;

export const baseSlice = createSlice({
  name: 'base',
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state = action.payload;
      return state;
    }
  },
});

export const { loading } = baseSlice.actions;

export default baseSlice.reducer;
