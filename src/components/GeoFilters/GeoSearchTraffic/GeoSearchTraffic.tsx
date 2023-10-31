import React, { memo, useEffect, useState } from 'react';
import '../GeoSearchFilters.scss';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { addOrRemoveRegion, getRegions, resetRegions, setRegionFilter } from '../../../reducers/region.reducer';

import { getCoordinates } from '../../../reducers/coordinate.reducer';
import GeoCheckSelect from '../../GeoCheckedSelects/GeoCheckedSelects';
import { IFilterSelectType } from '../../../global.types';
import GeoInputRange from '../../GeoInputRange/GeoInputRange';
import { addOrRemoveRoadwayWidth } from '../../../reducers/roadwaywidth.reducer';
import { addOrRemoveTraffic } from '../../../reducers/traffic.reducer';
import GeoInputRangeTest from '../../GeoInputRangeTest/GeoInputRangeTest';

const GeoSearchTraffic = () => {
  const dispatch = useAppDispatch();
  const filter: string = useAppSelector((state) => state.traffic.filter);
  const trafficFilter: [undefined, undefined] = useAppSelector((state) => state.traffic.data);
  const selected: [undefined, undefined] = useAppSelector((state) => state.traffic.selected);
  const [checkCollection, setCheckCollection] = useState<IFilterSelectType[]>([]);

  return (
    <>
      <GeoInputRangeTest
        id="lanes-range"
        label=""
        rangeType="number"
        min={trafficFilter?.[0]}
        max={trafficFilter?.[1]}
        value={selected}
        onChange={(val) => {
          dispatch(addOrRemoveTraffic(val));
        }}
        tooltipPlacement="right-start"
        isValidation={false}
      />
    </>
  );
};

export default GeoSearchTraffic;
