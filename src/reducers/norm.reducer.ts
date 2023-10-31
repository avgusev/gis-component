import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';

const initialState = {
  filter: '',
  loading: false,
  data: false as boolean,
  selected: undefined as boolean,
  cql: '(1=1)',
  filterField: 'norm_percentage',
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const normSlice = createSlice({
  name: 'norm',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetNorm(state, action) {
      return action.payload;
    },
    setNormFilter(state, action) {
      state.filter = action.payload;
    },
    resetNorm() {
      return initialState;
    },
    addOrRemoveNorm(state, action) {
      const item = action.payload;

      let filter = '';
      state.selected = item;
      if (state.selected) {
        filter = state?.filterField + ` > 0.95`;
      } else {
        filter = '(1=1)';
      }

      console.log(`Norm filter = ${filter}`);
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

export const { setNormFilter, setPresetNorm, resetNorm, addOrRemoveNorm } = normSlice.actions;
export default normSlice.reducer;
