import { Map } from 'ol';

export interface GeoMapCardDetailNetworkTypes {
  open: (value: React.SetStateAction<boolean>) => void;
  setEditingType: (value: React.SetStateAction<string>) => void;
  map: Map | undefined;
  idRoad: number;
  idPart: number;
}
