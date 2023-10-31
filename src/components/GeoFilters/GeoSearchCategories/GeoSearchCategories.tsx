import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveCategory, getCategories, resetCategories, setCategoryFilter } from '../../../reducers/category.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';

const GeoSearchCategories = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.category.filter);
  const categories = useAppSelector((state) => state.category.data);
  const selected = useAppSelector((state) => state.category.selected);

  return (
    <>
      <GeoCheckSelect
        // options={checkCollection}
        options={categories}
        value={selected}
        filterValue={filter}
        search
        placeholder="Категории"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item) => dispatch(addOrRemoveCategory(item))}
        onChangeInput={(value) => {
          dispatch(setCategoryFilter(value));
          if (value.length >= 1) {
            dispatch(getCategories({ search: value, size: 0 }));
          } else if (value.length === 0) {
            dispatch(getCategories({ search: value, size: 0, sort: 'asc' }));
          }
        }}
      />
    </>
  );
};

export default GeoSearchCategories;
