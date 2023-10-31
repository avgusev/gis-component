import React from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { IFilterSelectType } from '../../../global.types';
import { addOrRemoveDtp } from '../../../reducers/dtp.reducer';

const GeoSearchDtp = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.dtp.filter);
  const dtp: Array<IFilterSelectType> = useAppSelector((state) => state.dtp.data);
  const selected: boolean | undefined = useAppSelector((state) => state.dtp.selected);

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
            dispatch(addOrRemoveDtp(e?.target.checked));
          }}
        />
        {/* <label htmlFor="switch" className="form-check-label">
          Входит в опорную сеть
        </label> */}
      </div>
    </>
  );
};

export default GeoSearchDtp;
