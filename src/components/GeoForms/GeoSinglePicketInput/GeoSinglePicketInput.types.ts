export type GeoSinglePicketInputProps = {
    id?: string;
    label?: string;
    tooltipPlacement?: import('@restart/ui/usePopper').Placement;
    rangeType: 'number' | 'text';
    placeholder?: string;
    disabled?: boolean;
    value?: any;
    className?: string;
    onChange?: (value: any) => void;
    size?: 'fullwidth' | 'halfwidth' | 'width300';
    setIsValid?: (value: boolean) => void;
  };
