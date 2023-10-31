import React from 'react';
import './GeoTextareaInput.scss';
import { GeoTextareaInputProps } from './GeoTextareaInput.types';
import { nanoid } from 'nanoid';

const GeoTextareaInput = (props: GeoTextareaInputProps) => {
  const { rows = 3, name, placeholder, label, value, onChange, size = 'full_width' } = props;
  const idRandom = nanoid();
  // const idRandom = '123';
  return (
    <div className={`GeoTextareaInput__container GeoTextareaInput--${size}`}>
      {label?.length > 0 && (
        <label htmlFor={idRandom} className="form-label">
          {label}
        </label>
      )}
      <textarea
        className="GeoTextareaInput__textarea form-control"
        id={idRandom}
        rows={rows}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event)}
      ></textarea>
    </div>
  );
};

export default GeoTextareaInput;
