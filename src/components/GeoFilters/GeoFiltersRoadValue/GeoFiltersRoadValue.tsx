import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { setRoadValuesFilter, addOrRemoveRoadValues, getRoadValues  } from '../../../reducers/roadValue.reducer';

const GeoFiltersRoadValue = () => {
    const dispatch = useAppDispatch();
    const filter: string = useAppSelector((state) => state.roadvalues.filter);
    const roadvalues: Array<IFilterSelectType> = useAppSelector((state) => state.roadvalues.data);
    const selected: Array<IFilterSelectType> = useAppSelector((state) => state.roadvalues.selected);

  return (
     <>
     <GeoCheckSelect
       options={roadvalues}
       value={selected}
       filterValue={filter}
       search
       placeholder="Значение дороги"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
       onChangeCheck={(item) => dispatch(addOrRemoveRoadValues(item))}
       onChangeInput={(value) => {
         dispatch(setRoadValuesFilter(value));
         if (value.length >= 1) {
           dispatch(getRoadValues({ search: value, size: 0 }));
         } else if (value.length === 0) {
           dispatch(getRoadValues({ search: value, size: 0, sort: 'asc' }));
         }
       }}
     />
   </>
  );
};

export default GeoFiltersRoadValue;