import React from 'react';
import { GeoIcon } from '../GeoIcon/GeoIcon';

const GeoCheckedFlag = ({ isChecked }) => {
  return (
    <div>
      <GeoIcon name={isChecked ? 'checked' : 'unchecked'} iconType={isChecked ? 'checked' : 'unchecked'} />
      <span className="ms-2">{isChecked ? 'Проверено' : 'Непроверено'}</span>
    </div>
  );
};

export default GeoCheckedFlag;
