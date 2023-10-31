import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';
import { limit, pgApiUrl, publicSchemaHeader, start } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'value_of_the_road_gid',
};

// Значение дороги

export const getRoadValues = createAsyncThunk('roadvalues/fetch_roadvalues', async ({ search, size, sort }: IQueryParams) => {
  const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  const body: any = {
    p_params: {
      FILTER: {
        DIMENSION_ID: 1755,
        TEXT_SEARCH: search,
        NAME_FIELD: "name",
      },
      PAGING: {
        START_POSITION: start,
        LIMIT_ROWS: limit,
      },
    },
  };
//   if (size === 0) {
//     delete body.p_params.PAGING;
//   }
//   if (sort) {
//     body.p_params.ORDER = {
//       COL_NAME: 'ROAD_VALUES',
//       DIRECTION: 'ASC',
//     };
//   }
  return axios.post<any[]>(url, body, publicSchemaHeader);
});

export type AuthoritiesState = Readonly<typeof initialState>;

export const roadValuesSlice = createSlice({
  name: 'roadvalues',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetRoadValues(state, action) {
      return action.payload;
    },
    setRoadValuesFilter(state, action) {
      state.filter = action.payload;
    },
    resetRoadValues() {
      return initialState;
    },
    addOrRemoveRoadValues(state, action) {
      const item = action.payload;

      const index = state.selected.findIndex((element) => {
        return element.id === item.id;
      });

      if (index === -1) {
        state.selected.push(item);
      } else {
        state.selected.splice(index, 1);
      }

      let filter = '';

      if (state.selected.length > 0) {
        filter += `(${state.filterField} IN (`;
        state.selected.map((el) => {
          filter += el.id;
          filter += ',';
        });
        filter = filter.slice(0, -1);
        filter += '))';
      } else {
        filter = '(1=1)';
      }

      console.log(`RoadValues filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRoadValues), (state, action) => {
        state.loading = false;
        state.data = action.payload.data.map((item) => {
          return { id: item.dimmember_gid, name: item.name };
        });
      })
      .addMatcher(isPending(getRoadValues), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getRoadValues), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setRoadValuesFilter, setPresetRoadValues, resetRoadValues, addOrRemoveRoadValues } = roadValuesSlice.actions;
export default roadValuesSlice.reducer;