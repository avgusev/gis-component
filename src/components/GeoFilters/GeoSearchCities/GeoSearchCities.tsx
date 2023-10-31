import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveCity, getCities, resetCities, setCityFilter } from '../../../reducers/city.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { deleteFilter, setFilter } from '../../../reducers/filters.reducer';

const GeoSearchCities = () => {
  const dispatch = useAppDispatch();
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const filter = useAppSelector((state) => state.city.filter);
  const cities = useAppSelector((state) => state.city.data);
  const selected = useAppSelector((state) => state.city.selected);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getCities({ level: 4, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        options={cities}
        value={selected}
        filterValue={filter}
        search
        placeholder="Город"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveCity(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setCityFilter(value));
          // if (value.length >= 1) {
            dispatch(getCities({ search: value, level: 4, selected: selectedFilters }));
          // }
          // if (value.length >= 1) {
          //   dispatch(getCities({ search: value, sort: 'asc' }));
          // } else if (value.length === 0) {
          //   dispatch(getCities({ search: value, sort: 'asc' }));
          // }
        }}
      />
    </>
  );
};

export default GeoSearchCities;
