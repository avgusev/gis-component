import React from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveLoading } from '../../../reducers/loading.reducer';

const GeoSearchLoading = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.loading.filter);
  const loadings: Array<IFilterSelectType> = useAppSelector((state) => state.loading.data);
  const selected: boolean | undefined = useAppSelector((state) => state.loading.selected);

  return (
    <>
      <div className="form-check form-switch">
        <input
          id="switch"
          className="form-check-input"
          type="checkbox"
          checked={selected}
          role="switch"
          onChange={(e) => {
            dispatch(addOrRemoveLoading(e?.target.checked));
          }}
        />
        {/* <label htmlFor="switch" className="form-check-label">
          Входит в опорную сеть
        </label> */}
      </div>
    </>
  );
};

export default GeoSearchLoading;
