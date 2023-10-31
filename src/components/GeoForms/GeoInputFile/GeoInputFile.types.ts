import { InputHTMLAttributes } from 'react';
import { UiComponentSizeType } from '../../../global.types';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'>;

export interface GeoInputFileProps extends HTMLInputProps {
  onChange: (value: any) => void;
  size?: UiComponentSizeType;
  label?: string;
  isPrewier?: boolean;
  btnText?: string;
  setPrewier: (value: any) => void;
  prewier: any;
}
