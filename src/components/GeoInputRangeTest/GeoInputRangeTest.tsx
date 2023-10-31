import React, { useEffect, useState, ChangeEvent, ChangeEventHandler } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './GeoInputRange.scss';
import { InputRangeProps } from './GeoInputRangeTest.types';

const GeoInputRangeTest = (props: InputRangeProps) => {
  const {
    label,
    id,
    rangeType,
    min,
    max,
    step = 1,
    size = 'fullwidth',
    placeholderMax,
    placeholderMin,
    tooltipPlacement = 'bottom',
    disabled = false,
    value = [undefined, undefined],
    onChange,
    isMinRequired,
    isMaxRequired,
    setIsValidRange,
    isValidation = true,
  } = props;

  const [error, setError] = useState('');

  const veryfyNumber = (fromNum: any, toNum: any): string | undefined => {
    if (isNaN(fromNum) && isMinRequired) {
      return 'Заполните начало интервала';
    }
    if (isNaN(toNum) && isMaxRequired) {
      return 'Заполните конец интервала';
    }

    if (fromNum < 0) return 'Начало интервала не может быть отрицательным';
    if (toNum < 0) return 'Конец интервала не может быть отрицательным';

    if (fromNum > toNum) return 'Начало интервала не должно быть больше, чем его конец';

    if (min && fromNum < min) return `Начало интервала не может быть меньше ${min}`;
    if (max && fromNum > max) return `Начало интервала не может быть больше ${max}`;
    if (min && toNum < min) return `Конец интервала не может быть меньше ${min}`;
    if (max && toNum > max) return `Конец интервала не может быть больше ${max}`;
    return '';
  };

  const verifyString = (fromNum: any, toNum: any): string => {
    if (!fromNum) {
      return 'Заполните начало интервала';
    }
    if (!toNum) {
      return 'Заполните конец интервала';
    }
    if (fromNum?.length === 0) {
      return 'Заполните начало интервала';
    }
    if (toNum?.length === 0) {
      return 'Заполните конец интервала';
    }
    if (!fromNum?.includes('+')) {
      return `Заполните начало интервала используя символ '+' для разделения км и м`;
    }
    if (!toNum?.includes('+')) {
      return `Заполните конец интервала используя символ '+' для разделения км и м`;
    }
    if (fromNum?.split('+')[0]?.length <= 0) {
      return `Начало интервала должно содержать хотя бы одну цифру перед '+'`;
    }
    if (toNum?.split('+')[0]?.length <= 0) {
      return `Конец интервала должен содержать хотя бы одну цифру перед '+'`;
    }
    if (fromNum?.split('+')[1]?.length !== 3) {
      return `Начало интервала должно содержать 3 цифры после '+'`;
    }
    if (toNum?.split('+')[1]?.length !== 3) {
      return `Конец интервала должен содержать 3 цифры после '+'`;
    }
    if (+fromNum?.split('+')[0] < 0) {
      return `Начало интервала не должно быть отрицательным`;
    }
    if (+toNum?.split('+')[0] < 0) {
      return `Конец интервала не должен быть отрицательным`;
    }
    if (+fromNum?.split('+')[1] < 0) {
      return `Начало интервала не должно быть отрицательным`;
    }
    if (+toNum?.split('+')[1] < 0) {
      return `Конец интервала не должен быть отрицательным`;
    }
    if (+fromNum?.split('+')[0] > +toNum?.split('+')[0]) {
      return `Начало интервала должно быть меньше конца интервала`;
    }
    if (+fromNum?.split('+')[0] === +toNum?.split('+')[0] && +fromNum?.split('+')[1] >= +toNum?.split('+')[1]) {
      return `Начало интервала должно быть меньше конца интервала`;
    }
    if (isNaN(fromNum?.split('+')[0]) || isNaN(fromNum?.split('+')[1])) {
      return `Начало интервала должно соответствовать шаблону 0+000`;
    }
    if (isNaN(Number(toNum?.split('+')[0])) || isNaN(Number(toNum?.split('+')[1]))) {
      return `Конец интервала должен соответствовать шаблону 0+000`;
    }
    return '';
  };

  const onChangeHandler = (newValue, index) => {
    setError('');
    if (index === 0) {
      onChange([newValue, value[1]]);
      if (rangeType === 'text' && isValidation) {
        setError(verifyString(newValue, value[1]));
      }
      if (rangeType === 'number' && isValidation) {
        setError(veryfyNumber(newValue, value[1]));
      }
    } else {
      onChange([value[0], newValue]);
      if (rangeType === 'text' && isValidation) {
        setError(verifyString(value[0], newValue));
      }
      if (rangeType === 'number' && isValidation) {
        setError(veryfyNumber(value[0], newValue));
      }
    }
  };

  useEffect(() => {
    if (setIsValidRange && value[0] && value[1]) {
      if (error.length === 0) {
        setIsValidRange(true);
      } else {
        setIsValidRange(false);
      }
    }
  }, [error]);

  return (
    <div className="GeoInputRangeTest__container">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <OverlayTrigger
        placement={tooltipPlacement}
        show={!!error}
        popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [-14, 4] } }] }}
        overlay={<Tooltip show={!!error}>{error}</Tooltip>}
      >
        <div className={`GeoInputRange GeoInputRange--${size}`}>
          <FormControl
            id={id}
            disabled={disabled}
            type={rangeType}
            size="sm"
            min={min}
            max={max}
            placeholder={min !== undefined ? 'от ' + min : placeholderMin}
            value={value[0] ?? ''}
            step={step}
            className={`${error ? 'is-invalid bg-gradient pe-3' : ''}`}
            onChange={(e) => onChangeHandler(e.target.value, 0)}
          />
          <span className="align-self-center text-muted" style={{ padding: '0.125rem' }}>
            &ndash;
          </span>
          <FormControl
            disabled={disabled}
            type={rangeType}
            size="sm"
            min={min}
            max={max}
            placeholder={max !== undefined ? 'до ' + max : placeholderMax}
            value={value[1] ?? ''}
            step={step}
            className={`${error ? 'is-invalid bg-gradient pe-3' : ''}`}
            onChange={(e) => onChangeHandler(e.target.value, 1)}
          />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default GeoInputRangeTest;
