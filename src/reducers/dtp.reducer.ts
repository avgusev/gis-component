import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';

const initialState = {
  filter: '',
  loading: false,
  data: false as boolean,
  selected: undefined as boolean,
  cql: '(1=1)',
  filterField: 'dtp_gid',
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const dtpSlice = createSlice({
  name: 'dtp',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetDtp(state, action) {
      return action.payload;
    },
    setDtpFilter(state, action) {
      state.filter = action.payload;
    },
    resetDtp() {
      return initialState;
    },
    addOrRemoveDtp(state, action) {
      const item = action.payload;

      let filter = '';
      state.selected = item;
      if (state.selected) {
        filter = state?.filterField + ` IS NOT NULL`;
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

export const { setDtpFilter, setPresetDtp, resetDtp, addOrRemoveDtp } = dtpSlice.actions;
export default dtpSlice.reducer;
