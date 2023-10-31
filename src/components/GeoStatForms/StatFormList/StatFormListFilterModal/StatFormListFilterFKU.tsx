import React, { useEffect, useState } from 'react';
import GeoCheckSelect from '../../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../../global.types';
// import { useAppDispatch, useAppSelector } from '../../../config/store';
// import { addOrRemoveRegion, getRegions, resetRegions, setRegionFilter } from '../../../reducers/region.reducer';
// import { setFilter, deleteFilter } from '../../../reducers/filters.reducer';
// import { getCoordinates } from '../../../reducers/coordinate.reducer';
// import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';

const StatFormListFilterFKU = () => {
  //   const dispatch = useAppDispatch();
  //   const filter: string = useAppSelector((state) => state.region.filter);
  //   const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);
  //   const regions: Array<IFilterSelectType> = useAppSelector((state) => state.region.data);
  //   const selected: Array<IFilterSelectType> = useAppSelector((state) => state.region.selected);

  //   useEffect(() => {
  //     if (selectedFilters.length > 0 && selected.length <= 0) {
  //       dispatch(getRegions({ level: 1, selected: selectedFilters }));
  //     }
  //   }, [selectedFilters.length]);

  return (
    <>
      <GeoCheckSelect
        options={[]}
        value={null}
        filterValue={null}
        // options={regions}
        // value={selected}
        // filterValue={filter}
        search
        placeholder="ФКУ"
        getOptionValue={(fku: IFilterSelectType) => fku.id}
        getOptionLabel={(fku: IFilterSelectType) => fku.name}
        onChangeCheck={(item, e) => {
          //   dispatch(addOrRemoveRegion(item));
          //   if (e.target.checked) {
          //     dispatch(setFilter(item.id));
          //   } else {
          //     dispatch(deleteFilter(item.id));
          //   }
        }}
        onChangeInput={(value) => {
          //   dispatch(setRegionFilter(value));
          //   dispatch(getRegions({ search: value, level: 1, selected: selectedFilters }));
        }}
      />
    </>
  );
};

export default StatFormListFilterFKU;
