import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveDistrict, getDistricts, resetDistricts, setDistrictFilter } from '../../../reducers/district.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { deleteFilter, setFilter } from '../../../reducers/filters.reducer';

const GeoSearchDistricts = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.district.filter);
  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  const districts = useAppSelector((state) => state.district.data);
  const selected = useAppSelector((state) => state.district.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  useEffect(() => {
    //const newCollection = [...new Set([...districts, ...selected])];
    const newCollection = [...districts, ...selected];
    const uniqueArr = [...new Map(newCollection.map((item) => [item['id'], item])).values()];
    setCheckCollection(uniqueArr);
  }, [districts, selected]);

  useEffect(() => {
    if (selectedFilters.length > 0 && selected.length <= 0) {
      dispatch(getDistricts({ level: 3, selected: selectedFilters }));
    }
  }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={districts}
        value={selected}
        filterValue={filter}
        search
        placeholder="Район"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        // onChangeCheck={(item) => dispatch(addOrRemoveDistrict(item))}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveDistrict(item));
          if (e.target.checked) {
            dispatch(setFilter(item.id));
          } else {
            dispatch(deleteFilter(item.id));
          }
        }}
        getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setDistrictFilter(value));
          // if (value.length >= 1) {
            dispatch(getDistricts({ search: value, level: 3, selected: selectedFilters }));
          // }
          // dispatch(setDistrictFilter(value));
          // if (value.length >= 1) {
          //   dispatch(getDistricts({ search: value, sort: 'asc' }));
          // } else if (value.length === 0) {
          //   dispatch(getDistricts({ search: value, sort: 'asc' }));
          // }
        }}
      />
    </>
  );
};

export default GeoSearchDistricts;
