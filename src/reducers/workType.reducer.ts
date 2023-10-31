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
  filterField: 'type_of_works_gid',
};

// Тип работ

export const getWorkTypes = createAsyncThunk('worktypes/fetch_worktypes', async ({ search, size, sort }: IQueryParams) => {
  const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  const body: any = {
    p_params: {
      FILTER: {
        DIMENSION_ID: 1737,
        TEXT_SEARCH: search,
        NAME_FIELD: 'type_name',
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
      COL_NAME: 'type_name',
      DIRECTION: 'ASC',
    };
  }

  return axios.post<any[]>(url, body, publicSchemaHeader);
});

export type AuthoritiesState = Readonly<typeof initialState>;

export const workTypesSlice = createSlice({
  name: 'workTypes',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetWorkTypes(state, action) {
      return action.payload;
    },
    setWorkTypesFilter(state, action) {
      state.filter = action.payload;
    },
    resetWorkTypes() {
      return initialState;
    },
    addOrRemoveWorkTypes(state, action) {
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

      console.log(`WorkTypes filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getWorkTypes), (state, action) => {
        state.loading = false;
        state.data = action.payload.data.map((item) => {
          return { id: item.dimmember_gid, name: item.name };
        });
      })
      .addMatcher(isPending(getWorkTypes), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getWorkTypes), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setWorkTypesFilter, setPresetWorkTypes, resetWorkTypes, addOrRemoveWorkTypes } = workTypesSlice.actions;
export default workTypesSlice.reducer;
