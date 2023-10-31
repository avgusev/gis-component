import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRegion: null,
  isRoadShaded: true,
  isEnabled: false,
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const mapRegionalSkeletonSlice = createSlice({
  name: 'mapregskeleton',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setSelectedRegion(state, action) {
      state.selectedRegion = action.payload;
    },
    setIsRoadShaded(state, action) {
      state.isRoadShaded = action.payload;
    },
    setEnabled(state, action) {
      state.isEnabled = action.payload;
    },
  },
});

export const { setSelectedRegion, setIsRoadShaded, setEnabled } = mapRegionalSkeletonSlice.actions;
export default mapRegionalSkeletonSlice.reducer;
