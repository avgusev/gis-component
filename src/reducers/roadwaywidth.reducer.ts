import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';
import { limit, pgApiUrl, publicSchemaHeader, start } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: ['2.75', '45'] as ReadonlyArray<any>,
  selected: [undefined, undefined] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'roadway_width',
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const roadwayWidthSlice = createSlice({
  name: 'roadwaywidth',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetRoadwayWidth(state, action) {
      return action.payload;
    },
    setRoadwayWidthFilter(state, action) {
      state.filter = action.payload;
    },
    resetRoadwayWidth(state) {
      return initialState;
    },
    addOrRemoveRoadwayWidth(state, action) {
     
      const item = action.payload;
      const itemArr = item.map((it) => {
        if (it === "") return null;
        return it;
      });

      let filter = '';
      state.selected = itemArr;

      if (state.selected.length > 0 && !itemArr.includes(null)) {
        filter = state?.filterField + ` >= ${itemArr?.[0]} AND ${state?.filterField} <= ${itemArr?.[1]}`;
      } else {
        filter = '(1=1)';
      }

      console.log(`RoadwayWidth filter = ${filter}`);
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

export const { setRoadwayWidthFilter, setPresetRoadwayWidth, resetRoadwayWidth, addOrRemoveRoadwayWidth } = roadwayWidthSlice.actions;
export default roadwayWidthSlice.reducer;
