import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveTown, getTowns, resetTowns, setTownFilter } from '../../../reducers/town.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { deleteFilter, setFilter } from '../../../reducers/filters.reducer';

const GeoSearchTowns = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.town.filter);
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const towns = useAppSelector((state) => state.town.data);
  const selected = useAppSelector((state) => state.town.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  useEffect(() => {
    //const newCollection = [...new Set([...towns, ...selected])];
    const newCollection = [...towns, ...selected];
    const uniqueArr = [...new Map(newCollection.map((item) => [item['id'], item])).values()];
    setCheckCollection(uniqueArr);
  }, [towns, selected]);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getTowns({ level: 5, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={towns}
        value={selected}
        filterValue={filter}
        search
        placeholder="Населенный пункт"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveTown(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setTownFilter(value));
          // if (value.length >= 1) {
            dispatch(getTowns({ search: value, level: 5, selected: selectedFilters }));
          // }
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

export default GeoSearchTowns;
