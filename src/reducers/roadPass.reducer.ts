import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { commandSchemaHeader, pgApiUrl } from '../config/constants';

const initialState = {
  options: [] as ReadonlyArray<any>,
  selected: null,
  loading: false,
  defaultTableRows: 10,
};

export const getPassOptions = createAsyncThunk('roadPass/fetch_passOptions', async ({ road_id }: { road_id: number }) => {
  const url = `${pgApiUrl}/rpc/get_diag_passport`;

  return axios.post<any[]>(url, { data: { road_id: road_id } }, commandSchemaHeader);
});

export const getPass = createAsyncThunk('roadPass/fetch_pass', async ({ road_id, pass_id }: { road_id: number; pass_id: number }) => {
  const url = `${pgApiUrl}/rpc/get_diag_passport`;

  return axios.post<any[]>(url, { data: { road_id: road_id, passport_id: pass_id } }, commandSchemaHeader);
});

export type RoadPassState = Readonly<typeof initialState>;

export const roadPassSlice = createSlice({
  name: 'roadPass',
  initialState: initialState as RoadPassState,
  reducers: {
    resetRoadPass() {
      return initialState;
    },
    selectPass(state, action) {
      state.selected = action.payload;
    },
    setTableRowsPass(state, action) {
      state.defaultTableRows = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getPassOptions), (state, action) => {
        state.loading = false;
        state.options = action.payload.data;
        let defaultEl = null;
        if (action.payload.data?.length > 0) {
          action.payload.data.forEach((item, index) => {
            if (index === 0) {
              defaultEl = item;
            }
            if (+defaultEl.id < +item.id) {
              defaultEl = item;
            }
          });
          state.selected = defaultEl;
        }
      })
      .addMatcher(isPending(getPassOptions), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getPassOptions), (state, action) => {
        state.loading = false;
      });
    builder.addMatcher(isFulfilled(getPass), (state, action) => {
      state.selected = action.payload.data[0];
    });
  },
});

export const { resetRoadPass, selectPass, setTableRowsPass } = roadPassSlice.actions;
export default roadPassSlice.reducer;
