import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams, IQueryFiltersParams } from './reducer.utils';
import { citiesDicFilterCode, pgApiUrl, publicSchemaHeader } from '../config/constants';
import { start, limit } from '../config/constants';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'parent_level_4_gid',
};

// Города

export const getCities = createAsyncThunk('cities/fetch_cities', async ({ search, max_level, level, selected }: IQueryFiltersParams) => {
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
  //       DIMENSION_ID: 1766,
  //       TEXT_SEARCH: search,
  //     },
  //     FILTER_1: {
  //       FIELD_ID: 2807,
  //       FILTER_TEXT: citiesDicFilterCode,
  //     },
  //     PAGING: {
  //       START_POSITION: start,
  //       LIMIT_ROWS: limit,
  //     },
  //   },
  // };
  // if (sort) {
  //   body.p_params.ORDER = {
  //     COL_NAME: 'NAME',
  //     DIRECTION: 'ASC',
  //   };
  // }
  return axios.post<any[]>(url, body, publicSchemaHeader);
});

export type CitiesState = Readonly<typeof initialState>;

export const citiesSlice = createSlice({
  name: 'cities',
  initialState: initialState as CitiesState,
  reducers: {
    setPresetCities(state, action) {
      return action.payload;
    },
    setCityFilter(state, action) {
      state.filter = action.payload;
    },
    resetCities() {
      return initialState;
    },
    addOrRemoveCity(state, action) {
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

      console.log(`Cities filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getCities), (state, action) => {
        state.loading = false;
        state.data = action.payload.data[4].map((item) => {
          return { id: item.id, name: item.name };
        });
      })
      .addMatcher(isPending(getCities), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getCities), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setCityFilter, setPresetCities, resetCities, addOrRemoveCity } = citiesSlice.actions;
export default citiesSlice.reducer;
