import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams, IQueryFiltersParams } from './reducer.utils';
import { limit, pgApiUrl, publicSchemaHeader, start } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'agglomeration_gid',
};

// Агломерации

export const getAgglomerations = createAsyncThunk(
  'agglomerations/fetch_agglomerations',
  async ({ search, max_level, level, selected }: IQueryFiltersParams) => {
    const url = `${pgApiUrl}/rpc/f_get_adm_division`;
    const body: any = {
      p_params: {
        FILTER: {
          MAX_LEVEL: max_level,
          TEXT_SEARCH: search,
          LEVEL: level,
        },
        LIMIT: 400,
      },
    };
    if (selected?.length > 0) {
      body.p_params.FILTER.SELECTED_IDS = selected;
    }
    // const body: any = {
    //   p_params: {
    //     FILTER: {
    //       ENTITY_CODE: 123,
    //       TEXT_SEARCH: search,
    //     },
    //     PAGING: {
    //       START_POSITION: start,
    //       LIMIT_ROWS: limit,
    //     },
    //   },
    // };
    // if (size === 0) {
    //   delete body.p_params.PAGING;
    // }
    // if (sort) {
    //   body.p_params.ORDER = {
    //     COL_NAME: 'NAME',
    //     DIRECTION: 'ASC',
    //   };
    // }
    return axios.post<any[]>(url, body, publicSchemaHeader);
  }
);

export type AgglomerationState = Readonly<typeof initialState>;

export const agglomerationsSlice = createSlice({
  name: 'agglomerations',
  initialState: initialState as AgglomerationState,
  reducers: {
    setPresetAgglomerations(state, action) {
      return action.payload;
    },
    setAgglomerationFilter(state, action) {
      state.filter = action.payload;
    },
    resetAgglomerations() {
      return initialState;
    },
    addOrRemoveAgglomeration(state, action) {
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

      console.log(`Agglomerations filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getAgglomerations), (state, action) => {
        state.loading = false;
        state.data = action.payload.data[2].map((item) => {
          return { id: item.id, name: item.name };
        });
      })
      .addMatcher(isPending(getAgglomerations), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getAgglomerations), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setAgglomerationFilter, setPresetAgglomerations, resetAgglomerations, addOrRemoveAgglomeration } =
  agglomerationsSlice.actions;
export default agglomerationsSlice.reducer;
