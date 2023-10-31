export type GeoDoubleRangeSliderProps = {
  sliderName?:
    | 'lyr_road_conditions_lanes'
    | 'lyr_road_conditions_top_speed'
    | 'lyr_road_conditions_capacity'
    | 'lyr_road_conditions_traffic'
    | 'lyr_roadway_width'
    | 'lyr_roadbed_width';
  size?: 'fullwidth' | 'halfwidth' | 'width300';
  min: number;
  max: number;
  step?: number;
  stepCount?: number;
  hideRange?: boolean;
  onChangeEvent?: (min: number, max: number) => void;
  currentMin?: number | null;
  currentMax?: number | null;
};
