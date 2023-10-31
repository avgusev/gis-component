import { Map } from 'ol';

export interface GeoEditGeomBridgeTypes {
  map: Map | undefined;
  isEditGeom?: boolean;
  setIsEditGeom?: any;
  selectedBridgeId?: string | number | undefined;
  mapLayers?: any;
  setMapLayers?: any;
  routerRest?: any;
}
