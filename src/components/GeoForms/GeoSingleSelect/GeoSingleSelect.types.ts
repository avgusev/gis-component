import { UiComponentSizeType } from './../../../global.types';
export interface ISelectOption {
  value: string;
  label: string;
}

export interface GeoSingleSelectType {
  disabled?: boolean;
  options?: any;
  placeholder?: string;
  className?: string;
  label?: string;
  value?: string;
  name: string;
  size?: UiComponentSizeType;
  // defaultValue?: string;
  // defaultChecked?: boolean;
  defaultValue?: any;
  readonly?: boolean;
  onChange?: (event: any) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}
