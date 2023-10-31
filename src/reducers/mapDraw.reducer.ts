import { createSlice } from '@reduxjs/toolkit';

type mapModeType = 'navigation' | 'sendmessage' | 'editgeom' | 'lidar' | 'panorama';

const initialState = {
  selectedRoad: null,
  selectedBridge: null,
  roadParts: <any>[],
  selectedRoadPart: <any>{},
  roadPartGeom: <any>{},
  bridgeGeom: <any>{},
  drawMode: '',
  geomLength: 0,
  lastFeatureId: null,
};

// Map Draw State

export type AuthoritiesState = Readonly<typeof initialState>;

export const mapDrawSlice = createSlice({
  name: 'mapDraw',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setSelectedRoad(state, action) {
      state.selectedRoad = action.payload;
    },
    setSelectedBridge(state, action) {
      state.selectedBridge = action.payload;
    },
    setRoadParts(state, action) {
      state.roadParts = action.payload;
    },
    setSelectedRoadPart(state, action) {
      state.selectedRoadPart = action.payload;
    },
    setRoadPartGeom(state, action) {
      state.roadPartGeom = action.payload;
    },
    setBridgeGeom(state, action) {
      state.bridgeGeom = action.payload;
    },
    setDrawMode(state, action) {
      state.drawMode = action.payload;
    },
    setGeomLength(state, action) {
      state.geomLength = action.payload;
    },
    setLastFeatureId(state, action) {
      state.lastFeatureId = action.payload;
    },
    resetDrawState(state) {
      return initialState;
    },
  },
});

export const {
  setSelectedRoad,
  setSelectedBridge,
  setRoadParts,
  setSelectedRoadPart,
  setRoadPartGeom,
  setBridgeGeom,
  setDrawMode,
  setGeomLength,
  setLastFeatureId,
  resetDrawState,
} = mapDrawSlice.actions;
export default mapDrawSlice.reducer;
