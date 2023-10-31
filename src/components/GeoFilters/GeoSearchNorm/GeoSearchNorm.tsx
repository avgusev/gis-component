import React from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveNorm } from '../../../reducers/norm.reducer';

const GeoSearchNorm = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.norm.filter);
  const norms: Array<IFilterSelectType> = useAppSelector((state) => state.norm.data);
  const selected: boolean | undefined = useAppSelector((state) => state.norm.selected);

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
            dispatch(addOrRemoveNorm(e?.target.checked));
          }}
        />
        {/* <label htmlFor="switch" className="form-check-label">
          Входит в опорную сеть
        </label> */}
      </div>
    </>
  );
};

export default GeoSearchNorm;
