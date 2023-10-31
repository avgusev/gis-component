import React, { useState } from 'react';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoInputRange from '../GeoInputRange/GeoInputRange';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GeoPicketRoadSearch } from './GeoPicketRoadSearch.types';
import './GeoPicketRoadSearch.scss';
import { useAppDispatch } from '../../config/store';
import { openPicket } from '../../reducers/picket.reducer';

const GeoPicketRoadSearch = ({ valueRange, setValueRange, onShowPicket, onRemovePicket }: GeoPicketRoadSearch) => {
  const dispatch = useAppDispatch();

  const onClickHandler = () => {
    onShowPicket();
  };
  return (
    <>
      <div className="GeoPocketRoadSearch__container">
        <div className="GeoPocketRoadSearch__container__header">
          <span className="GeoPocketRoadSearch__container____header__title">Поиск участка дороги</span>
          <div
            onClick={() => {
              dispatch(openPicket(false));
              onRemovePicket();
            }}
          >
            <GeoIcon name="close" iconType="close" />
          </div>
        </div>
        <GeoInputRange
          id="picket-search-range"
          label=""
          rangeType="text"
          // min={0}
          // max={100}
          minRequired
          maxRequired
          placeholderMin="0+000"
          placeholderMax="0+000"
          isPicket
          value={valueRange}
          onChange={() => setValueRange(valueRange)}
          onClickHandler={onClickHandler}
          size="fullwidth"
        />
      </div>
    </>
  );
};

export default GeoPicketRoadSearch;
