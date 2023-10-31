import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { pgApiUrl, publicSchemaHeader } from '../config/constants';
import { IQueryParams } from './reducer.utils';

const initialState = {
  filter: '',
  loading: false,
  data: [] as ReadonlyArray<any>,
  selected: [] as ReadonlyArray<any>,
  cql: '(1=1)',
  filterField: 'category_gid',
};

// Регионы

export const getCategories = createAsyncThunk('categories/fetch_categories', async ({ search, size, sort }: IQueryParams) => {
  const url = `${pgApiUrl}/rpc/get_dimension_value_list_v2`;
  const body: any = {
    p_params: {
      FILTER: {
        DIMENSION_ID: 678,
        NAME_FIELD: 'category_road',
        TEXT_SEARCH: search,
      },
      PAGING: {
        START_POSITION: 0,
        LIMIT_ROWS: 100,
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

export type CategoriesState = Readonly<typeof initialState>;

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState as CategoriesState,
  reducers: {
    setPresetCategories(state, action) {
      return action.payload;
    },
    setCategoryFilter(state, action) {
      state.filter = action.payload;
    },
    resetCategories() {
      return initialState;
    },
    addOrRemoveCategory(state, action) {
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

      console.log(`Categories filter = ${filter}`);
      state.cql = filter;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getCategories), (state, action) => {
        state.loading = false;
        state.data = action.payload.data.map((item) => {
          return { id: item.dimmember_gid, name: item.name };
        });
      })
      .addMatcher(isPending(getCategories), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getCategories), (state, action) => {
        state.loading = false;
      });
  },
});

export const { setCategoryFilter, setPresetCategories, resetCategories, addOrRemoveCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
