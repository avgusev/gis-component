import React from 'react';
import GeoIconButton from '../GeoIconButton';
import './GeoKeyboardArrows.scss';
import { GeoKeyboardArrowsTypes } from './GeoKeyboardArrows.types';

const GeoKeyboardArrows = (props: GeoKeyboardArrowsTypes) => {
  const { handleClickUpArrow, handleClickDownArrow } = props;
  return (
    <div className="GeoKeyboardArrows__container">
      <div className="GeoKeyboardArrows__container__row">
        <div className="GeoKeyboardArrows__container__item">
          <GeoIconButton iconType="arrow_up" handleClick={handleClickUpArrow} classes="dark" />
        </div>
      </div>
      <div className="GeoKeyboardArrows__container__row">
        {/* <div className="GeoKeyboardArrows__container__item">
          <GeoIconButton iconType="arrow-left" handleClick={handleClickLeftArrow} classes="dark" />
        </div> */}
        <div className="GeoKeyboardArrows__container__item">
          <GeoIconButton iconType="arrow_down" handleClick={handleClickDownArrow} classes="dark" />
        </div>
        {/* <div className="GeoKeyboardArrows__container__item">
          <GeoIconButton iconType="arrow-right" handleClick={handleClickRightArrow} classes="dark" />
        </div> */}
      </div>
    </div>
  );
};

export default GeoKeyboardArrows;
