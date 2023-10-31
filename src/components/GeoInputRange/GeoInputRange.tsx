import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { InputRangeProps } from './GeoInputRange.types';
import './GeoInputRange.scss';
import { useAppDispatch } from '../../config/store';
import { setPicket } from '../../reducers/picket.reducer';

function GeoInputRange({
  id,
  label,
  min,
  max,
  placeholderMin,
  placeholderMax,
  minRequired = false,
  maxRequired = false,
  step = 1,
  disabled,
  value = [undefined, undefined],
  className,
  onChange,
  rangeType,
  onClickHandler,
  tooltipPlacement = 'right',
  size = 'width300',
  isPicket = false,
  setIsValid,
}: InputRangeProps) {
  const [isHoverTooltip, setIsHoverTooltip] = useState(false);
  const [error, setError] = useState<string>();
  const [fromNum, setFromNum] = useState<string>(String(value[0] || 0));
  const [toNum, setToNum] = useState<string>(String(value[1] || 0));
  const [isShowSubmitBtn, setIsShowSubmitBtn] = useState(true);
  const dispatch = useAppDispatch();
  const onChangeRange = (inputValue: string, index: number) => {
    setIsValid && setIsValid(false);
    index === 0 ? setFromNum(inputValue) : setToNum(inputValue);
    setError(undefined);
    verifyInterval(inputValue, index);
  };

  useEffect(() => {
    setFromNum(String(value[0] || 0));
    setToNum(String(value[1] || 0));
  }, [value]);

  const verify = useCallback(
    (fromNum: number, toNum: number): string | undefined => {
      if (isNaN(fromNum) && minRequired) {
        return 'Заполните начало интервала';
      }
      if (isNaN(toNum) && maxRequired) {
        return 'Заполните конец интервала';
      }

      if (fromNum < 0) return 'Начало интервала не может быть отрицательным';
      if (toNum < 0) return 'Конец интервала не может быть отрицательным';

      if (fromNum > toNum) return 'Начало интервала не должно быть больше, чем его конец';

      if (min && fromNum < min) return `Начало интервала не может быть меньше ${min}`;
      if (max && fromNum > max) return `Начало интервала не может быть больше ${max}`;
      if (min && toNum < min) return `Конец интервала не может быть меньше ${min}`;
      if (max && toNum > max) return `Конец интервала не может быть больше ${max}`;

      return;
    },
    [max, maxRequired, min, minRequired]
  );

  const verifyInterval = useCallback(
    (inputValue: string, index: number) => {
      let isError = null;

      if (rangeType === 'number') {
        const val1 = parseFloat(index === 0 ? inputValue : fromNum);
        const val2 = parseFloat(index === 1 ? inputValue : toNum);

        isError = verify(val1, val2);

        if (isError) {
          setIsShowSubmitBtn(false);
          setError(isError);
        } else {
          onChange && onChange([val1, val2]);
        }
      }
      if (rangeType === 'text') {
        const val1 = index === 0 ? inputValue : fromNum;
        const val2 = index === 1 ? inputValue : toNum;
        isError = verifyString(val1, val2);

        if (isError) {
          setIsShowSubmitBtn(false);
          setError(isError);
        } else {
          isPicket ? dispatch(setPicket([val1, val2])) : onChange([val1, val2]);

          setIsValid && setIsValid(true);
          setIsShowSubmitBtn(true);
        }
      }
    },
    [fromNum, toNum, verify]
  );

  const verifyString = useCallback(
    (fromNum: string, toNum: string): string | undefined => {
      if (fromNum.length === 0) {
        return 'Заполните начало интервала';
      }
      if (toNum.length === 0) {
        return 'Заполните конец интервала';
      }
      if (!fromNum.includes('+')) {
        return `Заполните начало интервала используя символ '+' для разделения км и м`;
      }
      if (!toNum.includes('+')) {
        return `Заполните конец интервала используя символ '+' для разделения км и м`;
      }
      if (fromNum.split('+')[0].length <= 0) {
        return `Начало интервала должно содержать хотя бы одну цифру перед '+'`;
      }
      if (toNum.split('+')[0].length <= 0) {
        return `Конец интервала должен содержать хотя бы одну цифру перед '+'`;
      }
      if (fromNum.split('+')[1].length !== 3) {
        return `Начало интервала должно содержать 3 цифры после '+'`;
      }
      if (toNum.split('+')[1].length !== 3) {
        return `Конец интервала должен содержать 3 цифры после '+'`;
      }
      if (+fromNum.split('+')[0] > +toNum.split('+')[0]) {
        return `Начало интервала должно быть меньше конца интервала`;
      }
      if (+fromNum.split('+')[0] < 0) {
        return `Начало интервала не должно быть отрицательным`;
      }
      if (+toNum.split('+')[0] < 0) {
        return `Конец интервала не должен быть отрицательным`;
      }
      if (+fromNum.split('+')[1] < 0) {
        return `Начало интервала не должно быть отрицательным`;
      }
      if (+toNum.split('+')[1] < 0) {
        return `Конец интервала не должен быть отрицательным`;
      }
      if (+fromNum.split('+')[0] === +toNum.split('+')[0] && +fromNum.split('+')[1] >= +toNum.split('+')[1]) {
        return `Начало интервала должно быть меньше конца интервала`;
      }
      if (isNaN(Number(fromNum.split('+')[0])) || isNaN(Number(fromNum.split('+')[1]))) {
        return `Начало интервала должно соответствовать шаблону 0+000`;
      }
      if (isNaN(Number(toNum.split('+')[0])) || isNaN(Number(toNum.split('+')[1]))) {
        return `Конец интервала должен соответствовать шаблону 0+000`;
      }

      return;
    },
    [max, maxRequired, min, minRequired]
  );

  useEffect(() => {
    return setIsShowSubmitBtn(false);
  }, []);

  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      show={isShowSubmitBtn && isPicket}
      popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [-14, 4] } }] }}
      overlay={
        <Tooltip id="show-btn-tooltip" show={isShowSubmitBtn} onClick={onClickHandler}>
          <button className="GeoInputRange__show-btn-tooltip__btn" type="button">
            Показать
          </button>
        </Tooltip>
      }
    >
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
              min={min}
              max={max}
              placeholder={min !== undefined ? 'от ' + min : placeholderMin}
              value={fromNum ?? ''}
              step={step}
              className={`${className} ${error ? 'is-invalid bg-gradient pe-3' : ''}`}
              onChange={(e) => onChangeRange(e.target.value, 0)}
              // onBlur={notify}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') notify();
              // }}
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
              value={toNum ?? ''}
              step={step}
              className={`${className} ${error ? 'is-invalid bg-gradient pe-3' : ''}`}
              onChange={(e) => onChangeRange(e.target.value, 1)}
              // onBlur={notify}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') notify();
              // }}
            />
          </div>
        </OverlayTrigger>
      </div>
    </OverlayTrigger>
  );
}

export default GeoInputRange;
