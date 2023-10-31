import { UiComponentSizeType } from './../../../global.types';

export interface GeoTextareaInputProps {
  rows?: number;
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size?: UiComponentSizeType;
}
