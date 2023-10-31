import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IQueryParams } from './reducer.utils';
import { pgApiUrl, privateSchemaHeader } from '../config/constants';
//import getStore, { useAppDispatch } from '../config/store';

type initialStateType = {
  presetFilters: any[];
  selectedPreset: any;
  loading: boolean;
};

const initialState: initialStateType = {
  loading: false,
  presetFilters: [],
  selectedPreset: {
    // value: null,
    // label: '',
  },
};

export const getPresets = createAsyncThunk('presets/fetch_presets', async (arg, { getState }) => {
  const url = `${pgApiUrl}/rpc/get_filter_set`;
  //const store = getStore();

  //const state: any = store.getState(); //?.user?.userAuthData?.profile?.userId;
  const state: any = getState();
  const user_id = state?.user?.userAuthData?.profile?.userId;
  console.log(user_id);
  const body: any = {
    p_user_id: user_id,
  };
  return axios.post<any[]>(url, body, privateSchemaHeader);
});

export const setPresets = createAsyncThunk('presets/set_presets', async (presets: any, { getState, dispatch }) => {
  const url = `${pgApiUrl}/rpc/set_filter_set`;
  //const store = getStore();
  const state: any = getState();
  const newPreset = presets;
  const index = state?.preset?.presetFilters.findIndex((item) => {
    return item.name === newPreset.name;
  });
  if (index === -1) {
    state?.preset?.presetFilters.push(newPreset);
  } else {
    state?.preset?.presetFilters.splice(index, 1);
    state?.presetFilters.push(newPreset);
  }

  //const state: any = store.getState(); //?.user?.userAuthData?.profile?.userId;
  const user_id = state?.user?.userAuthData?.profile?.userId;
  console.log(user_id);
  const body: any = {
    p_user_id: user_id,
    p_json: presets,
  };
  return axios.post<any[]>(url, body, privateSchemaHeader);
});

export type AuthoritiesState = Readonly<typeof initialState>;

export const presetSlice = createSlice({
  name: 'preset',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setSelectedPreset(state, action) {
      const item = action.payload;
      state.selectedPreset.value = item?.value;
      state.selectedPreset.label = item?.label;
    },
    setPresetFilters(state, action) {
      const newPreset = action.payload;
      const index = state.presetFilters.findIndex((item) => {
        return item.name === newPreset.name;
      });
      if (index === -1) {
        state.presetFilters.push(newPreset);
      } else {
        state.presetFilters.splice(index, 1);
        state.presetFilters.push(newPreset);
      }
      //dispatch(setPresets(state.presetFilters));
      //state.presetFilters.filter((pr) => pr?.name === newPreset?.name);
      //state.presetFilters.push(newPreset);
    },
    resetSelectedPreset(state) {
      state.selectedPreset = initialState.selectedPreset;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getPresets), (state, action: any) => {
        state.loading = false;
        console.log(action, state);
        if (action?.payload?.data?.RESULT !== -1) {
          console.log(action, state);
          state.presetFilters = [];
          const arr = Array.from(action?.payload?.data);
          state.presetFilters = arr;
          //state.presetFilters.push(action?.payload?.data);
        } else {
          state.presetFilters = [];
        }
        //state.presetFilters.push(action.payload?.data);
        //state.presetFilters = action.payload;
        // state.loading = false;
        // state.data = action.payload.data.map((item) => {
        //   return { id: item.dimmember_gid, name: item.name };
        //});
      })
      .addMatcher(isPending(getPresets), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getPresets), (state, action) => {
        state.loading = false;
      })

      .addMatcher(isFulfilled(setPresets), (state, action) => {
        setPresetFilters(action?.meta?.arg);
        // const newPreset = action?.meta?.arg;
        // const index = state.presetFilters.findIndex((item) => {
        //   return item.name === newPreset.name;
        // });
        // debugger;
        // if (index === -1) {
        //   debugger;
        //   state.presetFilters.push(newPreset);
        // } else {
        //   debugger;
        //   state.presetFilters.splice(index, 1);
        //   debugger;
        //   state.presetFilters.push(newPreset);
        // }

        // state.loading = false;
        // state.data = action.payload.data.map((item) => {
        //   return { id: item.dimmember_gid, name: item.name };
        //});
      })
      .addMatcher(isPending(setPresets), (state) => {
        // state.loading = true;
      })
      .addMatcher(isRejected(setPresets), (state, action) => {
        // state.loading = false;
      });
  },
});

export const { setSelectedPreset, setPresetFilters, resetSelectedPreset } = presetSlice.actions;
export default presetSlice.reducer;
