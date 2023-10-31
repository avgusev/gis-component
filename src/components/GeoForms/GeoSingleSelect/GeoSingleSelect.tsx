import React, { Factory } from 'react';
import Select, { components } from 'react-select';
import { nanoid } from 'nanoid';
import { GeoIcon } from '../../GeoIcon/GeoIcon';
import { GeoSingleSelectType } from './GeoSingleSelect.types';
import './GeoSingleSelect.scss';

const GeoSingleSelect = (props: GeoSingleSelectType) => {
  const { label, placeholder, onChange, value, options, size, defaultValue, isDisabled = false, isLoading = false } = props;

  const idRandom = nanoid();

  return (
    <>
      <label htmlFor={idRandom} className="form-label">
        {label}
      </label>
      <Select
        defaultValue={defaultValue}
        inputId={idRandom}
        options={options}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable
        classNamePrefix="skdf-select"
        className={`skdf-select-container GeoSingleSelect--${size}`}
        maxMenuHeight={256}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          spacing: { ...theme.spacing, controlHeight: 40, menuGutter: 0 },
        })}
        value={value}
        onChange={(event) => {
          onChange(event);
        }}
        isLoading={isLoading}
        components={{
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
          NoOptionsMessage: (props) => <components.NoOptionsMessage {...props} children="Не найдено" />,
          DropdownIndicator: ({ cx }) => (
            <div className={cx({ indicator: true, 'dropdown-indicator': true })}>
              <GeoIcon name="arrow_down" iconType="arrow_down" />
            </div>
          ),
        }}
      />
    </>
  );
};

export default GeoSingleSelect;
