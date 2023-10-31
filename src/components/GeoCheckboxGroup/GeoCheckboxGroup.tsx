import React from 'react';
import { nanoid } from 'nanoid';
import { GeoCheckboxGroupTypes } from './GeoCheckbox.types';
import './GeoCheckboxGroup.scss';

const GeoCheckboxGroup = ({ title, checkboxesNames }: GeoCheckboxGroupTypes) => {
  return (
    <div>
      <div className="GeoCheckboxGroup__title mb-3">{title}</div>
      {checkboxesNames.map((checkbox) => {
        const randomId = nanoid();
        return (
          <div className="form-check mb-3">
            <input id={randomId} className="GeoCheckboxGroup__input form-check-input" type="checkbox" />{' '}
            <label htmlFor={randomId} className="form-check-label">
              {checkbox}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default GeoCheckboxGroup;
