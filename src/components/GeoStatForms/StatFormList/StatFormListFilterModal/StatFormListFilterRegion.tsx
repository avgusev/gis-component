import React from 'react';
import GeoCheckSelect from '../../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../../global.types';
import { useAppDispatch, useAppSelector } from '../../../../config/store';
import { setRegionFilter, addOrRemoveRegion, getRegions } from '../../../../reducers/statForm.reducer';

const StatFormListFilterRegion = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.statForm.filterRegion);
  const regions: any = useAppSelector((state) => state.statForm.filterRegionOptions);
  const selected: any = useAppSelector((state) => state.statForm.selectedFilterRegion);

  return (
    <>
      <GeoCheckSelect
        options={regions}
        value={selected}
        filterValue={filter}
        search
        placeholder="Регион"
        getOptionValue={(region: IFilterSelectType) => region.id}
        getOptionLabel={(region: IFilterSelectType) => region.name}
        onChangeCheck={(item, e) => {
          dispatch(addOrRemoveRegion(item));
        }}
        onChangeInput={(value) => {
          dispatch(setRegionFilter(value));
          dispatch(getRegions({ search: value, level: 1 }));
        }}
      />
    </>
  );
};

export default StatFormListFilterRegion;
