import { UiComponentSizeType, IconType } from './../../../global.types';
import { InputHTMLAttributes } from 'react';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'type'>;

export interface GeoInputFieldType extends HTMLInputProps {
  placeholder?: string;
  label?: string;
  name: string;
  value?: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  size?: UiComponentSizeType;
  type?: 'text' | 'date' | 'number';
  additionIconType?: IconType;
  additionEvent?: () => void;
}
