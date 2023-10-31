import { Pair } from '../GeoInputRange/GeoInputRange.types';
export interface GeoPicketRoadSearch {
  valueRange: Pair;
  setValueRange: (valueRange: Pair) => void;
  onShowPicket: () => void;
  onRemovePicket: () => void;
}
