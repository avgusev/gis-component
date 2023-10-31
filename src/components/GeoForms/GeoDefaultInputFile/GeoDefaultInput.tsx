import React from 'react';
import { GeoDefaultInputProps } from './GeoDefaultInput.types';

const GeoDefaultInput = (props) => {
  const { onChange, label, size, directory = false, ...otherProps } = props;
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <input
        type="file"
        className={`form-control form-control-sm GeoInputFile--${size}`}
        onChange={(e) => {
          onChange(e);
        }}
        {...otherProps}
        autoComplete="off"
        directory
      />
    </div>
  );
};

export default GeoDefaultInput;
