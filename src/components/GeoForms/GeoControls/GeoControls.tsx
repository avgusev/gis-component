import React from 'react';
import { GeoControlsType } from './GeoControls.types';
import { nanoid } from 'nanoid';

const GeoControls = ({ label = 'Label', className = 'form-check-input', type = 'switch', ...props }: GeoControlsType) => {
  const idRandom = nanoid();

  if (type === 'switch') {
    return (
      // form-check-reverse text-start
      <div className="form-check form-switch">
        <input id={idRandom} className={className} type="checkbox" role="switch" {...props} />
        <label htmlFor={idRandom} className="form-check-label">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="form-check">
      <input id={idRandom} className={className} type={type} {...props} />{' '}
      <label htmlFor={idRandom} className="form-check-label">
        {label}
      </label>
    </div>
  );
};

export default GeoControls;
