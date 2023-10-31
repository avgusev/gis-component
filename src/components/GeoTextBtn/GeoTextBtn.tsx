import React from 'react';
import { GeoTextBtnProps } from './GeoTextBtn.types';
import './GeoTextBtn.scss';
import GeoIcon from '../GeoIcon';

const GeoTextBtn = (props: GeoTextBtnProps) => {
  const { label, iconType, handlerClick, disabled = false } = props;
  return (
    <div className="GeoTextBtn__container">
      {iconType && <GeoIcon name={iconType} iconType={iconType} />}
      <button type="button" onClick={handlerClick} disabled={disabled} className="mt-1 ps-0 GeoTextBtn__btn">
        {label}
      </button>
    </div>
  );
};

export default GeoTextBtn;
