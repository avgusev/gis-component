import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GeoInputRange from '../GeoInputRange/GeoInputRange';
import { Pair } from '../GeoInputRange/GeoInputRange.types';
import './GeoDoubleRangeSlider.scss';
import { GeoDoubleRangeSliderProps } from './GeoDoubleRangeSlider.types';

const GeoDoubleRangeSlider = (props: GeoDoubleRangeSliderProps) => {
  const {
    min,
    max,
    onChangeEvent,
    step = 1,
    stepCount = 1,
    hideRange = false,
    sliderName = '',
    currentMin,
    currentMax,
    size = 'width300',
  } = props;
  const [minVal, setMinVal] = useState(currentMin ? currentMin : min);
  const [maxVal, setMaxVal] = useState(currentMax ? currentMax : max);
  const [rangeVal, setRangeVal] = useState<Pair>([undefined, undefined]);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const rangeRef = useRef<HTMLDivElement>(null);

  const sliderTrackRender = useMemo(() => {
    let result: React.ReactNode[] = [];
    for (let i = 0; i < stepCount; i++) {
      result.push(<div className={`slider__${sliderName}__${i}`}></div>);
    }
    return result;
  }, [stepCount, sliderName]);

  useEffect(() => {
    setMinVal;
  }, []);

  const getPercent = useCallback(
    (value: number) => {
      const a = value - min;
      const b = max - min;
      const c = (a / b) * 100;
      const d = Math.round(c);
      console.log(a, b, c, d);

      return Math.round(((value - min) / (max - min)) * 100);
    },
    [min, max]
  );

  useEffect(() => {

    if (stepCount === 1) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxValRef.current);
 
      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;

      }
    }
  }, [minVal, getPercent, stepCount]);

  useEffect(() => {

    if (stepCount === 1) {
      const minPercent = getPercent(minValRef.current);
      const maxPercent = getPercent(maxVal);

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;

      }
    }
  }, [maxVal, getPercent, stepCount]);

  useEffect(() => {
    setRangeVal([minVal, maxVal]);
    onChangeEvent(minVal, maxVal);

  }, [minVal, maxVal]);

  const onChangeRangeHandler = (value) => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  };

  return (
    <>
      {!hideRange && (
        <div className="double-range-slider__range">
          <GeoInputRange
            id="lanes-range"
            label=""
            rangeType="number"
            min={min}
            max={max}
            minRequired
            maxRequired
            value={rangeVal}
            onChange={onChangeRangeHandler}
            tooltipPlacement="left-start"
            size={size}
          />
        </div>
      )}
      <div className={`double-range-slider double-range-slider--${size}`}>
        <div className={`slider`}>
          <input
            type="range"
            min={min}
            defaultValue={1}
            max={max}
            value={minVal}
            step={step}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Math.min(Number(event.target.value), maxVal - 1);
              setMinVal(value);
              minValRef.current = value;
            }}
            className={`thumb slider__${sliderName} thumb__left`}
            style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            step={step}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Math.max(Number(event.target.value), minVal + 1);
              setMaxVal(value);
              maxValRef.current = value;
            }}
            className={`thumb slider__${sliderName} thumb__right`}
          />

          <div className="slider__track">{sliderTrackRender}</div>
          {stepCount === 1 && <div ref={rangeRef} className="slider__range"></div>}
        </div>
      </div>
    </>
  );
};

export default GeoDoubleRangeSlider;
