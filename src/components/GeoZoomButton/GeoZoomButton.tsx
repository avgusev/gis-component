import React, { FC } from 'react';
import GeoZoomButtonTypes from './GeoZoomButton.types';
import GeoIconButton from '../GeoIconButton/GeoIconButton';
import './GeoZoomButton.scss';

export const GeoZoomButton: FC<GeoZoomButtonTypes> = ({ handleClickPlus, handleClickMinus }) => {
  return (
    <>
      <div className="zoomBtn__container">
        <GeoIconButton
          classes="zoomBtn__plus"
          iconType="plus"
          handleClick={handleClickPlus}
          tooltipName="Приблизить"
          tooltipId="tooltip-zoomBtn-plus"
          tooltipPlacement="left"
        />
        <GeoIconButton
          classes="zoomBtn__minus"
          iconType="minus"
          tooltipName="Отдалить"
          tooltipId="tooltip-zoomBtn-minus"
          tooltipPlacement="left"
          handleClick={handleClickMinus}
        />
      </div>
    </>
  );
};

export default GeoZoomButton;
