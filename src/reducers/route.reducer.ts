import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';
import { pgApiUrl, publicSchemaHeader } from '../config/constants';
import { start, limit } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'international_gid',
};

// Маршруты

export const getRoutes = createAsyncThunk('routes/fetch_routes', async ({ search, size, sort }: IQueryParams) => {
  const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  const body: any = {
    p_params: {
      FILTER: {
        DIMENSION_ID: 1802,
        NAME_FIELD: 'CODE',
        TEXT_SEARCH: search,
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
      COL_NAME: 'NAME',
      DIRECTION: 'ASC',
    };
  }

  return axios.post<any[]>(url, body, publicSchemaHeader);
});

export type RoutesState = Readonly<typeof initialState>;

export const routesSlice = createSlice({
  name: 'routes',
  initialState: initialState as RoutesState,
  reducers: {
    setPresetRoutes(state, action) {
      return action.payload;
    },
    setRouteFilter(state, action) {
      state.filter = action.payload;
    },
    resetRoutes() {
      return initialState;
    },
    addOrRemoveRoute(state, action) {
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
        state.selected.map((el) => {
          filter += `(${state.filterField} LIKE '%`;
          filter += el.id;
          filter += "%') OR ";
        });

        filter = filter.slice(0, -1);
        filter = filter.slice(0, -1);
        filter = filter.slice(0, -1);
      } else {
        filter = '(1=1)';
      }

      console.log(`Routes filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRoutes), (state, action) => {
        state.loading = false;
        state.data = action.payload.data.map((item) => {
          return { id: item.dimmember_gid, name: item.name };
        });
      })
      .addMatcher(isPending(getRoutes), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getRoutes), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setRouteFilter, setPresetRoutes, resetRoutes, addOrRemoveRoute } = routesSlice.actions;
export default routesSlice.reducer;
