import React, { memo, useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveRegion, getRegions, resetRegions, setRegionFilter } from '../../../reducers/region.reducer';

import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import GeoInputRange from '../../GeoInputRange/GeoInputRange';
import { addOrRemoveRoadwayWidth } from '../../../reducers/roadwaywidth.reducer';
import GeoInputRangeTest from '../../GeoInputRangeTest/GeoInputRangeTest';

const GeoRoadWayWidth = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.roadwaywidth.filter);
  const roadwayWidth: [undefined, undefined] = useAppSelector((state) => state.roadwaywidth.data);
  const selected: [undefined, undefined] = useAppSelector((state) => state.roadwaywidth.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  return (
    <>
      <GeoInputRangeTest
        id="lanes-range"
        label=""
        rangeType="number"
        min={roadwayWidth?.[0]}
        max={roadwayWidth?.[1]}
        value={selected}
        onChange={(val) => {
          dispatch(addOrRemoveRoadwayWidth(val));
        }}
        tooltipPlacement="right-start"
        isValidation={false}
      />
    </>
  );
};

export default GeoRoadWayWidth;
