import React, { useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveRoute, resetRoutes, getRoutes, setRouteFilter } from '../../../reducers/route.reducer';
import { getCoordinates } from '../../../reducers/coordinate.reducer';
import { IFilterSelectType } from '../../../global.types';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';

const GeoSearchRoutes = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.route.filter);
  const routes = useAppSelector((state) => state.route.data);
  const selected = useAppSelector((state) => state.route.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  useEffect(() => {
    const newCollection = [...new Set([...routes, ...selected])];
    setCheckCollection(newCollection);
  }, [routes, selected]);

  return (
    <>
      <GeoCheckSelect
        //options={checkCollection}
        options={routes}
        value={selected}
        filterValue={filter}
        search
        placeholder="Международный маршрут"
        getOptionValue={(item: IFilterSelectType) => item.id}
        getOptionLabel={(item: IFilterSelectType) => item.name}
        onChangeCheck={(item) => dispatch(addOrRemoveRoute(item))}
        // getCoordinates={(id) => dispatch(getCoordinates(id))}
        onChangeInput={(value) => {
          dispatch(setRouteFilter(value));
          if (value.length >= 1) {
            dispatch(getRoutes({ search: value, size: 0 }));
          } else if (value.length === 0) {
            dispatch(getRoutes({ search: value, size: 0, sort: 'asc' }));
          }
        }}
      />
    </>
  );
};

export default GeoSearchRoutes;
