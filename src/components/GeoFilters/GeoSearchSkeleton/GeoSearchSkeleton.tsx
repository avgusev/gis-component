import React from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveSkeleton } from '../../../reducers/skeleton.reducer';

const GeoSearchSkeleton = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.skeleton.filter);
  const skeletons: Array<IFilterSelectType> = useAppSelector((state) => state.skeleton.data);
  const selected: boolean | undefined = useAppSelector((state) => state.skeleton.selected);

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
            dispatch(addOrRemoveSkeleton(e?.target.checked));
          }}
        />
        {/* <label htmlFor="switch" className="form-check-label">
          Входит в опорную сеть
        </label> */}
      </div>
    </>
  );
};

export default GeoSearchSkeleton;
