import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryFiltersParams } from './reducer.utils';
import { pgApiUrl, publicSchemaHeader } from '../config/constants';

const initialState = {
  selectedFormCode: null,
  selectedReportCode: null,
  selecetedReportChapter: null,

  filterRegionOptions: [] as ReadonlyArray<any>,
  filterRegion: '',
  selectedFilterRegion: [] as ReadonlyArray<any>,

  filterFKUOptions: [] as ReadonlyArray<any>,
  filterFKU: '',
  selectedFilterFKUOptions: [] as ReadonlyArray<any>,

  selectedFilterYear: '2023',

  loading: false,
};

export const getRegions = createAsyncThunk(
  'regions/fetch_statForm_regions',
  async ({ search, selected, max_level, level }: IQueryFiltersParams) => {
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

    return axios.post<any[]>(url, body, publicSchemaHeader);
  }
);

export type AuthoritiesState = Readonly<typeof initialState>;

export const statFormSlice = createSlice({
  name: 'statForm',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setRegionFilter(state, action) {
      state.filterRegion = action.payload;
    },

    setReportChapter(state, action) {
      state.selecetedReportChapter = action.payload;
    },

    setSelectedFilterYear(state, action) {
      state.selectedFilterYear = action.payload;
    },

    setReportCode(state, action) {
      state.selectedReportCode = action.payload;
    },

    setFormCode(state, action) {
      state.selectedFormCode = action.payload;
    },

    resetRegions() {
      return initialState;
    },

    addOrRemoveRegion(state, action) {
      const item = action.payload;

      const index = state.selectedFilterRegion.findIndex((element) => {
        return element.id === item.id;
      });

      if (index === -1) {
        state.selectedFilterRegion.push(item);
      } else {
        state.selectedFilterRegion.splice(index, 1);
      }
    },
  },

  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRegions), (state, action) => {
        state.loading = false;
        state.filterRegionOptions = action.payload.data?.[1].map((item) => {
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

export const { setRegionFilter, resetRegions, setReportCode, addOrRemoveRegion, setSelectedFilterYear, setReportChapter, setFormCode } =
  statFormSlice.actions;
export default statFormSlice.reducer;
