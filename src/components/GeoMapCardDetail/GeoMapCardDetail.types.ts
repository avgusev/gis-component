import { Map } from 'ol';
import { ColInfo } from 'xlsx';

export interface GeoMapCardDetailTypes {
  isOpenCardDetail?: boolean;
  setIsOpenCardDetail?: any;
  routerRest?: any;
  data?: any;
  id_road?: number;
  selectedRoadPartId?: any;
  selectedFeature?: any;
  getGeoJson?: () => Promise<boolean | any>;
  isFlatnessLayerOn?: boolean;
  getFlatnessFile?: () => Promise<boolean | any>;
  map: Map | undefined;
  isDiagnosticsModal: boolean;
  setIsDiagnosticsModal: any;
  mapLayers: any;
  backBoneId?: number;
  selectedEdgeId?: any;
  selectedBridgeId?: any;
  updateMapSize?: any;
  removePicketFeature?: () => void;
  searchAndAddPicketFeature?: () => void;
  roadworks5y?: any;
  removeRoadworks5yFeature?: () => void;
  getRoadName?: (any) => void;
  setIsEditGeom?: any;
  setSelectedBridgeId?: any;
  selectedBridgeIdRef?: any;
}
