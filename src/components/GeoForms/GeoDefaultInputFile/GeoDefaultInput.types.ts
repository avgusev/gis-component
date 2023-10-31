import { InputHTMLAttributes } from 'react';
import { UiComponentSizeType } from '../../../global.types';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'directory'>;

export interface GeoDefaultInputProps extends HTMLInputProps {
  onChange: (value: any) => void;
  size?: UiComponentSizeType;
  label?: string;
  directory?: boolean;
}
