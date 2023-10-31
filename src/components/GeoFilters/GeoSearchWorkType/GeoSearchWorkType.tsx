import React, { memo, useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveWorkTypes, getWorkTypes, setWorkTypesFilter } from '../../../reducers/workType.reducer';

const GeoSearchWorkType = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.worktype.filter);
  const worktypes: Array<IFilterSelectType> = useAppSelector((state) => state.worktype.data);
  const selected: Array<IFilterSelectType> = useAppSelector((state) => state.worktype.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  // useEffect(() => {
  //   const newCollection = [...new Set([...roadclasses, ...selected])];
  //   setCheckCollection(newCollection);
  // }, [roadclasses, selected]);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={worktypes}
        value={selected}
        filterValue={filter}
        search
        placeholder="Вид работ"
        getOptionValue={(worktype: IFilterSelectType) => worktype.id}
        getOptionLabel={(worktype: IFilterSelectType) => worktype.name}
        onChangeCheck={(item) => dispatch(addOrRemoveWorkTypes(item))}
        //getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setWorkTypesFilter(value));
          if (value.length >= 1) {
            dispatch(getWorkTypes({ search: value, size: 0 }));
          } else if (value.length === 0) {
            dispatch(getWorkTypes({ search: value, size: 0, sort: 'asc' }));
          }
        }}
      />
    </>
  );
};

export default GeoSearchWorkType;
