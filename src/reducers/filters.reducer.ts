import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedFilters: [],
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.selectedFilters = [...state.selectedFilters, action.payload];
    },
    deleteFilter: (state, action) => {
      const ab = state.selectedFilters.filter((item) => item !== action.payload);
      state.selectedFilters = ab;
    },
    resetFilter: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFilter, deleteFilter, resetFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
