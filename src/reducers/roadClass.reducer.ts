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
  filterField: 'class_of_road_gid',
};

// Класс дороги

export const getRoadClasses = createAsyncThunk('roadclasses/fetch_roadclasses', async ({ search, size, sort }: IQueryParams) => {
  const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  const body: any = {
    p_params: {
      FILTER: {
        DIMENSION_ID: 1894,
        TEXT_SEARCH: search,
        NAME_FIELD: 'CLASS',
      },
      PAGING: {
        START_POSITION: start,
        LIMIT_ROWS: limit,
      },
    },
  };
  if (size === 0) {
    delete body.p_params.PAGING;
  }
  if (sort) {
    body.p_params.ORDER = {
      COL_NAME: 'CLASS',
      DIRECTION: 'ASC',
    };
  }
  return axios.post<any[]>(url, body, publicSchemaHeader);
});

export type AuthoritiesState = Readonly<typeof initialState>;

export const roadClassesSlice = createSlice({
  name: 'roadClasses',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetRoadClasses(state, action) {
      return action.payload;
    },
    setRoadClassesFilter(state, action) {
      state.filter = action.payload;
    },
    resetRoadClasses() {
      return initialState;
    },
    addOrRemoveRoadClasses(state, action) {
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

      console.log(`RoadClasses filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRoadClasses), (state, action) => {
        state.loading = false;
        state.data = action.payload.data.map((item) => {
          return { id: item.dimmember_gid, name: item.name };
        });
      })
      .addMatcher(isPending(getRoadClasses), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getRoadClasses), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setRoadClassesFilter, setPresetRoadClasses, resetRoadClasses, addOrRemoveRoadClasses } = roadClassesSlice.actions;
export default roadClassesSlice.reducer;
