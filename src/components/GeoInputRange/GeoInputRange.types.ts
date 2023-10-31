export type Pair = [number | undefined, number | undefined];

export type InputRangeProps = {
  id?: string;
  label?: string;
  tooltipPlacement?: import('@restart/ui/usePopper').Placement;
  rangeType: 'number' | 'text';
  min?: number;
  max?: number;
  placeholderMin?: string;
  placeholderMax?: string;
  minRequired?: boolean;
  maxRequired?: boolean;
  step?: number;
  disabled?: boolean;
  value?: any;
  className?: string;
  onChange?: (value: any) => void;
  onClickHandler?: () => void;
  size?: 'fullwidth' | 'halfwidth' | 'width300';
  isPicket?: boolean;
  setIsValid?: (value: boolean) => void;
};
