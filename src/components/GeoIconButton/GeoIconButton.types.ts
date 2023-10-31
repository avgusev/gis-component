import { IconType, tooltipPlacement } from './../../global.types';

interface GeoIconButtonTypes {
  content?: string;
  classes?: string;
  isDisabled?: boolean;
  iconType: IconType;
  handleClick?: () => void;
  badgeCount?: number;
  isTransparent?: boolean;
  isActive?: boolean;
  tooltipName?: string;
  tooltipPlacement?: tooltipPlacement;
  tooltipId?: string;
}

export default GeoIconButtonTypes;
