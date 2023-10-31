import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';

const initialState = {
  filter: '',
  loading: false,
  data: false as boolean,
  selected: undefined as boolean,
  cql: '(1=1)',
  filterField: 'loading',
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetLoading(state, action) {
      return action.payload;
    },
    setLoadingFilter(state, action) {
      state.filter = action.payload;
    },
    resetLoading() {
      return initialState;
    },
    addOrRemoveLoading(state, action) {
      const item = action.payload;

      let filter = '';
      state.selected = item;
      if (state.selected) {
        filter = state?.filterField + ` > 0.7`;
      } else {
        filter = '(1=1)';
      }

      console.log(`Loading filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    // builder
    //   .addMatcher(isFulfilled(getRegions), (state, action) => {
    //     state.loading = false;
    //     state.data = action.payload.data.map((item) => {
    //       return { id: item.dimmember_gid, name: item.name };
    //     });
    //   })
    //   .addMatcher(isPending(getRegions), (state) => {
    //     state.loading = true;
    //   })
    //   .addMatcher(isRejected(getRegions), (state, action) => {
    //     state.loading = false;
    //   });
  },
});

export const { setLoadingFilter, setPresetLoading, resetLoading, addOrRemoveLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
