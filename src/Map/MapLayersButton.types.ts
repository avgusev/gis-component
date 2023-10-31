import { ISelectType } from './../global.types';
export interface MapLayersButtonTypes {
  features?: any;
  map: any;
  currentBaseMap: any;
  setCurrentBaseMap: any;
  mapLayers: any;
  setMapLayers: any;
  collapseLayersControl: boolean;
  setCollapseLayerControl: any;
  isCreateMessage: boolean;
  setIsCreateMessage: (isCreateMessage: boolean) => void;
  isEditGeom: boolean;
  setIsEditGeom: (isEditGeom: boolean) => void;
  // funcTest: () => void;
  // messageGeolocation: string[];
  // showMessageOnMap: (coordinates: string[]) => void;
  // removeFeatures: () => void;
  // closestPoint: (coordinates: string[]) => ISelectType[];
}
