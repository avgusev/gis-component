import React, { memo, useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveRegion, getRegions, resetRegions, setRegionFilter } from '../../../reducers/region.reducer';
import { setFilter, deleteFilter } from '../../../reducers/filters.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';

const GeoSearchRegions = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.region.filter);
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const regions: Array<IFilterSelectType> = useAppSelector((state) => state.region.data);
  const selected: Array<IFilterSelectType> = useAppSelector((state) => state.region.selected);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getRegions({ level: 1, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={regions}
        value={selected}
        filterValue={filter}
        search
        placeholder="Регион"
        getOptionValue={(region: IFilterSelectType) => region.id}
        getOptionLabel={(region: IFilterSelectType) => region.name}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveRegion(item));
          // dispatch(setRegionFilter(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setRegionFilter(value));
          // if (value.length >= 1) {
          dispatch(getRegions({ search: value, level: 1, selected: selectedFilters }));
          // }
          // if (value.length === 0) { dispatch(getRegions({ search: value, level: 1 }))}
          // if (value.length >= 1) {
          //   dispatch(getRegions({ search: value, level: 1 }));
          // } else if (value.length === 0) {
          //   dispatch(getRegions({ search: value, level: 1 }));
          // }
        }}
      />
    </>
  );
};

export default GeoSearchRegions;
