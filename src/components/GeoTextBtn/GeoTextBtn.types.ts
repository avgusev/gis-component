import { IconType } from './../../global.types';

export interface GeoTextBtnProps {
  handlerClick?: (boolean) => void;
  label: string;
  iconType?: IconType;
  disabled?: boolean;
}
