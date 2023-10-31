import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { addOrRemoveRoadworks5y, getRoadworks5yYears, setRoadworks5yFilter } from '../../../reducers/roadworks5y.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';

const GeoSearchWorksYear = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.roadworks5y.filter);
  const roadworks5yYears = useAppSelector((state) => state.roadworks5y.data);
  const selected = useAppSelector((state) => state.roadworks5y.selected);

  // useEffect(() => {
  //   const newCollection = [...new Set([...routes, ...selected])];
  //   setCheckCollection(newCollection);
  // }, [routes, selected]);

  return (
    <>
      <GeoCheckSelect
        //options={checkCollection}
        options={roadworks5yYears}
        value={selected}
        filterValue={filter}
        search
        placeholder="Год работ"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item) => dispatch(addOrRemoveRoadworks5y(item))}
        // getCoordinates={(id) => dispatch(getCoordinates(null))}
        onChangeInput={(value) => {
          dispatch(setRoadworks5yFilter(value));
          if (value.length >= 1) {
            dispatch(getRoadworks5yYears({ search: value }));
          } else if (value.length === 0) {
            dispatch(getRoadworks5yYears({ search: value }));
          }
        }}
      />
    </>
  );
};

export default GeoSearchWorksYear;
