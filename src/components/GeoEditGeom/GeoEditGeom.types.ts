import { Map } from 'ol';

export interface GeoEditGeomTypes {
  map: Map | undefined;
  isEditGeom?: boolean;
  setIsEditGeom?: any;
  selectedRoadId?: string | number | undefined;
  mapLayers?: any;
  setMapLayers?: any;
  routerRest?: any;
  selectedRoadPartId?: any;
}
