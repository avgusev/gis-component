import React, { memo, useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveRoadClasses, getRoadClasses, setRoadClassesFilter } from '../../../reducers/roadClass.reducer';

const GeoSearchRoadClass = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.roadclass.filter);
  const roadclasses: Array<IFilterSelectType> = useAppSelector((state) => state.roadclass.data);
  const selected: Array<IFilterSelectType> = useAppSelector((state) => state.roadclass.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  // useEffect(() => {
  //   const newCollection = [...new Set([...roadclasses, ...selected])];
  //   setCheckCollection(newCollection);
  // }, [roadclasses, selected]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={roadclasses}
        value={selected}
        filterValue={filter}
        search
        placeholder="Класс"
        getOptionValue={(roadclass: IFilterSelectType) => roadclass.id}
        getOptionLabel={(roadclass: IFilterSelectType) => roadclass.name}
        onChangeCheck={(item) => dispatch(addOrRemoveRoadClasses(item))}
        //getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setRoadClassesFilter(value));
          if (value.length >= 1) {
            dispatch(getRoadClasses({ search: value, size: 0 }));
          } else if (value.length === 0) {
            dispatch(getRoadClasses({ search: value, size: 0, sort: 'asc' }));
          }
        }}
      />
    </>
  );
};

export default GeoSearchRoadClass;
