import React from 'react';
import './GeoStatus.scss';
import { GeoStatusProps } from './GeoStatus.types';

const GeoStatus = ({ color = 'grey', text }: GeoStatusProps) => {
  return (
    <div className="d-flex align-items-center">
      <div className={`GeoStatus_circle GeoStatus_circle_${color}`}></div>
      <span className="`GeoStatus_text ms-2">{text}</span>
    </div>
  );
};

export default GeoStatus;
