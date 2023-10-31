import { StrictGlobalTypes } from '@storybook/csf';

export interface IFilterSelectType {
  id: bigint;
  name: string;
}

export interface ISelectType {
  value: bigint;
  label: string;
  data?: {};
}

export type UiComponentSizeType = 'full_width' | 'half_width' | 'width_300';

export type tooltipPlacement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export type IconType =
  | 'report'
  | 'history'
  | 'clock'
  | 'flash'
  | 'pending_document'
  | 'printer'
  | 'find_me'
  | 'find_me_active'
  | 'internet_search'
  | 'layers'
  | 'list'
  | 'question'
  | 'plus'
  | 'minus'
  | 'close'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow_up'
  | 'checked'
  | 'unchecked'
  | 'lidar'
  | 'network'
  | 'dots-cloud'
  | 'dots'
  | 'panorama'
  | 'route_3'
  | 'download'
  | 'arrow_down'
  | 'settings'
  | 'road'
  | 'gallery'
  | 'search'
  | 'eye_closed'
  | 'load_spinner'
  | 'arrow_left_full'
  | 'map'
  | 'more_vertical'
  | 'edit'
  | 'tool'
  | 'message'
  | 'add_place'
  | 'remove_place'
  | 'route'
  | 'draw'
  | 'cancel'
  | 'undo'
  | 'upload'
  | 'download_2'
  | 'trash'
  | 'bridge'
  | 'ruler'
  | 'cog'
  | 'check'
  | 'question'
  | 'file-text'
  | 'list_on_map';

export interface bridgeObjType {
  FULL_NAME: string | null;
  TYPE_NAME?: string | null;
  TYPE: number | null;
  BRIDGE_TYPE_1: number | null;
  BRIDGE_TYPE_1_NAME?: string | null;
  START: string | null;
  FINISH: string | null;
  GEOM?: any | null;
  OBSTACLE_NAME?: string | null;
  TYPE_OF_OBSTACLE: number | null;
  TYPE_OF_OBSTACLE_NAME?: string | null;
  LENGTH: string | null;
  TECHNICAL_CONDITION: number | null;
  TECHNICAL_CONDITION_NAME?: string | null;
  REGION: number | null;
  REGION_NAME?: string | null;
  OWNER: number | null;
  OWNER_NAME?: string | null;
}
