import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import {
  addOrRemovePlanningStructure,
  getPlaningStructures,
  resetPlanningStructures,
  setPlanningStructureFilter,
} from '../../../reducers/planningStructure.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import { IFilterSelectType } from '../../../global.types';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { deleteFilter, setFilter } from '../../../reducers/filters.reducer';

const GeoSearchPlanningStructures = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.planingStructure.filter);
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const structures = useAppSelector((state) => state.planingStructure.data);
  const selected = useAppSelector((state) => state.planingStructure.selected);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getPlaningStructures({ level: 6, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        options={structures}
        value={selected}
        filterValue={filter}
        search
        placeholder="Планировочная структура"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        // onChangeCheck={(item) => dispatch(addOrRemovePlanningStructure(item))}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemovePlanningStructure(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setPlanningStructureFilter(value));
          // if (value.length >= 1) {
            dispatch(getPlaningStructures({ search: value, level: 6, selected: selectedFilters }));
          // }
          // dispatch(setPlanningStructureFilter(value));
          // if (value.length >= 1) {
          //   dispatch(getPlaningStructures({ search: value, sort: 'asc' }));
          // } else if (value.length === 0) {
          //   dispatch(getPlaningStructures({ search: value, sort: 'asc' }));
          // }
        }}
      />
    </>
  );
};

export default GeoSearchPlanningStructures;
