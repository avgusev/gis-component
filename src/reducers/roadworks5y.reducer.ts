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
  filterField: 'deadline_year',
};

// Регионы

export const getRoadworks5yYears = createAsyncThunk('roadworks5y/fetch_roadworks5y', async ({ search }: IQueryParams) => {
  // const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  // const body: any = {
  //   p_params: {
  //     FILTER: {
  //       DIMENSION_ID: 22,
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

  let year = 2021;
  const yearsArr: any = [];
  while (year <= 2025) {
    yearsArr.push({ id: year, name: year });
    /* eslint-disable no-plusplus */
    year++;
  }
  if (search && search !== '') {
    const yerFilter = yearsArr.filter((item) => {
      if (item.name.includes(search)) {
        return true;
      }
      return;
    });
  }

  //return axios.post<any[]>(url, body, publicSchemaHeader);
  return search && search !== '' ? yearsArr.filter((item) => item.name.includes(search)) : yearsArr;
});

export type AuthoritiesState = Readonly<typeof initialState>;

export const roadworks5ySlice = createSlice({
  name: 'roadworks5y',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setPresetRoadworks5y(state, action) {
      return action.payload;
    },
    setRoadworks5yFilter(state, action) {
      state.filter = action.payload;
    },
    resetRoadworks5y() {
      return initialState;
    },
    addOrRemoveRoadworks5y(state, action) {
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

      console.log(`Roadworks5y filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRoadworks5yYears), (state, action) => {
        state.loading = false;
        state.data = action.payload.map((item) => {
          return { id: item.id, name: item.name };
        });
      })
      .addMatcher(isPending(getRoadworks5yYears), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getRoadworks5yYears), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setRoadworks5yFilter, setPresetRoadworks5y, resetRoadworks5y, addOrRemoveRoadworks5y } = roadworks5ySlice.actions;
export default roadworks5ySlice.reducer;
