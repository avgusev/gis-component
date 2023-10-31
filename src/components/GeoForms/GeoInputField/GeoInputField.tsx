import React from 'react';
import { GeoInputFieldType } from './GeoInputField.types';
import './GeoInputField.scss';
import { nanoid } from 'nanoid';
import GeoIconButton from '../../GeoIconButton';

const GeoInputField = (props: GeoInputFieldType) => {
  const {
    name,
    placeholder,
    label,
    value,
    onChange,
    additionEvent,
    size = 'full_width',
    type = 'text',
    defaultValue,
    additionIconType,
    ...otherProps
  } = props;
  const idRandom = nanoid();
  const minMax: any = {};
  if (props.type === 'date') {
    minMax.min = '1990-01-01';
    minMax.max = '2199-12-31';
  }
  return (
    <>
      {label?.length > 0 && (
        <label htmlFor={idRandom} className="form-label">
          {label}
        </label>
      )}
      <div className={`GeoInputField__container GeoInputField--${size}`}>
        <input
          className={`form-control form-control-sm`}
          id={idRandom}
          name={name}
          onChange={(event) => onChange(event)}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          {...otherProps}
          {...minMax}
        />
        {additionIconType && (
          <GeoIconButton classes="GeoInputField__additionEvent" iconType={additionIconType} isTransparent handleClick={additionEvent} />
        )}
      </div>

      <div className="invalid-feedback">Некорректные данные</div>
    </>
  );
};

export default GeoInputField;
