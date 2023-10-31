import React from 'react';
import { GeoSideBarTypes } from './GeoSideBar.types';
import './GeoSideBar.scss';

const GeoSideBar = ({ buttons }: GeoSideBarTypes) => {
  return (
    <div className="GeoSideBar__container ">
      {buttons.map((button, index) => (
        <div key={`sidebar_${index}_btn`} className="GeoSideBar__item">
          {button}
        </div>
      ))}
    </div>
  );
};

export default GeoSideBar;
