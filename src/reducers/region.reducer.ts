import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryFiltersParams } from './reducer.utils';
import { limit, pgApiUrl, publicSchemaHeader, start } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'region_gid',
};

// Регионы

export const getRegions = createAsyncThunk('regions/fetch_regions', async ({ search, selected, max_level, level }: IQueryFiltersParams) => {
  //const url = `${pgApiUrl}/rpc/get_entity_list`;
  const url = `${pgApiUrl}/rpc/f_get_adm_division`;
  const body: any = {
    p_params: {
      FILTER: {
        MAX_LEVEL: max_level,
        TEXT_SEARCH: search,
        LEVEL: level,
      },
    },
    LIMIT: 400,
  };
  if (selected?.length > 0) {
    body.p_params.FILTER.SELECTED_IDS = selected;
  }

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
});

// export const getRegions = createAsyncThunk('regions/fetch_regions', async ({ search, size, sort }: IQueryParams) => {
//   //const url = `${pgApiUrl}/rpc/get_entity_list`;
//   const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
//   const body: any = {
//     p_params: {
//       FILTER: {
//         DIMENSION_ID: 22,
//         TEXT_SEARCH: search,
//       },
//       PAGING: {
//         START_POSITION: start,
//         LIMIT_ROWS: limit,
//       },
//     },
//   };
//   if (size === 0) {
//     delete body.p_params.PAGING;
//   }
//   if (sort) {
//     body.p_params.ORDER = {
//       COL_NAME: 'NAME',
//       DIRECTION: 'ASC',
//     };
//   }

//   return axios.post<any[]>(url, body, publicSchemaHeader);
// });

export type AuthoritiesState = Readonly<typeof initialState>;

export const regionsSlice = createSlice({
  name: 'regions',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetRegion(state, action) {
      return action.payload;
    },
    setRegionFilter(state, action) {
      state.filter = action.payload;
    },
    resetRegions() {
      return initialState;
    },
    addOrRemoveRegion(state, action) {
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

      console.log(`Regions filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRegions), (state, action) => {
        state.loading = false;
        state.data = action.payload.data?.[1].map((item) => {
          return { id: item.id, name: item.name };
        });
      })
      .addMatcher(isPending(getRegions), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getRegions), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setRegionFilter, setPresetRegion, resetRegions, addOrRemoveRegion } = regionsSlice.actions;
export default regionsSlice.reducer;
