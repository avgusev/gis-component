import { Pair } from './../components/GeoInputRange/GeoInputRange.types';
// export type Pair = [number | undefined, number | undefined];

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  picket: [],
  isOpen: false,
  loading: false,
  error: '',
};

export type PicketState = Readonly<typeof initialState>;

export const picketSlice = createSlice({
  name: 'picket',
  initialState: initialState as PicketState,
  reducers: {
    openPicket(state, action) {
      state.isOpen = action.payload;
    },
    setPicket(state, action) {
      state.picket = action.payload;
    },
  },
});

export const { openPicket, setPicket } = picketSlice.actions;
export default picketSlice.reducer;
