import { IconType } from './../../global.types';
export type GeoIconProps = React.HTMLAttributes<HTMLElement> & {
  name: string;
  width?: number;
  height?: number;
  iconType: IconType;
};

export type GeoIconMapProps = React.HTMLAttributes<HTMLElement> & {
  width?: number;
  height?: number;
  iconType: string;
};
