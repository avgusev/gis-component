import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import {
  addOrRemoveAgglomeration,
  getAgglomerations,
  resetAgglomerations,
  setAgglomerationFilter,
} from '../../../reducers/agglomeration.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { deleteFilter, setFilter } from '../../../reducers/filters.reducer';

const GeoSearchAgglomerations = () => {
  const dispatch = useAppDispatch();
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const filter = useAppSelector((state) => state.agglomeration.filter);
  const agglomerations = useAppSelector((state) => state.agglomeration.data);
  const selected = useAppSelector((state) => state.agglomeration.selected);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getAgglomerations({ level: 2, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={agglomerations}
        value={selected}
        filterValue={filter}
        search
        placeholder="Агломерация"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveAgglomeration(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setAgglomerationFilter(value));
          // if (value.length >= 1) {
          dispatch(getAgglomerations({ search: value, level: 2, selected: selectedFilters }));
          // }
          // if (value.length >= 1) {
          //   dispatch(getAgglomerations({ search: value, size: 0 }));
          // } else if (value.length === 0) {
          //   dispatch(getAgglomerations({ search: value, size: 0, sort: 'asc' }));
          // }
        }}
      />
    </>
  );
};

export default GeoSearchAgglomerations;
