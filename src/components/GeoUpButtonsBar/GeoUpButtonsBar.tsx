import React from 'react';
import { GeoUpButtinsBarTypes } from './GeoUpButtonsBar.types';
import './GeoUpButtonsBar.scss';

const GeoUpButtonsBar = ({ buttons }: GeoUpButtinsBarTypes) => {
  return (
    <div className="GeoUpButtonsBar__container">
      {buttons.map((button, index) => (
        <div key={`upbar_${index}_button`} className="GeoUpButtonsBar__item">
          {button}
        </div>
      ))}
    </div>
  );
};

export default GeoUpButtonsBar;
