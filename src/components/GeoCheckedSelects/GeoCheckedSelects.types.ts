import { IFilterSelectType } from '../../global.types';

export interface GeoCheckedSelectsTypes {
  options?: IFilterSelectType[];
  value?: readonly IFilterSelectType[];

  filterValue: string;
  search?: boolean;
  placeholder?: string;
  maxHeight?: string;
  disabled?: boolean;
  inputWrapperClassName?: string;
  optionsWrapperClassName?: string;
  onChangeCheck: (value: IFilterSelectType, e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeInput: (value: string) => void;
  getOptionValue: (option: IFilterSelectType) => bigint;
  getOptionLabel: (option: IFilterSelectType) => string;
  optionIsDisabled?: (option: IFilterSelectType) => boolean;
  getCoordinates?: (value: bigint) => void;
}
