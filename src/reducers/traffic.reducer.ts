import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: '',
  loading: false,
  data: ['0', '100000'] as ReadonlyArray<any>,
  selected: [undefined, undefined] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'traffic',
};

export type AuthoritiesState = Readonly<typeof initialState>;

export const trafficSlice = createSlice({
  name: 'traffic',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetTraffic(state, action) {
      return action.payload;
    },
    setTrafficFilter(state, action) {
      state.filter = action.payload;
    },
    resetTraffic() {
      return initialState;
    },
    addOrRemoveTraffic(state, action) {
      const item = action.payload;
      const itemArr = item.map((it) => {
        if (it === '') return null;
        return it;
      });

      let filter = '';
      state.selected = itemArr;
      if (state.selected.length > 0 && !itemArr.includes(null)) {
        filter = state?.filterField + ` >= ${itemArr?.[0]} AND ${state?.filterField} <= ${itemArr?.[1]}`;
      } else {
        filter = '(1=1)';
      }

      console.log(`Traffic filter = ${filter}`);
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

export const { setTrafficFilter, setPresetTraffic, resetTraffic, addOrRemoveTraffic } = trafficSlice.actions;
export default trafficSlice.reducer;
