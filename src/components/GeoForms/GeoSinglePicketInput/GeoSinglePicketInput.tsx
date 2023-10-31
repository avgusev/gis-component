import React, { useState } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GeoSinglePicketInputProps } from './GeoSinglePicketInput.types';

function GeoSinglePicketInput({
  id,
  label,
  placeholder,
  disabled,
  value,
  className,
  onChange,
  rangeType,
  tooltipPlacement = 'right',
  size = 'width300',
  setIsValid,
}: GeoSinglePicketInputProps) {
  const [isHoverTooltip, setIsHoverTooltip] = useState(false);
  const [error, setError] = useState<string>();

  const onChangeRange = (inputValue: string) => {
    setIsValid && setIsValid(false);
    setError(undefined);
    verifyInterval(inputValue);
  };

  const verifyInterval = (inputValue: string) => {
    let isError = null;
    if (rangeType === 'text') {
      isError = verifyString(inputValue);

      if (isError) {
        setError(isError);
        onChange && onChange(inputValue);
      } else {
        onChange(inputValue);

        setIsValid && setIsValid(true);
      }
    }
  };

  const verifyString = (num): string | undefined => {
    if (num.length === 0) {
      return 'Заполните местоположение';
    }
    if (!num.includes('+')) {
      return `Заполните местоположение используя символ '+' для разделения км и м`;
    }
    if (num.split('+')[0].length <= 0) {
      return `Значение местоположения должно содержать хотя бы одну цифру перед '+'`;
    }
    if (+num.split('+')[0] < 0) {
      return `Значение местоположения не должно быть отрицательным`;
    }
    if (+num.split('+')[1] < 0) {
      return `Значение местоположения не должно быть отрицательным`;
    }
    if (num.split('+')[1].length !== 3) {
      return `Значение местоположения должно содержать 3 цифры после '+'`;
    }
    if (isNaN(Number(num.split('+')[0])) || isNaN(Number(num.split('+')[1]))) {
      return `Значение местоположения должно соответствовать шаблону 0+000`;
    }
    return;
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <OverlayTrigger
        placement={tooltipPlacement}
        show={!!error && isHoverTooltip}
        popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [-14, 4] } }] }}
        overlay={<Tooltip show={!!error}>{error}</Tooltip>}
      >
        <div
          className={`GeoInputRange GeoInputRange--${size}`}
          onMouseEnter={() => setIsHoverTooltip(true)}
          onMouseLeave={() => setIsHoverTooltip(false)}
        >
          <FormControl
            id={id}
            disabled={disabled}
            type={rangeType}
            size="sm"
            placeholder={placeholder}
            value={value ?? ''}
            className={`${className} ${error ? 'is-invalid bg-gradient pe-3' : ''}`}
            onChange={(e) => onChangeRange(e.target.value)}
          />
        </div>
      </OverlayTrigger>
    </div>
  );
}

export default GeoSinglePicketInput;
