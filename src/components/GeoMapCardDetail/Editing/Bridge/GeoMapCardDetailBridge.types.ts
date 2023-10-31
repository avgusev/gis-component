import { Map } from 'ol';

export interface GeoMapCardDetailBridgeTypes {
  objectType?: 'linear' | 'point';
  open: (value: React.SetStateAction<boolean>) => void;
  setEditingType: (value: React.SetStateAction<string>) => void;
  map: Map | undefined;
  idRoad: number;
  idPart: number;
}
