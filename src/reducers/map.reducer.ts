import { createSlice } from '@reduxjs/toolkit';

type mapModeType = 'navigation' | 'sendmessage' | 'editgeom' | 'lidar' | 'panorama';

const initialState = {
  //mapstate: {} as ReadonlySet<any> | null,
  mapMode: 'navigation',
  editObjectMode: '',
  bridgeGeomType: 'Point',
  locationDescription: '',
  locationCoord: [],
};

// Map State

export type AuthoritiesState = Readonly<typeof initialState>;

export const mapSlice = createSlice({
  name: 'mapstate',
  initialState: initialState as AuthoritiesState,
  reducers: {
    // setMapState(state, action) {
    //   debugger;
    //   state.mapstate = action.payload;
    // },
    setMapMode(state, action) {
      state.mapMode = action.payload;
    },
    setEditObjectMode(state, action) {
      state.editObjectMode = action.payload;
    },
    setBridgeGeomType(state, action) {
      state.bridgeGeomType = action.payload;
    },
    setLocationDescription(state, action) {
      state.locationDescription = action.payload;
    },
    setLocationCoord(state, action) {
      state.locationCoord = action.payload;
    },
  },
});

export const {
  //setMapState,
  setMapMode,
  setEditObjectMode,
  setBridgeGeomType,
  setLocationDescription,
  setLocationCoord,
} = mapSlice.actions;
export default mapSlice.reducer;
