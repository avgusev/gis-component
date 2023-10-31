import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { pgApiUrl, publicSchemaHeader } from '../config/constants';

const initialState = {
  loading: false,
  coordinates: {
    lat: 0.0,
    lon: 0.0,
    zoom: 9
  },
};

type Coordinates = {
  lat: number;
  lon: number;
};

// Координаты

export const getCoordinates = createAsyncThunk('coordinates/fetch_coordinates', async (id: bigint) => {
  const url = `${pgApiUrl}/rpc/f_get_adm_centroid`;
  const body = {
    dimmember_gid: id,
  };
  //Частный временный случай для центра bbox пятилеток
  if (id === null) {
    return {
      data: {
        lat: 6740443.307084209,
        lon: 4060328.1086323294,
        zoom: 9
      },
    };
  }
  // ['4060328.1086323294', '6740443.307084209']
  return axios.post<Coordinates>(url, body, publicSchemaHeader);
});

export type CoordinatesState = Readonly<typeof initialState>;

export const coordinatesSlice = createSlice({
  name: 'coordinates',
  initialState: initialState as CoordinatesState,
  reducers: {
    resetCoordinates() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getCoordinates), (state, action: any) => {
        state.loading = false;
        console.log(action.payload.data);
        state.coordinates = action.payload.data;
      })
      .addMatcher(isPending(getCoordinates), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(getCoordinates), (state, action) => {
        state.loading = false;
      });
  },
});

export const { resetCoordinates } = coordinatesSlice.actions;
export default coordinatesSlice.reducer;
